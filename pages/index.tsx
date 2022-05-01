import Sidebar from "../components/Sidebar"
import Center from "../components/Center"
import Player from "../components/Player"
import PlaylistModal from "../components/PlaylistModal"
import { getSession } from 'next-auth/react'

export default function Home() {
    return (
        <div className="bg-black h-screen overflow-hidden">
            <main className="flex">
                <Sidebar />
                <Center />
                {/* Center */}
            </main>

            <div className="sticky bottom-0">
                <Player />
            </div>

            <PlaylistModal />
        </div>
    )
}

// 2:44:00
export async function getServerSideProps(context) {
    const session = await getSession(context)
    return {
        props: {
            session
        }
    }
}
