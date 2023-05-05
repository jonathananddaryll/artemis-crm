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

// add getjobswithBoardId later
export const getJobs = createAsyncThunk('job/getJobs', async () => {
  try {
    const res = await axios.get('/api/jobs');
    return res.data;
  } catch (err) {
    // have a better error catch later
    console.log(err);
  }
});

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    jobs: [],
    selectedJob: null
  },

  reducers: {
    loadJobsFromSelectedBoard: (state, action) => {
      console.log('yooooooo');
    }
  },

  extraReducers: {
    [getJobs.fulfilled]: (state, action) => {
      state.jobs = [action.payload];
    }
  }
});

export const { loadJobsFromSelectedBoard } = jobSlice.actions;
export default jobSlice.reducer;
