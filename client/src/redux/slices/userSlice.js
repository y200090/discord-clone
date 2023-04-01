import { createSlice, createSelector } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: {}, 
        pendingUsers: [],
        waitingUsers: [],
    },
    reducers: {
        // setPendingUsers: ()
    }
})