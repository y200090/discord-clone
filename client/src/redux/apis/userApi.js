import { apiSlice } from "../slices/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => ({
                url: '/user/authenticated',
                method: 'GET', 
            }),
            providesTags: ['User']
        }),
        getUserInfo: builder.query({
            query: (uid) => ({
                url: `/user/info/${uid}`,
                method: 'GET', 
            })
        }),
        getPendingUserInfos: builder.query({
            query: (uid) => ({
                url: `/user/infos/friends/pendingUser/${uid}`,
                method: 'GET',
            })
        }),
        getWaitingUserInfos: builder.query({
            query: (uids) => ({
                url: `/user/infos/friends/waitingUser/${uids}`,
                method: 'GET',
            })
        }),
        // selectUserInfos: builder.query({
        //     query: (uids) => ({
        //         url: `/user/infos/select/${uids}`,
        //         method: 'GET',
        //     })
        // }),
    })
});

export const { useGetCurrentUserQuery, useGetUserInfoQuery, useGetPendingUserInfosQuery, useGetWaitingUserInfosQuery } = userApi;
