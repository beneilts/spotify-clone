import useSpotify from "../hooks/useSpotify"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"

function Song({order, track}) {
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

    const playSong = () => {
        console.log(">> playing song")
        setCurrentTrackId(track.track.id)
        setIsPlaying(true)
        spotifyApi.play({
            // URI => Uniform Resource Identifier
            uris: [track.track.uri]
        })
    }

    function GetDateString(date) {
        var newDate = new Date(date)
        return newDate.toDateString()
    }

    function MillisToMinutesAndSeconds(millis){
        const minutes = Math.floor(millis / 60000)
        const seconds = ((millis % 60000) / 1000).toFixed(0)
        return seconds == 60
            ? minutes + 1 + ":00"
            : minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    }

    //console.log(track)

    return (
        <div onClick={playSong} className="grid grid-cols-3 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4">
                <p>{order+1}</p>
                <img className="h-10 w-10" src={track.track.album.images[0].url}/>
                <div className="w-36 lg:w-64">
                    <p className="text-white truncate">{track.track.name}</p>
                    <p className="truncate">{track.track.artists[0].name}</p>
                </div>
            </div>

            <p className="self-center hidden sm:inline">{track.track.album.name}</p>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="w-40 hidden md:inline">{GetDateString(track.added_at)}</p>
                <p className="">{MillisToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song