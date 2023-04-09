import { socket } from '../../socket';
import { apiSlice } from '../slices/apiSlice';

export const friendApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFriendRequests: builder.query({
            query: (uid) => ({
                url: `/friend/request/get/${uid}`,
                method: 'GET',
            }),
            providesTags: ['Friend']
        }),
        PostFriendRequest: builder.mutation({
            query: (body) => ({
                url: '/friend/request/post',
                method: 'POST',
                body,
            }), 
            invalidatesTags: ['Friend'],
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const result = await cacheDataLoaded;

                    if (result?.data) {
                        socket.emit('send_request', result.data.targetUserId);
                    }
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        ApprovalFriendRequest: builder.mutation({
            query: (body) => ({
                url: '/friend/request/approval',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Friend', 'User']
        }),
        DenialFriendRequest: builder.mutation({
            query: (body) => ({
                url: '/friend/request/denial',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Friend', 'User']
        }),
        DeleteFriend: builder.mutation({
            query: (body) => ({
                url: '/friend/delete',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User'],
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;

                    if (arg?.targetUser) {
                        socket.emit('delete_friend', arg?.targetUser);
                    }
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
    })
});

export const { 
    useGetFriendRequestsQuery, 
    usePostFriendRequestMutation, 
    useApprovalFriendRequestMutation,
    useDenialFriendRequestMutation,
    useDeleteFriendMutation
} = friendApi;
