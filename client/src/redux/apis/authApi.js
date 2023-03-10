import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logout } from '../auth/slices';

const baseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:8000' });

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(result)

    if (result?.error?.status === 403) {
        console.log('リフレッシュトークンを発行します');
        const refreshResult = await baseQuery('/token/refresh', api, extraOptions);
        console.log(refreshResult);

        if (refreshResult?.data) {
            const currentUser = api.getState().auth.currentUser;
            api.dispatch(setCredentials({...refreshResult.data, currentUser}));
            result = await baseQuery(args, api, extraOptions);

        } else {
            api.dispatch(logout());
        }
    }

    return result;
};

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: {...credentials}
            })
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST', 
                body: {...credentials}
            })
        }),
        logout: builder.query({
            query: () => '/auth/logout',
        }),
    }),
});

export const { userRegisterMutation, useLoginMutation, useLogoutQuery } = authApi;
