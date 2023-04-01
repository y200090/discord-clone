import { apiSlice } from '../slices/apiSlice';

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        PostMessage: builder.mutation({
            query: (body) => ({
                url: '/message/post',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Message']
        }),
        getMessages: builder.query({
            query: (channelId) => ({
                url: `/message/history/${channelId}`,
                method: 'GET'
            }),
            providesTags: ['Message']
        })
    })
});

export const {
    usePostMessageMutation,
    useGetMessagesQuery,
} = messageApi;
