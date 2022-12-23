import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  login: null,
  email: null,
  avatar: null,
  state: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      login: payload.login,
      email: payload.email,
      avatar: payload.avatar,
    }),
    authStateChange: (state, { payload }) => ({
      ...state,
      state: payload.state,
    }),
    authLogout: () => initialState,
    updateAvatarAction: (state, { payload }) => ({
      ...state,
      avatar: payload.avatar,
    }),
  },
});
