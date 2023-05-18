import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Delete this later
const fakeJobs = [
  {
    jobtitle: 'software engineer',
    company: 'google'
  },
  {
    jobtitle: 'software engineer',
    company: 'meta'
  }
];

// Create action
// and then call the action inwide extraReducer.
// add getjobswithBoardId later
export const getjobswithBoardId = createAsyncThunk(
  'job/getAllJobs',
  async () => {
    try {
      const res = await axios.get('/api/jobs');
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: [],
    selectedJob: null,
    loading: false
  },

  extraReducers: builder => {
    // call the action here and then action.payload is whatever the returned value from the action (res.data).
    // .fulfilled is if the action is successful, basically
    builder.addCase(getjobswithBoardId.fulfilled, (state, action) => {
      state.jobs = action.payload;
      state.loading = false;
      // delete this later. it's just to check if this triggers
      console.log('getjobswithboardID is triggered');
    });
  }
});

export const { loadJobsFromSelectedBoard } = jobSlice.actions;
export default jobSlice.reducer;
