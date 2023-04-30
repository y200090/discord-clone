import { createSlice, createSelector } from "@reduxjs/toolkit";

export const channelSlice = createSlice({
    name: 'channel',
    initialState: {
        participatingChannels: [],
    },
    reducers: {
        setParticipatingChannels: (state, action) => {
            state.participatingChannels = action.payload;
        },
    }
});

export const { setParticipatingChannels } = channelSlice.actions;
export default channelSlice.reducer;

const selectChannel = (state) => state.channel;

export const selectParticipatingChannels = createSelector(
    [selectChannel],
    (state) => state.participatingChannels
);
