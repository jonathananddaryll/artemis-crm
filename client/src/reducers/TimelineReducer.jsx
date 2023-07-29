import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get All Timeline with jobId
export const getAllTimelines = createAsyncThunk(
  'board/getAllTimelineWithJobId',
  async (job_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/timelines/job/${job_id}`);
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

const timelineSlice = createSlice({
  name: 'board',
  initialState: {
    timelinesLoading: true,
    timelines: []
  },
  reducers: {
    resetTimelines: (state, action) => {
      state.timelinesLoading = true;
      state.timelines = [];
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllTimelines.fulfilled, (state, action) => {
      state.timelines = action.payload;
      state.timelinesLoading = false;
      // delete this later. it's just to check if this triggers
      console.log('getAllTimelines is triggered');
    });
  }
});

export default timelineSlice.reducer;
export const { resetTimelines } = timelineSlice.actions;
