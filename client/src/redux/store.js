import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apis/apiSlice';
import authReducer from './auth/slices';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
