import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app/appSlice';
import playerReducer from './player/playerSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    player: playerReducer,
  },
});

export default store;
