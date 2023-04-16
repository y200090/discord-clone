import { apiSlice } from '../slices/apiSlice';

export const channelApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        ChannelCreation: builder.mutation({
            query: (body) => ({
                url: '/channel/create',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Server', 'User']
        }),
        getChannelInfo: builder.query({
            query: (channelId) => ({
                url: `/channel/info/${channelId}`,
                method: 'GET',
            })
        }),
        AppendDirectMessage: builder.mutation({
            query: (body) => ({
                url: '/channel/DM/append',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User']
        }),
        RemoveDirectMessage: builder.mutation({
            query: (body) => ({
                url: '/channel/DM/remove',
                method: 'POST',
                body
            }), 
            invalidatesTags: ['User']
        }),
        GroupDirectMessageCreation: builder.mutation({
            query: (body) => ({
                url: '/channel/groupDM/create',
                method: 'POST',
                body
            }), 
            invalidatesTags: ['User']
        }),
    })
});

export const { 
    useChannelCreationMutation, 
    useGetChannelInfoQuery, 
    useAppendDirectMessageMutation,
    useRemoveDirectMessageMutation,
    useGroupDirectMessageCreationMutation
} = channelApi;
