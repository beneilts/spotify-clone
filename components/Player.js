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

function Player() {
    const spotifyApi = useSpotify()
    const songInfo = useSongInfo()
    const { data: session } = useSession()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volume, setVolume] = useState(50)
    
    const fetchCurrentSong = () => {
        if (!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now playing: ", data.body?.item)
                setCurrentTrackId(data.body?.item?.id)

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId){
            // fetch the song info
            fetchCurrentSong()
            setVolume(50)
        }
    }, [currentTrackId, spotifyApi, session])

    useEffect(() => {
        if (volume >= 0 && volume <= 100){
            debounceAdjustVolume(volume)
        }
    }, [volume])

    const debounceAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {})
        }, 500)
    , [])

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

    const handleSkipToNext = () => {
        // spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        //     console.log("Current Track:", data.body)
        // }).catch((err) => {
        //     console.log("Skip to next error!", err)
        // })

        spotifyApi.skipToNext({}).then(() => {
            console.log("Skip to next")
            if (!isPlaying){
                setIsPlaying(true)
            }
        }).catch((err) => {
            console.log("Skip to next error!", err)
        })
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
                <img className="hidden md:inline h-14 w-14" src={songInfo?.album.images?.[0]?.url} alt=""/>
                <div>
                    <h3 className="text-white">{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button"/>
                <RewindIcon className="button"/> {/* #FIXME API functionality does not work*/}

                {isPlaying ? (
                    <PauseIcon className="button w-10 h-10 text-white" onClick={handlePlayPause}/>
                ): (
                    <PlayIcon className="button w-10 h-10 text-white" onClick={handlePlayPause}/>
                )}

                <FastForwardIcon className="button" onClick={handleSkipToNext}/>
                <ReplyIcon className="button"/>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                {volume != 0 ? (
                    <VolumeUpIcon className="button" onClick={handleMuteUnmute}/>
                ): (
                    <VolumeOffIcon className="button" onClick={handleMuteUnmute}/>
                )}  
                <input className="w-14 md:w-28" type="range" value={volume} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))}/>      
            </div>
        </div>
    )
}

export default Player