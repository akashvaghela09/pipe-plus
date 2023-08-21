import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    streamUrl: "",
    hlsUrl: "",
    isPlaying: false,
    isFullScreen: false,
    isVisible: false,
    isLoading: false,
    size: "normal",
    settingsOpen: false,
    relatedStreams: [],
    availableQualities: [],
    streamQuality: "720p",
    streamMetadata: {
        streamId: "",
        isShort: false,
        shortDescription: "",
        thumbnail: "",
        title: "",
        type: "",
        uploaded: 0,
        uploadedDate: "",
        uploaderAvatar: "",
        uploaderName: "",
        uploaderUrl: "",
        uploaderVerified: false,
        views: 0,
        uploaderSubscriberCount: 0
    }
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setStreamUrl: (state, action) => {
            state.streamUrl = action.payload;
        },
        setHlsUrl: (state, action) => {
            state.hlsUrl = action.payload;
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
        setStreamMetadata: (state, action) => {
            state.streamMetadata = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
});

export const {
    setStreamUrl,
    setHlsUrl,
    setIsPlaying,
    setIsFullScreen,
    setIsVisible,
    setSize,
    setSettingsOpen,
    setRelatedStreams,
    setAvailableQualities,
    setStreamQuality,
    setStreamMetadata,
    setLoading
} = playerSlice.actions;

export default playerSlice.reducer;
