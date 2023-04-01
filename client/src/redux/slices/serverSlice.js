import { createSlice, createSelector } from "@reduxjs/toolkit";

export const serverSlice = createSlice({
    name: 'server',
    initialState: {
        serverInfo: {},
        joinedServers: [],
    },
    reducers: {
        setServerInfo: (state, action) => {
            state.serverInfo = action.payload;
        },
        setJoinedServers: (state, action) => {
            state.joinedServers = action.payload;
        },
    }
});

export const { setServerInfo, setJoinedServers } = serverSlice.actions;
export default serverSlice.reducer;

const selectServer = (state) => state.server;

export const selectServerInfo = createSelector(
    [selectServer],
    (state) => state.serverInfo
);

export const selectJoinedServers = createSelector(
    [selectServer],
    (state) => state.joinedServers
);
