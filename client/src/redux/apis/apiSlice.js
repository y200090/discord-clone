import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredential, logOut } from '../auth/slices';

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
        console.log('refreshtoken')
        console.log(refreshResult);

        if (refreshResult?.data) {
            const currentUser = api.getState().auth.currentUser;
            api.dispatch(setCredential({...refreshResult.data, currentUser}));
            result = await baseQuery(args, api, extraOptions);

        } else {
            api.dispatch(logOut());
            await baseQuery({
                method: 'POST', 
                url: '/auth/logout',
            }, api, extraOptions);
            console.log('ログアウトしました')
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
