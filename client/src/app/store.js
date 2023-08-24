import { configureStore } from '@reduxjs/toolkit';
import BoardReducer from '../reducers/BoardReducer';
import SelectedJobReducer from '../reducers/SelectedJobReducer';
import ContactReducer from '../reducers/ContactReducer';

export const store = configureStore({
  reducer: {
    board: BoardReducer,
    selectedJob: SelectedJobReducer,
    contact: ContactReducer,
  }
});
