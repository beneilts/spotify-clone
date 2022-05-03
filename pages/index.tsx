import Sidebar from "../components/Sidebar"
import Center from "../components/Center"
import Player from "../components/Player"
import PlaylistModal from "../components/PlaylistModal"
import { getSession, GetSessionParams } from 'next-auth/react'

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

export async function getServerSideProps(context: GetSessionParams | undefined) {
    const session = await getSession(context)
    return {
        props: {
            session
        }
    }
}
