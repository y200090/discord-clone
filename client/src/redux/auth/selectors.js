import { createSelector } from "@reduxjs/toolkit";

const selectAuth = (state) => state.auth;

export const selectCurrentUser = createSelector(
    [selectAuth], 
    (state) => state.currentUser
);
