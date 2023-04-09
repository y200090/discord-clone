import { createSlice, createSelector } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth', 
    initialState: {
        currentUser: null,
    },
    reducers: {
        setCredential: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        },
    }
});

export const { setCredential, refetchFunc, logout } = authSlice.actions;
export default authSlice.reducer;

const selectAuth = (state) => state.auth;

export const selectCurrentUser = createSelector(
    [selectAuth], 
    (state) => state.currentUser
);
