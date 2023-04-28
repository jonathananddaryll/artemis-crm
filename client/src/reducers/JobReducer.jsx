import { createSlice } from '@reduxjs/toolkit';
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

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: fakeJobs,
    selectedJob: null
  },
  reducers: {
    loadJobsFromSelectedBoard: (state, action) => {
      console.log('yooooooo');
    }
  }
});

export const { loadJobsFromSelectedBoard } = jobSlice.actions;
export default jobSlice.reducer;
