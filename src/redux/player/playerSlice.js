import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    url: "",
    isPlaying: false,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setUrl: (state, action) => {
            state.url = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        }
    },
});

export const { setUrl, setIsPlaying } = playerSlice.actions;

export default playerSlice.reducer;
