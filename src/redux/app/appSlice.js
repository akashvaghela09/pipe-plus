import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'John Doe',
  age: null,
  count: 0,
  tabBarVisible: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setAge: (state, action) => {
      state.age = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setTabBarVisible: (state, action) => {
      state.tabBarVisible = action.payload;
    }
  },
});

export const { 
  setName, 
  setAge, 
  setCount,
  setTabBarVisible,
} = appSlice.actions;

export default appSlice.reducer;
