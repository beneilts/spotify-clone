import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import Head from 'next/head'

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
    return (
        <SessionProvider>
            <RecoilRoot>
                <Head>
                    <title>Spotify Clone</title>
                    <link rel="icon" href="/spotify_icon.png"/>
                </Head>
                <Component {...pageProps} />
            </RecoilRoot>
        </SessionProvider>
    )
}

export default MyApp
