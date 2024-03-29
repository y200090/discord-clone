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
                        console.log('フレンドのステータスが変更になりました');
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
                        console.log('フレンド申請が承諾されました');
                        console.log(newFriend);
                        updateCachedData((draft) => {
                            draft.friends.push(newFriend);
                        });
                    });

                    socket.on('friend_deleted', (friendId) => {
                        console.log('フレンドが削除されました');
                        console.log(friendId);
                        updateCachedData((draft) => {
                            let index = draft.friends.findIndex((item) => {
                                return item._id == friendId;
                            });
                            draft.friends.splice(index, 1);
                        });
                    });

                    socket.on('direct_message_added', (DM) => {
                        console.log('DMが追加されました');
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
                        console.log('DMをセットから外しました');
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

                    socket.on('new_channel_created', (newChannels) => {
                        updateCachedData((draft) => {
                            newChannels?.forEach((newChannel) => {
                                let index = draft.findIndex((item) => {
                                    return item._id == newChannel?.parentServer?._id;
                                });
                                console.log(index);
                                if (index == -1) return;
                                
                                let flag = draft[index].ownedChannels.findIndex((item) => {
                                    return item._id == newChannel._id;
                                });
                                console.log(flag)
                                if (flag != -1) return;
                                
                                draft[index].ownedChannels.push(newChannel);
                            });
                        });
                    });

                    socket.on('server_deleted', (server) => {
                        updateCachedData((draft) => {
                            let index = draft.findIndex((item) => {
                                return item._id == server?._id;
                            });
                            draft.splice(index, 1);
                        });
                    });

                    socket.on('channel_deleted', (channel) => {
                        updateCachedData((draft) => {
                            let index = draft.findIndex((item) => {
                                return item?._id == channel?.parentServer?._id;
                            });
                            if (index == -1) return;
                            let number = draft[index]?.ownedChannels?.findIndex((item) => {
                                return item?._id == channel?._id;
                            });
                            if (number == -1) return;
                            draft[index]?.ownedChannels?.splice(number, 1);
                        });
                    });

                    await cacheEntryRemoved;

                    socket.off('new_server_created');
                    socket.off('new_channel_created');
                    socket.off('server_deleted');
                    socket.off('channel_deleted');
                    
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
