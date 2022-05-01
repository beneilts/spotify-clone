import { useSession } from "next-auth/react"
import { useRecoilState } from "recoil"
import { useCallback, useEffect, useState } from "react"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSpotify from "../hooks/useSpotify"
import useSongInfo from "../hooks/useSongInfo"
import { debounce } from "lodash"
import { HeartIcon, VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/outline"
import { 
    RewindIcon,
    SwitchHorizontalIcon,
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    HeartIcon as HeartIconSolid
} from "@heroicons/react/solid"

function MillisToMinutesAndSeconds(millis){
    const minutes = Math.floor(millis / 60000)
    const seconds = ((millis % 60000) / 1000).toFixed(0)
    return seconds == 60
        ? minutes + 1 + ":00"
        : minutes + ":" + (seconds < 10 ? "0" : "") + seconds
}

function Player() {
    const spotifyApi = useSpotify()
    const songInfo = useSongInfo()
    const { data: session } = useSession()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)
    const [songProgress, setSongProgress] = useState(0)
    const [shuffleState, setShuffleState] = useState(false)
    const [repeatState, setRepeatState] = useState("off")

    const fetchCurrentSong = () => {
        spotifyApi.getMyCurrentPlayingTrack().then(data => {
            setCurrentTrackId(data.body?.item?.id)
        })
    }

    // Track the progress of the currently playing song
    useEffect(() => {
        let interval = null
      
        if (isPlaying){
            interval = setInterval(() => {
                setSongProgress((songProgress) => {
                    if (songProgress < songInfo?.duration_ms) {
                        return songProgress + 1000
                    } else {
                        return songProgress
                    }
                })
            }, 1000)
        } else {
            clearInterval(interval)
        }

        return () => {
            clearInterval(interval)
        }
    }, [isPlaying])

    // Track songProgress and update songInfo when song ends
    useEffect(() => {
        if (songProgress > songInfo?.duration_ms){
            fetchCurrentSong()
        }
    }, [songProgress, songInfo])

    // Initialize
    useEffect(() => {
        if (!currentTrackId && spotifyApi.getAccessToken()) {
            // Set data from the playback state
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                setShuffleState(data.body?.shuffle_state)
                setRepeatState(data.body?.repeat_state)
                setSongProgress(data.body?.progress_ms || 0)
                setIsPlaying(data.body?.is_playing)
                //console.log(data.body)
            }).catch(err => console.log("Could not get playback state!", err))
            
            // fetch the song info
            fetchCurrentSong()
            setVolume(50)
        }
    }, [currentTrackId, session, spotifyApi])

    // Handle songInfo change
    useEffect(() => {
        setTimeout(() => {
            spotifyApi.getMyCurrentPlaybackState().then((data) => {
                setSongProgress(data.body?.progress_ms || 0)
            }).catch((err) => {
                console.log("Couldn't get current track!", err)
            })
        }, 500);
    }, [songInfo, spotifyApi, session])

    // Handle volume change input
    useEffect(() => {
        if (volume >= 0 && volume <= 100){
            debounceAdjustVolume(volume)
        }
    }, [volume])

    // Debounce volume API calls 
    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            if (spotifyApi.getAccessToken()) {
                spotifyApi.setVolume(volume).catch((err) => {console.log("Could not set volume!", err)})
            }
        }, 500)
    , [])

    // Debounce seek API calls for changing song progress
    const debounceSetProgress = useCallback(
        debounce((progress, songDuration) => {
            if (progress >= 0 && progress <= songDuration && spotifyApi.getAccessToken()) {
                spotifyApi.seek(progress).catch((err) => {console.log("Could not set song progress!", err)})
            }
        }, 500)
    , [])

    const handleShuffle = () => {
        spotifyApi.setShuffle(!shuffleState)
        setShuffleState(!shuffleState)
    }

    const handleRepeat = () => {
        if (repeatState === "off") {
            spotifyApi.setRepeat("context")
            setRepeatState("context")
        }else {
            spotifyApi.setRepeat("off")
            setRepeatState("off")
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body?.is_playing) {
                spotifyApi.pause()
                setIsPlaying(false)
            }else {
                spotifyApi.play()
                setIsPlaying(true)
            }
        })
    }

    const handleSkip = (toNext) => {
        if (toNext===true) {
            spotifyApi.skipToNext()
        }else {spotifyApi.skipToPrevious()}

        setTimeout(() => {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body.item.id)
            }).catch((err) => {
                console.log("Couldn't get current track after skipping!", err)
            })

            if (!isPlaying){
                setIsPlaying(true)
            }
        }, 500);
    }

    const handleMuteUnmute = () => {
        if (volume != 0) {
            setVolume(0)
        }else {
            setVolume(50)
        }
    }

    return (
        <div className="text-gray-500 h-24 bg-gradient-to-b from-black to-gray-900 border-t border-gray-900 
                        grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img className={`hidden h-14 w-14 ${songInfo?.album.images?.[0]?.url ? "md:inline" : ""}`} src={songInfo?.album.images?.[0]?.url} alt=""/>
                <div>
                    <h3 className="text-white">{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* Center */}
            <div className="flex flex-col justify-center space-y-2">
                <div className="flex items-center justify-center space-x-5">
                    <SwitchHorizontalIcon className={`button ${shuffleState ? "text-green-500 hover:text-green-500" : "hover:text-white"}`} onClick={handleShuffle}/>
                    <RewindIcon className="button" onClick={()=>handleSkip()}/> {/* #FIXME API functionality does not work*/}

                    {isPlaying ? (
                        <PauseIcon className="button w-10 h-10 text-white" onClick={handlePlayPause}/>
                    ): (
                        <PlayIcon className="button w-10 h-10 text-white" onClick={handlePlayPause}/>
                    )}

                    <FastForwardIcon className="button" onClick={()=>handleSkip(true)}/>
                    <ReplyIcon className={`button ${(repeatState === "context") ? "text-green-500 hover:text-green-500" : "hover:text-white"}`} onClick={handleRepeat}/>
                </div>

                <div className="flex items-center justify-center text-gray-400 text-sm space-x-2">
                    <p>{MillisToMinutesAndSeconds(songProgress)}</p>
                    <input className="h-1 w-5/6 accent-green-500" type="range" value={songProgress} min={0} max={songInfo?.duration_ms ? songInfo?.duration_ms : (songProgress + 1000)} onChange={(e) => setSongProgress(Number(e.target.value))} onMouseUp={()=>debounceSetProgress(songProgress, songInfo?.duration_ms)}/>
                    <p>{songInfo?.duration_ms ? MillisToMinutesAndSeconds(songInfo?.duration_ms) : "--"}</p>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                {volume != 0 ? (
                    <VolumeUpIcon className="button" onClick={handleMuteUnmute}/>
                ): (
                    <VolumeOffIcon className="button " onClick={handleMuteUnmute}/>
                )}  
                <input className="w-14 md:w-28 accent-green-500" type="range" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))}/>      
            </div>
        </div>
    )
}

export default Player