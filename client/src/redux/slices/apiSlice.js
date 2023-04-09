import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex';
import { socket } from '../../socket';
import { logout, setCredential } from './authSlice';

const BASEURL = import.meta.env.VITE_BASEURL;

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({ 
    baseUrl: BASEURL, 
    credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();    
    let result = await baseQuery(args, api, extraOptions);
    console.log(result);

    if (result?.data) {   
        if (result?.meta?.response?.url === `${BASEURL}/user/authenticated`) {
            api.dispatch(setCredential(result?.data));
            if (!result?.data?.online) {
                socket.emit('online', result?.data);
            }
        }
    }
    
    if (result?.error?.status === 403) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                console.log('アクセストークンを再発行します');
                const refreshResult = await baseQuery({
                    url: '/auth/refreshtoken',
                    method: 'POST', 
                }, api, extraOptions);
                console.log(refreshResult);

                if (refreshResult?.data) {
                    result = await baseQuery(args, api, extraOptions);

                    if (result?.meta?.response?.url === `${BASEURL}/user/authenticated`) {
                        api.dispatch(setCredential(result?.data));
                        if (!result?.data?.online) {
                            socket.emit('online', result?.data);
                        }
                    }

                } else {
                    api.dispatch(logout());
                    const logMessage = await baseQuery({
                        url: 'auth/logout',
                        method: 'POST',
                    }, api, extraOptions);
                    console.log(logMessage);
                    socket.disconnect();
                }

            } finally {
                release();
            }

        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Server', 'Channel', 'Friend'],
    endpoints: () => ({}),
});
