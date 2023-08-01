import { configureStore } from '@reduxjs/toolkit';
import BoardReducer from '../reducers/BoardReducer';
import TimelineReducer from '../reducers/TimelineReducer';
import ContactReducer from '../reducers/ContactReducer';

export const store = configureStore({
  reducer: {
    board: BoardReducer,
    timeline: TimelineReducer,
    contact: ContactReducer,
  }
});
