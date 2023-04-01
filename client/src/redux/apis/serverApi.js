import { apiSlice } from '../slices/apiSlice';

export const serverApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        ServerCreation: builder.mutation({
            query: (body) => ({
                url: '/server/create',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Server', 'User'],
        }),
        // joinServer: builder.mutation({
        //     query(data) {
        //         const { serverId, ...body } = data;
        //         return {
        //             url: `/server/join/${serverId}`,
        //             method: 'PATCH',
        //             body,
        //         }
        //     },
        //     invalidatesTags: ['Server', 'User'],
        // }),
        getServerInfo: builder.query({
            query: (serverId) => ({
                url: `/server/info/${serverId}`,
                method: 'GET', 
            }),
            providesTags: ['Server']
        }),
        // getJoinedServers: builder.query({
        //     query: (uid) => ({
        //         url: `/server/infos/joined/${uid}`,
        //         method: 'GET',
        //     }),
        //     providesTags: ['Server'],
        // }),
    })
});

export const { useServerCreationMutation, useJoinServerMutation, useGetServerInfoQuery, useGetJoinedServersQuery } = serverApi;
