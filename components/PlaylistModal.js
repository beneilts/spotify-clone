// Source for modal: https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/modals/regular

import { playlistArrayState, playlistModalState, playlistState } from "../atoms/playlistAtom"
import { useRecoilValue, useRecoilState } from "recoil"
import { XIcon } from "@heroicons/react/outline"
import useSpotify from "../hooks/useSpotify"
import { useEffect, useState } from "react"

const defaultPlaylistImage = "https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large?v=v2&px=999"

export default function Modal() {
    const spotifyApi = useSpotify()
    const [showModal, setPlaylistModalState] = useRecoilState(playlistModalState)
    const [playlists, setPlaylistArrayState] = useRecoilState(playlistArrayState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [playlistName, setPlaylistName] = useState(playlist?.name)
    const [playlistDescription, setPlaylistDescription] = useState(playlist?.description)

    useEffect(() => {
        setPlaylistName(playlist?.name)
        setPlaylistDescription(playlist?.description)
    }, [showModal])

    const handleSave = () => {
        if (playlistName === "") return

        let newDetails = {
            name: playlistName
        }

        if (playlistDescription !== "") {
            newDetails = {
                name: playlistName,
                description: playlistDescription
            }
        }

        setPlaylistModalState(false)
        if (spotifyApi.getAccessToken()) {
            spotifyApi.changePlaylistDetails(playlist.id, newDetails).then (() => {
                setTimeout(() => {
                    if (spotifyApi.getAccessToken()) {
                        spotifyApi.getUserPlaylists().then((data) => {
                            setPlaylistArrayState(data.body.items)
                        })

                        spotifyApi.getPlaylist(playlist.id).then((data) => {
                            setPlaylist(data.body)
                        }).catch(error => console.log("Could not get playlist!", error))
                    }
                }, 500);
            }).catch ((err) => console.log("Couldn't change playlist details!", err))
        }
    }

    return (
        <>
        {showModal ? (
            <>
            <div className="text-white justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Edit details
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent rounded-full hover:bg-gray-500 border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setPlaylistModalState(false)}
                            >
                                <XIcon className="w-8 h-8"/>
                            </button>
                        </div>
                        {/*body*/}
                        <div className="flex space-x-4 px-6">
                            <img className="hidden h-5/12 w-5/12 md:inline" src={playlist?.images?.[0]?.url || defaultPlaylistImage} alt=""/>
                            <div className="flex flex-col space-y-5 w-7/12">
                                <div className="flex h-10 relative bg-gray-500 rounded-md border border-gray-400 p-2">
                                    <p className="absolute text-xs -top-2.5 bg-gray-700 rounded-sm px-1">Name</p>
                                    <input value={playlistName} onChange={(e)=>setPlaylistName(e.target.value)} className="bg-transparent focus:outline-none w-full"/>
                                </div>
                                <div className="flex-1 relative bg-gray-500 rounded-md border border-gray-400 p-2">
                                    <p className="absolute text-xs -top-2.5 bg-gray-700 rounded-sm px-1">Description</p>
                                    <textarea value={playlistDescription} onChange={(e)=>setPlaylistDescription(e.target.value)} maxLength={300} className="bg-transparent resize-none focus:outline-none w-full h-full align-top" placeholder="Add an optional description"/>
                                </div>
                            </div>
                        </div>
                        {/*footer*/}
                        <div className="flex items-center justify-end pr-6 py-3 rounded-b">
                            <button
                                className="bg-green-500 text-white hover:bg-green-600 font-bold text-lg px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
            </>
        ) : null}
        </>
    );
}