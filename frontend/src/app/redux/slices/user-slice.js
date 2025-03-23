'use client';

import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        user_data: [],
    },
    reducers: {
        logout: (state) => {
            state.isLoggedIn = false;
            state.user_data = [];
        },
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user_data = action.payload;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;