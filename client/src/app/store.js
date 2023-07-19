import { configureStore } from '@reduxjs/toolkit';
import BoardReducer from '../reducers/BoardReducer';

export const store = configureStore({
  reducer: {
    board: BoardReducer
  }
});
