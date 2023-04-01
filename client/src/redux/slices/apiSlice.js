import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredential, logout } from './authSlice';

const baseQuery = fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000', 
    credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(result)

    if (result?.error?.status === 403) {
        console.log('アクセストークンを再発行します');
        const refreshResult = await baseQuery({
            method: 'POST', 
            url: '/auth/refreshtoken',
        }, api, extraOptions);
        console.log(refreshResult);

        if (refreshResult?.data) {
            // api.dispatch(setCredential({...refreshResult.data}));
            result = await baseQuery(args, api, extraOptions);

        } else {
            // await baseQuery({
            //     method: 'POST', 
            //     url: '/auth/logout',
            // }, api, extraOptions);
            api.dispatch(logout());
            console.log('ログアウトしました');
            console.log(result)
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Server', 'Channel', 'Friend', 'Auth'],
    endpoints: () => ({}),
});
