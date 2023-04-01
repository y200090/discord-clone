import { apiSlice } from '../slices/apiSlice';

export const friendApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFriendsInfo: builder.query({
            query: (uid) => ({
                url: `/friend/infos/${uid}`,
                method: 'GET',
            })
        }),
        FriendRequest: builder.mutation({
            query: (body) => ({
                url: '/friend/request/pending',
                method: 'POST',
                body,
            }), 
            invalidatesTags: ['User']
        }),
        ApprovalPending: builder.mutation({
            query: (body) => ({
                url: '/friend/approval/pending',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User']
        }),
        DenialPending: builder.mutation({
            query: (body) => ({
                url: '/friend/denial/pending',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User']
        }),
        CancelPending: builder.mutation({
            query: (body) => ({
                url: '/friend/cancel/pending',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User']
        }),
        AddToDM: builder.mutation({
            query: (body) => ({
                url: '/friend/add/dm',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User']
        }),
        RemoveDM: builder.mutation({
            query: (body) => ({
                url: '/friend/remove/dm',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User']
        }),
    })
});

export const { 
    useGetFriendsInfoQuery, 
    useFriendRequestMutation, 
    useApprovalPendingMutation, 
    useDenialPendingMutation, 
    useCancelPendingMutation, 
    useAddToDMMutation,
    useRemoveDMMutation,
} = friendApi;
