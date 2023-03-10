import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth', 
    initialState: {
        currentUser: null,
        accessToken: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;
            state.currentUser = user;
            state.accessToken = accessToken;
        },
        logout: (state) => {
            state.currentUser = null;
            state.accessToken = null;
        },
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
