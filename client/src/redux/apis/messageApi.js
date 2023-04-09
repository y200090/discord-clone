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
      invalidatesTags: ['Message'],
      async onCacheEntryAdded(
        arg, 
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          const newMessage = await cacheDataLoaded;
          console.log('新しいメッセージ: ', newMessage)

          socket.emit('send_message', newMessage.data);
          
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
      providesTags: ['Message'],
      // async onCacheEntryAdded(
      //   arg,
      //   { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      // ) {
      //   try {
      //     await cacheDataLoaded;

      //     socket.on('send_message', (newMessage) => {
      //       updateCachedData((draft) => {
      //         draft.push(newMessage);
      //       });
      //     });

      //     await cacheEntryRemoved;

      //     socket.off('send_message');
          
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }
    })
  })
});

export const {
  usePostMessageMutation,
  useGetMessagesQuery,
} = messageApi;
