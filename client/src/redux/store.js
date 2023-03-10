import { configureStore } from '@reduxjs/toolkit'
import { authApi } from './apis/authApi';
import authReducer from './auth/slices';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});
