import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

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

// Creates a new Note
export const createNote = createAsyncThunk(
  'note/createNote',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.post('/api/notes', formData, config);
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Updates a note
export const updateNote = createAsyncThunk(
  'note/updateNote',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/notes/${formData.noteId}`,
        formData,
        config
      );
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
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

// Deletes a note
export const deleteNote = createAsyncThunk(
  'job/deleteNote',
  async (formData, thunkAPI) => {
    const headers = {
      Authorization: `Bearer ${formData.token}`
    };

    try {
      const res = await axios.delete(`/api/notes/${formData.noteId}`, {
        data: { formData },
        headers
      });

      return res.data;
    } catch (error) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Get All Tasks with jobId
export const getAllTasks = createAsyncThunk(
  'task/getAllTasksWithJobId',
  async (job_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/tasks/job/${job_id}`);
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Creates a new Task
export const createTask = createAsyncThunk(
  'task/createTask',
  async (formData, thunkAPI) => {
    console.log(formData);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.post('/api/tasks', formData, config);
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Updates a task status
export const updateTaskStatus = createAsyncThunk(
  'note/updateTaskStatus',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/tasks/${formData.taskId}/status`,
        formData,
        config
      );
      return res.data;
    } catch (error) {
      console.log(err);
    }
  }
);

// Deletes a task
export const deleteTask = createAsyncThunk(
  'job/deleteTask',
  async (formData, thunkAPI) => {
    const headers = {
      Authorization: `Bearer ${formData.token}`
    };

    try {
      const res = await axios.delete(`/api/tasks/${formData.taskId}`, {
        data: { formData },
        headers
      });

      return res.data;
    } catch (error) {
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
    tasks: [],
    completedTasks: [],
    interviews: [],
    completedInterviews: []
  },
  reducers: {
    resetSelectedJobItems: (state, action) => {
      state.timelinesLoading = true;
      state.notesLoading = true;
      state.tasksLoading = true;
      state.timelines = [];
      state.notes = [];
      state.tasks = [];
      state.interviews = [];
      state.completedInterviews = [];
      state.completedTasks = [];
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllTimelines.fulfilled, (state, action) => {
      state.timelines = action.payload;
      state.timelinesLoading = false;
    });

    builder.addCase(getAllNotes.fulfilled, (state, action) => {
      state.notes = action.payload;
      state.notesLoading = false;
    });

    builder.addCase(createNote.fulfilled, (state, action) => {
      state.notes = [action.payload[0].rows[0], ...state.notes];
      state.timelines = [action.payload[1].rows[0], ...state.timelines];
      // FIGURE THIS OUT LATER
      // state.notes = [action.payload[0].rows[0], ...state.notes];
      // state.timeline = [action.payload[1].rows[0], ...state.timelines];
      toast.success('Successfully Created a New Note');
    });

    // Display errors in createNote with toastify
    builder.addCase(createNote.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(updateNote.fulfilled, (state, action) => {
      // Find the index of the updated note then change it to the updated note
      const index = state.notes.findIndex(
        note => note.id === action.payload.id
      );
      state.notes[index] = action.payload;
      toast.success('Successfully Updated a Note');
    });

    // Display errors in updateNote with toastify
    builder.addCase(updateNote.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(deleteNote.fulfilled, (state, action) => {
      // Filter notes without the deleted note
      state.notes = state.notes.filter(
        note => note.id !== action.payload[0].rows[0].id
      );
      state.timelines = [action.payload[1].rows[0], ...state.timelines];
      toast.success('Successfully Deleted a Note');
    });

    builder.addCase(getAllTasks.fulfilled, (state, action) => {
      const tasks = action.payload;
      state.tasks = tasks.filter(task => task.is_done === false);
      state.completedTasks = tasks.filter(task => task.is_done === true);
      state.tasksLoading = false;

      // Upcoming Interviews
      state.interviews = tasks.filter(
        task =>
          (task.category.includes('e Interview') ||
            task.category.includes('Screen')) &&
          task.is_done === false
      );

      // Completed Interviews
      state.completedInterviews = tasks.filter(
        task =>
          (task.category.includes('e Interview') ||
            task.category.includes('Screen')) &&
          task.is_done === true
      );
    });

    builder.addCase(createTask.fulfilled, (state, action) => {
      const newAddedTask = action.payload[0].rows[0];
      newAddedTask.is_done === false
        ? (state.tasks = [newAddedTask, ...state.tasks])
        : (state.completedTasks = [newAddedTask, ...state.completedTasks]);
      state.timelines = [action.payload[1].rows[0], ...state.timelines];

      // Check if the new added task is interview or screen type
      if (
        newAddedTask.category.includes('e Interview') ||
        newAddedTask.category.includes('Screen')
      ) {
        state.interviews = [newAddedTask, ...state.interviews];
      }

      toast.success('Successfully Created a New Task');
    });

    // Display errors in createTask with toastify
    builder.addCase(createTask.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      // Find the index of the updated task then change it to the updated task
      var updatedTask = action.payload;

      ///////////////// HAVE A REDUCER FROM BOARDERDUCER THAT ADDS 1 TO THE INCOMPLETE_tASK_COUNT WHEN A USER IS ADDING A TASK. DEDUCT 1 IF THE USER COMPLETED A TASK
      if (updatedTask.is_done === true) {
        const filteredTasks = state.tasks.filter(
          task => task.id !== updatedTask.id
        );
        state.tasks = filteredTasks;
        state.completedTasks = [...state.completedTasks, updatedTask];

        // Updates the completedInterview
        if (
          updatedTask.category.includes('e Interview') ||
          updatedTask.category.includes('Screen')
        ) {
          // Take out the updated task
          const filteredInterviews = state.interviews.filter(
            task => task.id !== updatedTask.id
          );
          state.interviews = filteredInterviews;

          // Add updated task
          state.completedInterviews = [
            ...state.completedInterviews,
            updatedTask
          ];
        }

        toast.success('Good Job Completing a Task');
      } else {
        const filteredTasks = state.completedTasks.filter(
          task => task.id !== updatedTask.id
        );
        state.completedTasks = filteredTasks;
        state.tasks = [...state.tasks, updatedTask];

        // Updates the interview
        if (
          updatedTask.category.includes('e Interview') ||
          updatedTask.category.includes('Screen')
        ) {
          // Take out the updated task
          const filteredInterviews = state.completedInterviews.filter(
            task => task.id !== updatedTask.id
          );
          state.completedInterviews = filteredInterviews;

          // Add updated Task
          state.interviews = [...state.interviews, updatedTask];
        }

        toast.success('Dont Forget to Finish That Task');
      }
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      // Filter notes without the deleted note
      const deletedTask = action.payload[0].rows[0];

      if (deletedTask.is_done === false) {
        state.tasks = state.tasks.filter(task => task.id !== deletedTask.id);

        // Remove the deleted task in the interviews if the task is an interview type
        if (
          deletedTask.category.includes('e Interview') ||
          deletedTask.category.includes('Screen')
        ) {
          state.interviews = state.interviews.filter(
            task => task.id !== deletedTask.id
          );
        }
      } else {
        state.completedTasks = state.completedTasks.filter(
          task => task.id !== deletedTask.id
        );

        // Remove the deleted task in the completedinterviews if the task is an interview type
        if (
          deletedTask.category.includes('e Interview') ||
          deletedTask.category.includes('Screen')
        ) {
          state.completedInterviews = state.completedInterviews.filter(
            task => task.id !== deletedTask.id
          );
        }
      }

      state.timelines = [action.payload[1].rows[0], ...state.timelines];
      toast.success('Successfully Deleted a Task');
    });
  }
});

export default selectedJobSlice.reducer;
export const { resetSelectedJobItems } = selectedJobSlice.actions;
