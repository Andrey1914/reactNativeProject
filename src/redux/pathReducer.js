import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  path: null,
};

export const pathSlice = createSlice({
  name: "path",
  initialState: initialState,
  reducers: {
    setPath: (state, { payload }) => ({
      ...state,
      path: payload.path,
    }),
  },
});
