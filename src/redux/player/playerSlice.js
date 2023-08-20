import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    streamUrl: "",
    isPlaying: false,
    isFullScreen: false,
    isVisible: false,
    isLoading: false,
    size: "normal",
    settingsOpen: false,
    relatedStreams: [],
    availableQualities: [],
    streamQuality: "720p",
    rawData: {}
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
        },
        setRelatedStreams: (state, action) => {
            state.relatedStreams = action.payload;
        },
        setAvailableQualities: (state, action) => {
            state.availableQualities = action.payload;
        },
        setStreamQuality: (state, action) => {
            state.streamQuality = action.payload;
        },
        setRawData: (state, action) => {
            state.rawData = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
});

export const { 
    setStreamUrl, 
    setIsPlaying, 
    setIsFullScreen, 
    setIsVisible ,
    setSize,
    setSettingsOpen,
    setRelatedStreams,
    setAvailableQualities,
    setStreamQuality,
    setRawData,
    setLoading
} = playerSlice.actions;

export default playerSlice.reducer;
