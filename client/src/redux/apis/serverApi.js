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
        ServerJoining: builder.mutation({
            query: (body) => ({
                url: '/server/join',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Server', 'User']
        }),
        ServerInvitation: builder.mutation({
            query: (body) => ({
                url: '/server/invitation',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Server', 'User']
        }),
        ServerEditProfile: builder.mutation({
            query: (body) => ({
                url: '/server/edit/profile',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Server', 'User']
        }),
        getServerInfo: builder.query({
            query: (serverId) => ({
                url: `/server/info/${serverId}`,
                method: 'GET', 
            }),
            providesTags: ['Server']
        }),
    })
});

export const { 
    useServerCreationMutation, 
    useServerJoiningMutation, 
    useGetServerInfoQuery, 
    useServerInvitationMutation, 
    useServerEditProfileMutation 
} = serverApi;
