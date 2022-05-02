import { ChevronDownIcon } from "@heroicons/react/outline"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { shuffle } from "lodash"
import { useRecoilValue, useRecoilState } from "recoil"
import { playlistIdState, playlistModalState, playlistState } from "../atoms/playlistAtom"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSpotify from "../hooks/useSpotify"
import Songs from "../components/Songs"
import { 
    PlayIcon,
    PencilAltIcon,
} from "@heroicons/react/solid"

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purplee-500"
]

const defaultPlaylistImage = "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"

function Center() {
    const spotifyApi = useSpotify()
    const {data: session} = useSession()
    const [color, setColor] = useState(null)
    const playlistId = useRecoilValue(playlistIdState) // Read only value
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [showModal, setPlaylistModalState] = useRecoilState(playlistModalState)

    //console.log(playlistId)

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            if (playlistId === "liked"){
                spotifyApi.getMySavedTracks().then((data) => {
                    let playlist = {
                        id: "liked",
                        images: [{url:"https://i.pinimg.com/236x/fe/5c/36/fe5c36b8b4cbaa728f3c03a311e002cb.jpg"}],
                        name: "Liked Songs",
                        public: false,
                        uri: "",
                        tracks: {items: data.body?.items }
                    }
                    setPlaylist(playlist)
                }).catch(error => console.log("Could not get playlist!", error))
            } else {
                spotifyApi.getPlaylist(playlistId).then((data) => {
                    setPlaylist(data.body)
                }).catch(error => console.log("Could not get playlist!", error))
            }
        }
    }, [spotifyApi, playlistId, session])

    const handleLogoutHover = (isHover) => {
        let userName = document.getElementById('userName')
        if (isHover) {
            userName.innerHTML = "Logout"
        }else {
            userName.innerHTML = session?.user.name
        }
    }

    const handleStartPlaylist = () => {
        if (playlist?.tracks?.items.length === 0) return
        setCurrentTrackId(playlist?.tracks?.items[0].track.id)
        setIsPlaying(true)

        if (playlist.id === "liked"){
            spotifyApi.play({
                uris: [playlist?.tracks?.items[0].track.uri],
            })
        }else {
            spotifyApi.play({
                context_uri: playlist.uri,
            })
        }
    }

    return (
        // #TODO: style the scroll bar instead of hiding it
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8 text-white">
                <div onClick={() => signOut()} onMouseOver={()=>handleLogoutHover(true)} onMouseOut={()=>handleLogoutHover(false)} className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                    <img className="rounded-full w-10 h-10" src={session?.user.image} alt=""/>
                    <h2 id="userName">{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5"/>
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img className="h-60 w-60 shadow-2xl" src={playlist?.images?.[0]?.url || defaultPlaylistImage} alt=""/>

                <div>
                    {/* playlist.public does not seem to return the correct value. Maybe a bug with the API? */}
                    <p className="font-bold">{playlist?.public ? 'PUBLIC PLAYLIST' : 'PRIVATE PLAYLIST'}</p>
                    <h1 className="text-2xl md:text-3xl xl:text-8xl font-bold">{playlist?.name}</h1>
                    <p className="text-gray-400 mt-6">{playlist?.description}</p>
                </div>
            </section>

            <div className="flex px-8 space-x-3 items-center">
                <PlayIcon className="button w-16 h-16 text-green-500 hover:text-green-500" onClick={handleStartPlaylist}/>
                <PencilAltIcon className={`button w-8 h-8 text-gray-500 ${playlist?.id === "liked" ? "hidden" : ""}`} onClick={() => setPlaylistModalState(true)}/>
            </div>

            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Center