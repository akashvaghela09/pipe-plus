import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    streamUrl: "",
    isPlaying: false,
    isFullScreen: false,
    isVisible: false,
    size: "normal",
    settingsOpen: false,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setStreamUrl: (state, action) => {
            state.streamUrl = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        setIsFullScreen: (state, action) => {
            state.isFullScreen = action.payload;
        },
        setIsVisible: (state, action) => {
            state.isVisible = action.payload;
        },
        setSize: (state, action) => {
            state.size = action.payload;
        },
        setSettingsOpen: (state, action) => {
            state.settingsOpen = action.payload;
        }
    },
});

export const { 
    setStreamUrl, 
    setIsPlaying, 
    setIsFullScreen, 
    setIsVisible ,
    setSize,
    setSettingsOpen
} = playerSlice.actions;

export default playerSlice.reducer;
