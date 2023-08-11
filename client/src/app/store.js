import { configureStore } from '@reduxjs/toolkit';
import BoardReducer from '../reducers/BoardReducer';
import SelectedJobReducer from '../reducers/SelectedJobReducer';

export const store = configureStore({
  reducer: {
    board: BoardReducer,
    selectedJob: SelectedJobReducer
  }
});
