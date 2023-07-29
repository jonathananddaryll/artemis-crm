import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get All Timeline with jobId
export const getAllTimelines = createAsyncThunk(
  'timeline/getAllTimeslineWithJobId',
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

// Create a new Note
export const createNote = createAsyncThunk(
  'note/createNote',
  async (formData, thunkAPI) => {
    console.log('this is in createNote redux slice');
    console.log(formData);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.post('/api/notes', formData, config);
      return res.data;
    } catch (error) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Get All Notes with jobId
export const getAllNotes = createAsyncThunk(
  'notes/getAllNotesWithJobId',
  async (job_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/notes/job/${job_id}`);
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

const selectedJobSlice = createSlice({
  name: 'selectedJob',
  initialState: {
    timelinesLoading: true,
    notesLoading: true,
    tasksLoading: true,
    timelines: [],
    notes: [],
    tasks: []
  },
  reducers: {
    resetSelectedJobItems: (state, action) => {
      state.timelinesLoading = true;
      state.notesLoading = true;
      state.tasksLoading = true;
      state.timelines = [];
      state.notes = [];
      state.tasks = [];
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllTimelines.fulfilled, (state, action) => {
      state.timelines = action.payload;
      state.timelinesLoading = false;
      // delete this later. it's just to check if this triggers
      console.log('getAllTimelines is triggered');
    });

    builder.addCase(getAllNotes.fulfilled, (state, action) => {
      state.notes = action.payload;
      state.notesLoading = false;
      // delete this later. it's just to check if this triggers
      console.log('getAllNotes is triggered');
    });

    builder.addCase(createNote.fulfilled, (state, action) => {
      state.notes = [action.payload[0].rows[0], ...state.notes];
      state.timelines = [action.payload[1].rows[0], ...state.timelines];
      // FIGURE THIS OUT LATER
      // state.notes = [action.payload[0].rows[0], ...state.notes];
      // state.timeline = [action.payload[1].rows[0], ...state.timelines];
    });
  }
});

export default selectedJobSlice.reducer;
export const { resetSelectedJobItems } = selectedJobSlice.actions;
