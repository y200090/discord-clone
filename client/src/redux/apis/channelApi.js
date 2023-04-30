import { socket } from '../../socket';
import { apiSlice } from '../slices/apiSlice';

export const channelApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        ChannelCreation: builder.mutation({
            query: (body) => ({
                url: '/channel/create',
                method: 'POST',
                body,
            }),
            // invalidatesTags: ['Server', 'User']
        }),
        getChannelInfo: builder.query({
            query: (channelId) => ({
                url: `/channel/info/${channelId}`,
                method: 'GET',
            })
        }),
        getParticipatingChannels: builder.query({
            query: (userId) => ({
                url: `/channel/participating-channels/${userId}`,
                method: 'GET',
            }),
            async onCacheEntryAdded(
                arg, 
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const {data} = await cacheDataLoaded;
                    console.log(data);

                    socket.on('new_channel_created', (newChannel) => {
                        console.log(newChannel);
                        updateCachedData((draft) => {
                            draft.push(newChannel);
                        });
                    });

                    socket.on('withdrawn_from_channel', (channel) => {
                        console.log(channel);
                        updateCachedData((draft) => {
                            let index = draft.findIndex((item) => {
                                return item._id == channel?._id;
                            });
                            draft.splice(index, 1);
                            console.log(draft.length);
                        });
                    });

                    socket.on('message_sent', (newMessage) => {
                        updateCachedData((draft) => {
                            let index = draft.findIndex((item) => {
                                return item._id == newMessage?.postedChannel?._id;
                            });
                            console.log(index)
                            console.log(newMessage)
                            // draft[index].latestMessage.assign(newMessage);
                            Object.assign(draft[index].latestMessage, newMessage);
                        });
                    });

                    socket.on('new_notification_received', ({ channelId, ...notification }) => {
                        console.log(channelId);
                        console.log(notification);
                        updateCachedData((draft) => {
                            let index = draft.findIndex((item) => {
                                return item._id == channelId;
                            });
                            console.log(index)
                            if (index == -1) {
                                draft[0].notifications.push(notification);

                            } else {
                                draft[index].notifications.push(notification);
                            }
                        });
                    });

                    socket.on('notification_cleared', ({ channelId, currentUserId }) => {
                        updateCachedData((draft) => {
                            // let indices = [];
                            let current = draft.findIndex((item) => {
                                return item._id == channelId;
                            });
                            draft[current].notifications?.forEach(() => {
                                let index = draft[current].notifications?.findIndex((item) => {
                                    return item?.recipient == currentUserId;
                                });
                                if (index == -1) return;
                                else {
                                    // indices.push(index);
                                    draft[current].notifications.splice(index, 1);
                                }
                            });
                        });
                    });

                    await cacheEntryRemoved;

                    socket.off('new_channel_created');
                    socket.off('withdrawn_from_channel');
                    socket.off('message_sent');
                    socket.off('new_notification_received');
                    socket.off('notification_cleared');
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        AddDirectMessage: builder.mutation({
            query: (body) => ({
                url: '/channel/add/direct-message',
                method: 'POST',
                body
            }),
            // invalidatesTags: ['User']
            async onCacheEntryAdded(
                arg, 
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data } = await cacheDataLoaded;
                    console.log(data);

                    socket.emit('add_direct_message', data);
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        RemoveDirectMessage: builder.mutation({
            query: (body) => ({
                url: '/channel/remove/direct-message',
                method: 'POST',
                body
            }), 
            // invalidatesTags: ['User']
            async onCacheEntryAdded(
                arg, 
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data } = await cacheDataLoaded;
                    console.log(data);

                    socket.emit('remove_direct_message', data);
                    
                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        CreateGroupDirectMessage: builder.mutation({
            query: (body) => ({
                url: '/channel/groupDM/create',
                method: 'POST',
                body
            }), 
            // invalidatesTags: ['User']
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data } = await cacheDataLoaded;
                    console.log(data);

                    socket.emit('add_direct_message', data);

                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        WithdrawFromChannel: builder.mutation({
            query: (body) => ({
                url: '/channel/withdraw',
                method: 'POST',
                body,
            }),
            async onCacheEntryAdded(
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                try {
                    const { data: channel } = await cacheDataLoaded;
                    console.log(channel);

                    socket.emit('withdraw_from_channel', channel);

                    await cacheEntryRemoved;
                    
                } catch (err) {
                    console.log(err);
                }
            }
        }),
    })
});

export const { 
    useChannelCreationMutation, 
    useGetChannelInfoQuery, 
    useGetParticipatingChannelsQuery,
    useAddDirectMessageMutation,
    useRemoveDirectMessageMutation,
    useCreateGroupDirectMessageMutation,
    useWithdrawFromChannelMutation,
} = channelApi;
