# Spotify Clone

This project is a Spotify clone that allows users to create and edit playlists, play songs, and skip tracks. It was built using Next.js for the front end, Recoil for state management, and the Spotify Web API for authentication and backend calls.

## Tech Stack

- Next.js
- Recoil
- Tailwind CSS
- Spotify Web API

## Features

- User authentication using the Spotify Web API.
- Displaying user's playlists and songs.
- Creating and editing playlists.
- Playing songs and skipping tracks.
- Responsive design using Tailwind CSS.

## Setup

To run the project locally, you will need to do the following:

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Create an account on [Spotify for Developers](https://developer.spotify.com/).
4. Create a new app for your project and go to the settings.
5. Add a new redirect URI. Something like `http://localhost:3000/api/auth/callback/spotify`.
6. Create a `.env.local` file in the root directory and add the following variables:
```
NEXTAUTH_URL=<mostly can just use http://localhost:3000>
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=<your Spotify client ID>
NEXT_PUBLIC_CLIENT_SECRET=<your Spotify client secret>
JWT_SECRET=<some_super_secret_value>
```
7. Start the development server using `npm start`

Please read the [documentation](https://developer.spotify.com/documentation/) for more specifics.

## Notes

This project was created as a learning exercise and is not affiliated with Spotify in any way. Please use your own Spotify account for testing purposes.
