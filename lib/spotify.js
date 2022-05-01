import SpotifyWebApi from "spotify-web-api-node";

// https://developer.spotify.com/documentation/web-api/reference/#/
// https://github.com/thelinmichael/spotify-web-api-node
// https://next-auth.js.org/providers/spotify

const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-email",
    "streaming",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read"
].join(',') // join will put all the array items into a single string separated by commas

const params = {
    scope: scopes
}

const queryParamString = new URLSearchParams(params) //URLSearchParams is built into JS
const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

export default spotifyApi

export {LOGIN_URL}
