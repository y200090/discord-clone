import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth', 
    initialState: {
        currentUser: null,
    },
    reducers: {
        setCredential: (state, action) => {
            state.currentUser = action.payload;
        },
        logOut: (state) => {
            state.currentUser = null;
        },
    }
});

export const { setCredential, logOut } = authSlice.actions;
export default authSlice.reducer;
