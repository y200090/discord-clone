import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice'; 
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import serverReducer from './slices/serverSlice';
import channelReducer from './slices/channelSlice';
import requestReducer from './slices/requestSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        server: serverReducer,
        channel: channelReducer,
        request: requestReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
