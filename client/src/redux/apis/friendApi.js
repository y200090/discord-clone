import { socket } from '../../socket';
import { apiSlice } from '../slices/apiSlice';
import { setFriendRequests } from '../slices/requestSlice';

export const friendApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFriendRequests: builder.query({
            query: (uid) => ({
                url: `/friend/request/get/${uid}`,
                method: 'GET',
            }),
            // providesTags: ['Friend'],
            // async onQueryStarted(
            //     arg, 
            //     { dispatch, queryFulfilled }
            // ) {
            //     try {
            //         const { data } = await queryFulfilled;
            //         console.log(data);
            //         dispatch(setFriendRequests(data));
                    
            //     } catch (err) {
            //         console.log(err);
            //     }
            // }
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;

                    socket.on('receive_request', (newRequest) => {
                        console.log(newRequest);
                        updateCachedData((draft) => {
                            draft.push(newRequest);
                        });
                    });

                    socket.on('delete_request', (request) => {
                        console.log(request);
                        updateCachedData((draft) => {
                            let index = draft.findIndex((item) => {
                                return item._id == request._id;
                            });
                            draft.splice(index, 1);
                        });
                    });

                    await cacheEntryRemoved;

                    socket.off('receive_request');
                    socket.off('delete_request');
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        PostFriendRequest: builder.mutation({
            query: (body) => ({
                url: '/friend/request/post',
                method: 'POST',
                body,
            }), 
            // invalidatesTags: ['Friend'],
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const result = await cacheDataLoaded;
                    console.log(result)

                    if (result?.data) {
                        socket.emit('send_request', result.data.request);
                    }
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        ApproveFriendRequest: builder.mutation({
            query: (body) => ({
                url: '/friend/approve/friend-request',
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Friend', 'User']
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data } = await cacheDataLoaded;
                    console.log(data)

                    socket.emit('approve_request', data);
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        DiscardFriendRequest: builder.mutation({
            query: (body) => ({
                url: '/friend/discard/friend-request',
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Friend', 'User']
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data } = await cacheDataLoaded;
                    console.log(data)

                    socket.emit('discard_request', data);
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        DeleteFriend: builder.mutation({
            query: (body) => ({
                url: '/friend/delete',
                method: 'POST',
                body
            }),
            // invalidatesTags: ['User'],
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;

                    console.log(arg);
                    socket.emit('delete_friend', arg.friend);
                    
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
    useApproveFriendRequestMutation,
    useDiscardFriendRequestMutation,
    useDeleteFriendMutation
} = friendApi;
