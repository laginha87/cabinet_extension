import {configureStore} from '@reduxjs/toolkit'
import {searchReducer, show} from './searchSlice';
import {locationReducer} from './locationSlice'
import {ipcRenderer} from 'electron';
// ...

export const store = configureStore({
    reducer: {
        location: locationReducer,
        search: searchReducer
    },
})

declare global {
    interface Window {
        store: any;
    }
}

window.store = store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

ipcRenderer.on('globalSearch', () => {
    store.dispatch(show());
})