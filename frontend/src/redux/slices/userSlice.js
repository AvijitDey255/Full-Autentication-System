import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state,action) => {
      state.loading = action.payload;
    },
    setUser: (state,action) => {
      state.user = action.payload;
    },
    setError: (state,action) => {
      state.error = action.payload;
    },
    
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setUser, setError } = counterSlice.actions;

export default userSlice.reducer;
