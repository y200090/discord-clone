import { socket } from "../../socket";
import { apiSlice } from "../slices/apiSlice";
import { setJoinedServers } from "../slices/serverSlice";
import { setCurrentUser } from "../slices/userSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: (userId) => ({
                url: `/user/get/info/${userId}`,
                method: 'GET', 
            }),
            // providesTags: ['User'],
            // async onQueryStarted(
            //     arg, 
            //     { dispatch, queryFulfilled }
            // ) {
            //     try {
            //         const { data } = await queryFulfilled;
            //         // dispatch(setCurrentUser(data));
            //         console.log(data);
            //         socket.emit('now_online', data);

            //     } catch (err) {
            //         console.log(err);
            //     }
            // },
            async onCacheEntryAdded(
                arg, 
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const result = await cacheDataLoaded;
                    socket.connect();

                    socket.emit('now_online', result?.data);

                    socket.on('update_online_status', (friend) => {
                        console.log(friend);
                        updateCachedData((draft) => {
                            let index = draft.friends.findIndex((item) => {
                                return item._id == friend._id;
                            });
                            draft.friends.splice(index, 1);
                            draft.friends.push(friend);
                        });
                    });

                    socket.on('request_approved', (newFriend) => {
                        console.log(newFriend);
                        updateCachedData((draft) => {
                            draft.friends.push(newFriend);
                        });
                    });

                    socket.on('friend_deleted', (friendId) => {
                        console.log(friendId);
                        updateCachedData((draft) => {
                            let index = draft.friends.findIndex((item) => {
                                return item._id == friendId;
                            });
                            draft.friends.splice(index, 1);
                        });
                    });

                    socket.on('direct_message_added', (DM) => {
                        console.log(DM);
                        updateCachedData((draft) => {
                            console.log(draft.setDirectMessages.length)
                            if (draft.setDirectMessages.length) {
                                let directMessageIds = draft.setDirectMessages.map((dm) => {
                                    return dm._id;
                                });
                                let flag = directMessageIds.includes(DM._id);
                                console.log(flag);
                                if (!flag) {
                                    draft.setDirectMessages.push(DM);
                                }

                            } else {
                                draft.setDirectMessages.push(DM);
                                console.log(draft.setDirectMessages.length)
                            }
                        });
                    });

                    socket.on('direct_message_removed', (directMessageId) => {
                        console.log(directMessageId);
                        updateCachedData((draft) => {
                            let index = draft.setDirectMessages.findIndex((item) => {
                                return item._id == directMessageId;
                            });
                            draft.setDirectMessages.splice(index, 1);
                        });
                    });
                    
                    await cacheEntryRemoved;

                    socket.off('update_online_status');
                    socket.off('request_approved');
                    socket.off('friend_deleted');
                    socket.off('direct_message_added');
                    socket.off('direct_message_removed');
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        getJoinedServers: builder.query({
            query: (userId) => ({
                url: `/user/joined-servers/${userId}`,
                method: 'GET',
            }),
            async onCacheEntryAdded(
                arg, 
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    await cacheDataLoaded;
                    
                    socket.on('new_server_created', (newServer) => {
                        updateCachedData((draft) => {
                            draft.push(newServer);
                        });
                    });

                    await cacheEntryRemoved;

                    socket.off('new_server_created');
                    
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
    useGetJoinedServersQuery,
    useEditUserProfileMutation,
} = userApi;
