import { ChevronDownIcon } from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { shuffle } from "lodash"
import { useRecoilValue, useRecoilState } from "recoil"
import { playlistIdState, playlistState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "../components/Songs"

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purplee-500"
]

function Center() {
    const spotifyApi = useSpotify()
    const {data: session} = useSession()
    const [color, setColor] = useState(null)
    const playlistId = useRecoilValue(playlistIdState) // Read only value
    const [playlist, setPlaylist] = useRecoilState(playlistState)

    //console.log(playlistId)

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getPlaylist(playlistId).then((data) => {
                //console.log("PLAYLIST:", data.body)
                setPlaylist(data.body)
            }).catch(error => console.log("Could not get playlist!", error))
        }
    }, [spotifyApi, playlistId, session])

    return (
        // #TODO: style the scroll bar instead of hiding it
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8 text-white">
                <div onClick={() => signOut()} className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                    <img className="rounded-full w-10 h-10" src={session?.user.image} alt=""/>
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5"/>
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt=""/>

                <div>
                    {/* playlist.public does not seem to return the correct value. Maybe a bug with the API? */}
                    <p>{playlist?.public ? 'PUBLIC PLAYLIST' : 'PRIVATE PLAYLIST'}</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>

            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center