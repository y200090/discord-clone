import { socket } from '../../socket';
import { apiSlice } from '../slices/apiSlice';

export const serverApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        CreateServer: builder.mutation({
            query: (body) => ({
                url: '/server/create',
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Server', 'User'],
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data: newServer } = await cacheDataLoaded;
                    console.log(newServer);

                    socket.emit('create_server', newServer);

                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        JoinServer: builder.mutation({
            query: (body) => ({
                url: '/server/join',
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Server', 'User']
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved}
            ) {
                try {
                    const { data } = await cacheDataLoaded;
                    const newMessage = data?.newMessage;
                    const currentUser = data?.currentUser;
                    const server = data?.joiningServer;

                    socket.emit('join_server', {server, currentUser});
                    socket.emit('send_message', newMessage);
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        CreateInvitation: builder.mutation({
            query: (body) => ({
                url: '/server/invitation/create',
                method: 'POST',
                body
            }),
            // invalidatesTags: ['Server', 'User', 'Message'],
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data } = await cacheDataLoaded;
                    const newMessage = data?.newMessage;
                    const newDirectMessage = data?.newDirectMessage;
                    console.log('新しいメッセージ: ', newMessage)

                    socket.emit('send_message', newMessage);
                    socket.emit('add_direct_message', newDirectMessage);
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        // ServerEditProfile: builder.mutation({
        //     query: (body) => ({
        //         url: '/server/edit/profile',
        //         method: 'POST',
        //         body
        //     }),
        //     invalidatesTags: ['Server', 'User']
        // }),
        DeleteServer: builder.mutation({
            query: (body) => ({
                url: '/server/delete',
                method: 'DELETE',
                body,
            }),
            async onQueryStarted(
                arg,
                { queryFulfilled }
            ) {
                try {
                    const { data: server } = await queryFulfilled;

                    socket.emit('delete_server', server);
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        getServerInfo: builder.query({
            query: (serverId) => ({
                url: `/server/info/${serverId}`,
                method: 'GET', 
            }),
            providesTags: ['Server']
        }),
        // getCreateInvitationLink: builder.query({
        //     query: (invitationLink) => ({
        //         url: `/server/info/invitation/${invitationLink}`,
        //         method: 'GET',
        //     }),
        //     providesTags: ['Server'],
        // }),
    })
});

export const { 
    useCreateServerMutation, 
    useJoinServerMutation, 
    useCreateInvitationMutation, 
    // useServerEditProfileMutation, 
    useDeleteServerMutation,
    useGetServerInfoQuery, 
    // useGetServerInvitationLinkQuery,
} = serverApi;
