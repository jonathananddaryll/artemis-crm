import { configureStore } from '@reduxjs/toolkit';
import JobReducer from '../reducers/JobReducer';

export const store = configureStore({
  reducer: {
    jobs: JobReducer
  }
});
