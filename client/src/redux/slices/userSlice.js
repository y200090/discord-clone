import { createSlice, createSelector } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        }
    }
});

export const { setCurrentUser } = userSlice.actions;
export default userSlice.reducer;

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
    [selectUser],
    (state) => state.currentUser
);
