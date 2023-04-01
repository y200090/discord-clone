import { apiSlice } from '../slices/apiSlice';

export const channelApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        ChannelCreation: builder.mutation({
            query: (body) => ({
                url: '/channel/create',
                method: 'POST',
                body: {...body},
            }),
            invalidatesTags: ['Server']
        }),
        getChannelInfo: builder.query({
            query: (channelId) => ({
                url: `/channel/info/${channelId}`,
                method: 'GET',
            })
        }),
        // getOwnedChannels: builder.query({
        //     query: (serverId) => ({
        //         url: `/channel/infos/owned/${serverId}`,
        //         method: 'GET',
        //     })
        // }),
    })
});

export const { 
    useChannelCreationMutation, 
    useGetChannelInfoQuery, 
    useDirectMessageCreationMutation,
    useGetOwnedChannelsQuery 
} = channelApi;
