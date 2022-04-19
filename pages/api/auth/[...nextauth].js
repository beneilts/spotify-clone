import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

// Referenced Documentation: https://next-auth.js.org/tutorials/refresh-token-rotation

async function refreshAccessToken(token) {
    try {
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        // renaming the returned body to 'refreshedToken'
        const {body: refreshedToken} = await spotifyApi.refreshAccessToken()
        console.log(">> Refreshed token is:", refreshedToken)

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1hr as 3600 returns from spotify API
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken // Replace if new one came back else fall back to old refresh token
        }
    } catch (error) {
        console.log(error)
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, account, user }) {
            //initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    userName: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000, // handling expiry times in milliseconds
                }
            }

            //Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                console.log(">> Existing access token is valid")
                return token
            }

            // Access toekn has expired, so we need to update it
            console.log(">> Access token has expired!")
            return await refreshAccessToken(token)
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken
            session.user.refreshToken = token.refreshToken
            session.user.userName = token.userName
      
            return session
        },
    }
})