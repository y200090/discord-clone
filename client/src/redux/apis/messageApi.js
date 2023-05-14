import { apiSlice } from '../slices/apiSlice';
import { socket } from '../../socket';

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    PostMessage: builder.mutation({
      query: (body) => ({
        url: '/message/post',
        method: 'POST',
        body
      }),
      // invalidatesTags: ['Message'],
      async onCacheEntryAdded(
        arg, 
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          const { data: newMessage } = await cacheDataLoaded;
          console.log('新しいメッセージ: ', newMessage)

          socket.emit('send_message', newMessage);
          
          await cacheEntryRemoved;

        } catch (err) {
          console.log(err);
        }
      }
    }),
    getMessages: builder.query({
      query: (channelId) => ({
          url: `/message/history/${channelId}`,
          method: 'GET'
      }),
      // providesTags: ['Message'],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          const { data } = await cacheDataLoaded;

          socket.on('message_sent', (newMessage) => {
            console.log(newMessage)
            updateCachedData((draft) => {
              if (data.currentChannelId == newMessage.postedChannel._id) {
                draft.messages.push(newMessage);
              }
            });
          });

          socket.on('unreadMessages_cleared', ({ currentUser, unreadMessages }) => {
            updateCachedData((draft) => {
              unreadMessages?.forEach((unreadMessage) => {
                let index = draft.messages.findIndex((item) => {
                  return item?._id == unreadMessage?._id;
                });
                if (index == -1) return;
                draft.messages[index].readUsers.push(currentUser);
              });
            });
          });

          await cacheEntryRemoved;

          socket.off('message_sent');
          socket.off('unreadMessages_cleared');
          
        } catch (err) {
          console.log(err);
        }
      }
    })
  })
});

export const {
  usePostMessageMutation,
  useGetMessagesQuery,
} = messageApi;
