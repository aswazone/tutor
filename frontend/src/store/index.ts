import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import courseReducer from './course';
import fetchReducer from './fetch';
import wishlistReducer from './wishlist';
import adminReducer from './admin/adminSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth: authReducer,
    course: courseReducer,
    fetch: fetchReducer,
    wishlist: wishlistReducer,
    admin: adminReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for redux-persist
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;