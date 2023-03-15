import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (credentials) => ({
                url: '/auth/signup',
                method: 'POST',
                body: {...credentials}
            })
        }),
        logIn: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST', 
                body: {...credentials}
            })
        }),
        logOut: builder.query({
            query: () => '/auth/logout',
        }),
    })
});

export const { useSignUpMutation, useLogInMutation, useLogOutQuery } = authApi;
