import { socket } from "../../socket";
import { apiSlice } from "../slices/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => ({
                url: '/user/authenticated',
                method: 'GET', 
            }),
            providesTags: ['User'],
            async onCacheEntryAdded(
                arg,
                { cacheDataLoaded, cacheEntryRemoved }
            ) {
                socket.connect();

                try {
                    const result = await cacheDataLoaded;
                    // if (result?.data) {
                    //     socket.emit('online', result?.data);
                    // }

                    await cacheEntryRemoved;

                } catch (err) {
                    console.log(err);
                }
            }
        }),
        EditUserProfile: builder.mutation({
            query: (body) => ({
                url: '/user/edit/profile', 
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User']
        }),
    })
});

export const { 
    useGetCurrentUserQuery, 
    useEditUserProfileMutation,
} = userApi;
