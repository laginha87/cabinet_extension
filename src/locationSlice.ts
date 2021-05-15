import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store';


// Define a type for the slice state
interface LocationState {
  favorite: string;
}

// Define the initial state using that type
const initialState: LocationState = {
  favorite: localStorage.getItem('favorite') || ''
}

export const locationSlice = createSlice({
  name: 'location',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    favorite: (state, action) => {
      localStorage.setItem('favorite', action.payload)
      state.favorite = action.payload;
    }
  },
})

export const { favorite } = locationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectFavorite = ({location: { favorite }}: RootState) => favorite;

export const locationReducer = locationSlice.reducer
