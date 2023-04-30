import { apiSlice } from '../slices/apiSlice';

export const invitationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // getInvitationInfo: builder.query({
        //     query: ({ serverId, userId }) => ({
        //         url: `/invitation/info/${serverId}/${userId}`,
        //         method: 'GET',
        //     }),
        // }),
        getInvitationInfo: builder.query({
            query: (invitationLink) => ({
                url: `/invitation/info.server/${invitationLink}`,
                method: 'GET',
            }),
        }),
    })
});

export const {
    useGetInvitationInfoQuery,
    // useGetInvitationServerInfoQuery,
} = invitationApi;
