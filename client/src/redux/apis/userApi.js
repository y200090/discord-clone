import { apiSlice } from "../slices/apiSlice";
import { setCurrentUser } from "../slices/userSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: (userId) => ({
                url: `/user/get/info/${userId}`,
                method: 'GET', 
            }),
            providesTags: ['User'],
            async onQueryStarted(
                arg, 
                { dispatch, queryFulfilled }
            ) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCurrentUser(data));

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
