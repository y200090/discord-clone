import { createSlice, createSelector } from "@reduxjs/toolkit";
import jwt_decode from 'jwt-decode';

export const authSlice = createSlice({
    name: 'auth', 
    initialState: {
        token: null,
    },
    reducers: {
        setCredential: (state, action) => {
            const data = jwt_decode(action.payload);
            state.token = data?.userId;
        },
        logout: (state) => {
            state.token = null;
        },
    }
});

export const { setCredential, logout } = authSlice.actions;
export default authSlice.reducer;

const selectAuth = (state) => state.auth;

export const selectCredential = createSelector(
    [selectAuth], 
    (state) => state.token
);
