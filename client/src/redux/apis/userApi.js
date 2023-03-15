import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => ({
                method: 'POST', 
                url: '/user/authenticated',
            })
        }),
        getUserInfo: builder.query({
            query: (uid) => ({
                method: 'GET', 
                url: `/user/${uid}`,
            })
        }),
    })
});

export const { useGetCurrentUserQuery, useGetUserInfoQuery } = userApi;
