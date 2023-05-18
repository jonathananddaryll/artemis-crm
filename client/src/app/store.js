import { configureStore } from '@reduxjs/toolkit';
import JobReducer from '../reducers/JobReducer';
import BoardReducer from '../reducers/BoardReducer';

export const store = configureStore({
  reducer: {
    job: JobReducer,
    board: BoardReducer
  }
});
