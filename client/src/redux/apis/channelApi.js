import { socket } from '../../socket';
import { apiSlice } from '../slices/apiSlice';

export const channelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    CreateChannel: builder.mutation({
      query: (body) => ({
        url: '/channel/create',
        method: 'POST',
        body,
      }),
      // invalidatesTags: ['Server', 'User']
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          const { data: newChannel } = await cacheDataLoaded;

          socket.emit('create_channel', newChannel);
          
          await cacheEntryRemoved;
            
        } catch (err) {
          console.log(err);
        }
      }
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

          socket.on('new_channel_created', (newChannels) => {
            console.log('新しいチャンネルが作成されました');
            console.log(...newChannels);
            updateCachedData((draft) => {
              draft.push(...newChannels);
            });
          });

          socket.on('server_joined', ({ channels, currentUser }) => {
            console.log('サーバーに参加しました');
            console.log(channels);
            const publicChannels = channels.filter((channel) => {
              return !channel.privateChannel;
            });
            console.log(publicChannels);
            
            updateCachedData((draft) => {
              publicChannels.forEach((element) => {
                console.log(element?._id);
                let index = draft.findIndex((item) => {
                  return element._id == item._id;
                });
                console.log(index);
                if (index == -1) return;
                draft[index].allowedUsers.push(currentUser);
              });
            });
          });

          socket.on('server_deleted', (server) => {
            console.log(server?.title, 'サーバーが削除されました');

            updateCachedData((draft) => {
              server?.ownedChannels?.forEach((channel) => {
                let index = draft.findIndex((item) => {
                  return channel?._id == item._id;
                });
                if (index == -1) return;
                draft.splice(index, 1);
              });
            });
          });

          socket.on('channel_joined', ({ channel, targetUsers }) => {
            console.log('チャンネルに新たな参加者が現れました');
            console.log(targetUsers);

            updateCachedData((draft) => {
              let index = draft.findIndex((item) => {
                return item._id == channel?._id;
              });
              console.log(index);
              if (index == -1) return;

              const allowedUserIds = draft[index]?.allowedUsers?.map((user) => {
                return user?._id;
              });
              targetUsers?.forEach((user) => {
                let flag = allowedUserIds.includes(user?._id);
                if (!flag) {
                  draft[index]?.allowedUsers?.push(user);
                }
              });
            });
          });

          socket.on('channel_deleted', (channel) => {
            console.log(channel?.title, 'チャンネルが削除されました');

            updateCachedData((draft) => {
              let index = draft.findIndex((item) => {
                return item?._id == channel?._id;
              });
              if (index == -1) return;
              draft.splice(index, 1);
            });
          });

          socket.on('withdrawn_from_channel', ({targetChannel, withDrawnUser}) => {
            console.log(withDrawnUser?.displayName, 'がチャンネルを脱退しました');
            console.log(targetChannel);
            updateCachedData((draft) => {
              let index = draft.findIndex((item) => {
                return item._id == targetChannel?._id;
              });
              console.log(index);
              if (index == -1) return;
              let number = draft[index]?.allowedUsers?.findIndex((user) => {
                return user._id == withDrawnUser?._id;
              });
              console.log(number)
              if (number == -1) return;
              draft[index]?.allowedUsers?.splice(number, 1);
            });
          });

          socket.on('message_sent', (newMessage) => {
            console.log('最新のメッセージが送信されました');
            updateCachedData((draft) => {
              let index = draft.findIndex((item) => {
                return item._id == newMessage?.postedChannel?._id;
              });
              console.log(index)
              console.log(newMessage)
              console.log(draft[index]?.latestMessage);
              if (index == -1) return;
              Object.assign(draft[index]?.latestMessage, newMessage);
            });
          });

          socket.on('new_notification_received', ({ channelId, ...notification }) => {
            console.log('新規通知が届きました');
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
            console.log('通知を消化しました');
            updateCachedData((draft) => {
              let current = draft.findIndex((item) => {
                return item._id == channelId;
              });
              console.log(draft[current].notifications?.length)
              const notifications = draft[current].notifications.concat();
              notifications?.forEach(() => {
                let index = draft[current].notifications?.findIndex((item) => {
                  return item?.recipient == currentUserId;
                });
                console.log(index);
                if (index == -1) return;
                else {
                  draft[current].notifications.splice(index, 1);
                }
              });
            });
          });

          await cacheEntryRemoved;

          socket.off('new_channel_created');
          socket.off('server_joined');
          socket.off('server_deleted');
          socket.off('channel_joined');
          socket.off('channel_deleted');
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
        url: '/channel/create/group-direct-message',
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
    RecieveInvitationFromDirectMessage: builder.mutation({
      query: (body) => ({
        url: '/channel/recieve-invitation/direct-message',
        method: 'POST',
        body,
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          const { data } = await cacheDataLoaded;
          const targetUsers = data.targetUsers;
          const currentUser = data.currentUser;
          const directMessage = data.directMessage;
          const newMessage = data.newMessage;

          socket.emit('send_message', newMessage);

          socket.emit('recieve_invitation_from_direct_message', {
            targetUsers, 
            currentUser,
            directMessage,
          });

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
          const { data } = await cacheDataLoaded;
          const targetChannel = data.targetChannel;
          const withDrawnUser = data.withDrawnUser;
          const newMessage = data?.newMessage;
          if (newMessage) {
            socket.emit('send_message', newMessage);
          }

          socket.emit('withdraw_from_channel', {targetChannel, withDrawnUser});

          await cacheEntryRemoved;
            
        } catch (err) {
          console.log(err);
        }
      }
    }),
    DeleteChannel: builder.mutation({
      query: (body) => ({
        url: '/channel/delete',
        method: 'DELETE',
        body,
      }),
      async onQueryStarted(
        arg,
        { queryFulfilled }
    ) {
        try {
          const { data: channel } = await queryFulfilled;

          socket.emit('delete_channel', channel);
            
        } catch (err) {
          console.log(err);
        }
      }
    })
  })
});

export const { 
  useCreateChannelMutation, 
  useGetChannelInfoQuery, 
  useGetParticipatingChannelsQuery,
  useAddDirectMessageMutation,
  useRemoveDirectMessageMutation,
  useCreateGroupDirectMessageMutation,
  useRecieveInvitationFromDirectMessageMutation,
  useWithdrawFromChannelMutation,
  useDeleteChannelMutation,
} = channelApi;
