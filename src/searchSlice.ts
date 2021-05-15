import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './store';

interface SearchState {
  show: boolean;
}

// Define the initial state using that type
const initialState: SearchState = {
  show: false
};

export const searchSlice = createSlice({
  name: 'search',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {

    // Use the PayloadAction type to declare the contents of `action.payload`
    show: (state) => {
      state.show = true;
    },
    hide: (state) => {
      state.show = false;
    }
  },
})

export const { show, hide } = searchSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsOpen = ({ search: {show} }: RootState) : boolean => show;

export const searchReducer = searchSlice.reducer