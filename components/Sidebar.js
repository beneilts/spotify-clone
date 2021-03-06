import {HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon} from "@heroicons/react/outline"
import { HeartIcon } from "@heroicons/react/solid"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { playlistIdState, playlistArrayState } from "../atoms/playlistAtom"
import useSpotify from "../hooks/useSpotify"

function Sidebar() {
    const spotifyApi = useSpotify()
    const {data: session, status} = useSession()
    const [playlists, setPlaylistArrayState] = useRecoilState(playlistArrayState)
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState) // Used for setting global state of playlistIdState

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylistArrayState(data.body.items)
            })
        }
    }, [session, spotifyApi])

    const handleLikedSongs = () => {
        setPlaylistId("liked")
    }

    const handleCreatePlaylist = () => {
        spotifyApi.createPlaylist(`My Playlist #${playlists.length+1}`).then(() => {
            setTimeout(() => {
                if (spotifyApi.getAccessToken()) {
                    spotifyApi.getUserPlaylists().then((data) => {
                        setPlaylistArrayState(data.body.items)
                    })
                }
            }, 500);
        }).catch ((err) => {
            console.log("Couldn't create playlist!", err)
        })
    }

    return (
        <div className="hidden md:inline-flex text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 
                        overflow-y-scroll scrollbar-hide h-screen min-w-[11rem] sm:max-w-[12rem] lg:max-w-[15rem] pb-36">
            <div className="space-y-4">
                {/* <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5"/>
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5"/>
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5"/>
                    <p>Your Library</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900"/> */}

                <button onClick={handleCreatePlaylist} className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5"/>
                    <p>Create Playlist</p>
                </button>
                <button onClick={handleLikedSongs} className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5"/>
                    <p>Liked Songs</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900"/>

                {/* Playlists */}
                {playlists.map((playlist) => (
                    <p key={playlist.id} onClick={()=>setPlaylistId(playlist.id)} className={`pr-2 cursor-pointer hover:text-white ${playlist.id === playlistId ? "text-gray-200" : ""}`}>{playlist.name}</p>
                ))}
                
            </div>
        </div>
    )
}

export default Sidebar