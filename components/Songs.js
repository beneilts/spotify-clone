import { useRecoilValue } from "recoil"
import { playlistState } from "../atoms/playlistAtom"
import { ClockIcon } from "@heroicons/react/outline"
import Song from "../components/Song"

function Songs() {
    const playlist = useRecoilValue(playlistState) // Read only value

    return (
        <div className="px-8 flex-col space-y-1 pb-28 text-white ">
            <div className="border-b border-gray-900 grid grid-cols-3 text-gray-500 py-4 px-5">
                <div className="flex space-x-3 w-36 lg:w-64">
                    <p>#</p>
                    <p className="truncate">TITLE</p>
                </div>
                <p className="hidden sm:inline">ALBUM</p>
                
                <div className="flex items-center justify-between ml-auto md:ml-0">
                    <p className="w-40 hidden md:inline">DATE ADDED</p>
                    <ClockIcon className="h-5 w-5"/>
                </div>
            </div>

            

            {playlist?.tracks.items.map((track, i) => (
                <Song key={track.track.id} track={track} order={i}/>
            ))}
        </div>
    )
}

export default Songs