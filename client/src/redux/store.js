import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice'; 
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import serverReducer from './slices/serverSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        server: serverReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
