import { configureStore } from '@reduxjs/toolkit';
import globeReducer from './slices/globeSlice';

export const store = configureStore({
  reducer: {
    globe: globeReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store; 