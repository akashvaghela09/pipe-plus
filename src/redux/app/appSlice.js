import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'John Doe',
  age: null,
  count: 0,
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
    }
  },
});

export const { setName, setAge, setCount } = appSlice.actions;

export default appSlice.reducer;
