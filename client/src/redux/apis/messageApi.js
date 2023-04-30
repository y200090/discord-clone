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

          await cacheEntryRemoved;

          socket.off('message_sent');
          
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
