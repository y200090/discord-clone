import { createSlice, createSelector } from "@reduxjs/toolkit";

export const requestSlice = createSlice({
   name: 'request',
   initialState: {
    friendRequests: [],
   },
   reducers: {
    setFriendRequests: (state, action) => {
        state.friendRequests = action.payload;
    },
   }
});

export const { setFriendRequests } = requestSlice.actions;
export default requestSlice.reducer;

const selectRequest = (state) => state.request;

export const selectFriendRequests = createSelector(
    [selectRequest],
    (state) => state.friendRequests
);
