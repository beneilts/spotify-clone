import { atom } from "recoil";

export const playlistState = atom({
    key: "playlistState",
    default: null
})

export const playlistArrayState = atom({
    key: "playlistArrayState",
    default: []
})

export const playlistIdState = atom({
    key: "playlistIdState",
    default: '6RnqdI6gohWOcMlwbisZyt'
})

export const playlistModalState = atom({
    key: "playlistModalState",
    default: false
})