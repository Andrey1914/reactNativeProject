import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./authReducer";
import { pathSlice } from "./pathReducer";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [pathSlice.name]: pathSlice.reducer,
  },
});
