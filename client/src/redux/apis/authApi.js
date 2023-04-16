import { apiSlice } from "../slices/apiSlice";
import { setCredential } from "../slices/authSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials
            }),
            invalidatesTags: ['User']
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST', 
                body: credentials
            }),
            invalidatesTags: ['User']
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            })
        }),
        getCredential: builder.query({
            query: () => ({
                url: '/auth/confirm/token',
                method: 'GET',
            }),
            async onQueryStarted(
                arg,
                { dispatch, queryFulfilled }
            ) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredential(data));
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
    })
});

export const { 
    useRegisterMutation, 
    useLoginMutation, 
    useLogoutMutation,
    useGetCredentialQuery,
} = authApi;
