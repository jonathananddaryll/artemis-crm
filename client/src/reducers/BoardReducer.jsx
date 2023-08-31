import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

import {
  updateTaskStatus,
  createTask,
  deleteTask,
  createNote,
  deleteNote
} from './SelectedJobReducer';

// Create action

////////////////////////////////// BOARDS ////////////////////////////

// Get All Boards with userID
export const getBoards = createAsyncThunk(
  'board/getBoardswithUserId',
  async (user_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/boards/${user_id}`);
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Gets a board with boardId
export const getBoard = createAsyncThunk(
  'board/getBoardwithBoardId',
  async (boardInfo, thunkAPI) => {
    try {
      const res = await axios.get(
        `/api/boards/${boardInfo.userId}/board/${boardInfo.boardId}`
      );
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Creates a new board
export const createBoard = createAsyncThunk(
  'board/createBoard',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.post('/api/boards', formData, config);
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Adds a new column/status to a board
export const addColumn = createAsyncThunk(
  'board/addColumn',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/boards/${formData.id}/add/column`,
        formData,
        config
      );

      // return res.data;
      return formData.columnStatus;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Deletes a column/status of a board
export const deleteColumn = createAsyncThunk(
  'board/deleteColumn',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };
    try {
      const res = await axios.patch(
        `/api/boards/${formData.id}/delete/column`,
        formData,
        config
      );

      const resData = [res.data, formData.columnStatusToDelete];

      // console.log(res.data);
      return resData;

      // return formData.columnStatus;
      // RETURN A NEW BOARD WITHOUT THE DELETED COLUMN
    } catch (err) {
      // If there's errors
      console.log(err);
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Update a column status name
export const updateBoardColumn = createAsyncThunk(
  'board/updateColumnStatus',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/boards/${formData.id}/update/column`,
        formData,
        config
      );

      // return res.data;
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Update a column name
export const updateBoardName = createAsyncThunk(
  'board/updateBoardName',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/boards/${formData.id}/update/name`,
        formData,
        config
      );

      // return res.data;
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Gets all the job with boardId
export const getjobswithBoardId = createAsyncThunk(
  'board/getJobswithBoardId',
  async (board_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/jobs/board/${board_id}`);
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Creates a new job
export const addJob = createAsyncThunk(
  'job/addJob',
  async (formData, thunkAPI) => {
    // console.log('addJob triggered in redux reducer: ' + formData.token);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.post('/api/jobs', formData, config);
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Updates a job status
export const updateJobStatus = createAsyncThunk(
  'board/updateJobStatus',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/jobs/${formData.job_id}/status`,
        formData,
        config
      );

      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Updates a job information
export const updateJobInfo = createAsyncThunk(
  'board/updateJobInfo',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/jobs/${formData.job_id}/jobinfo`,
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

// Deletes a job
export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (formData, thunkAPI) => {
    const headers = {
      Authorization: `Bearer ${formData.token}`
    };

    try {
      const res = await axios.delete(`/api/jobs/${formData.jobId}`, {
        data: { formData },
        headers
      });

      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// @TODO:
// 1. create a getSelectedBoard with Id that calls the in api with the id. usually dont do this unless the page is refreshed
const boardSlice = createSlice({
  name: 'board',
  initialState: {
    boards: [],
    jobs: [],
    selectedBoard: null,
    selectedBoardStatusCols: null,
    selectedBoardLoading: true,
    boardsLoading: true,
    jobsLoading: true,
    selectedJob: null,
    toggleJobForm: false,
    selectedStatusToAdd: null,
    toggleSelectedJobModal: false,
    toggleColumnUpdateForm: false,
    selectedJob: null
  },
  reducers: {
    handleToggleForm: (state, action) => {
      state.toggleJobForm = action.payload[0];
      state.selectedStatusToAdd = action.payload[1];
    },
    handleColumnUpdateForm: (state, action) => {
      state.toggleColumnUpdateForm = action.payload;
    },
    changeSelectedJob: (state, action) => {
      state.toggleSelectedJobModal = action.payload[0];
      state.selectedJob = action.payload[1];
    },
    changeBoard: (state, action) => {
      const board = action.payload;
      state.selectedBoardLoading = true;
      state.selectedBoard = board;

      // fill up the selectedBoardStatusCols with the column status of the selectedBoard
      const newColObj = {};
      Object.keys(board)
        .filter(key => key.includes('column') && board[key] !== null)
        .forEach((keyName, i) => {
          newColObj[board[keyName]] = [];
        });
      state.selectedBoardStatusCols = newColObj;
      state.selectedBoardLoading = false;
    },
    removeFromStatus: (state, action) => {
      state.selectedBoardStatusCols[action.payload[1]].splice(
        state.selectedBoardStatusCols[action.payload[1]].findIndex(
          job => job.id === parseInt(action.payload[2])
        ),
        1
      );
    },
    // Add the job dragged into the new status
    addToStatus: (state, action) => {
      // Get the job that the user is dragging
      const job = state.selectedBoardStatusCols[action.payload[1]].find(
        item => item.id === parseInt(action.payload[2])
      );

      // Add the job that was removed from previous status to the new status
      state.selectedBoardStatusCols[action.payload[0]].push(job);
    },

    filterJob: (state, action) => {
      const searchFilter = action.payload;
      const filteredjobs = state.jobs.filter(
        job =>
          job.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
          job.job_title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          job.location.toLowerCase().includes(searchFilter.toLowerCase())
      );

      // Clear all the columns
      for (let col in state.selectedBoardStatusCols) {
        state.selectedBoardStatusCols[col] = [];
      }

      // Revert back to unfiltered jobs whenever the search bar is empty
      if (searchFilter.length > 0) {
        filteredjobs.forEach(job =>
          state.selectedBoardStatusCols[job.status].push(job)
        );
      } else {
        state.jobs.forEach(job =>
          state.selectedBoardStatusCols[job.status].push(job)
        );
      }
    }
  },

  extraReducers: builder => {
    // call the action here and then action.payload is whatever the returned value from the action (res.data).
    // .fulfilled is if the action is successful, basically
    /////////////// BOARDS EXTRA REDUCER //////////////////////////////////////
    builder.addCase(getBoards.fulfilled, (state, action) => {
      state.boards = action.payload;
      state.boardsLoading = false;
    });

    builder.addCase(getBoard.fulfilled, (state, action) => {
      state.selectedBoard = action.payload;
      state.selectedBoardLoading = false;
    });

    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.boards = [action.payload, ...state.boards];
      toast.success('Successfully Created a New Board');
    });

    // Display errors in createBoard with toastify
    builder.addCase(createBoard.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(addColumn.fulfilled, (state, action) => {
      state.selectedBoardStatusCols = {
        ...state.selectedBoardStatusCols,
        [action.payload]: []
      };
      const newCol = 'column' + (state.selectedBoard.total_cols + 1);
      state.selectedBoard.total_cols = state.selectedBoard.total_cols + 1;
      state.selectedBoard[newCol] = action.payload;
      toast.success(
        `Successfully Added a Column in ${state.selectedBoard.title}`
      );
    });

    // Display errors in addColumn with toastify
    builder.addCase(addColumn.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      console.log(action.payload);

      delete state.selectedBoardStatusCols[action.payload[1]];
      state.selectedBoard = action.payload[0];

      // const newCol = 'column' + (state.selectedBoard.total_cols + 1);
      // state.selectedBoard.total_cols = state.selectedBoard.total_cols + 1;
      // state.selectedBoard[newCol] = action.payload;
      toast.success(
        `Successfully Deleted a Column in ${state.selectedBoard.title}`
      );
    });

    builder.addCase(updateBoardColumn.fulfilled, (state, action) => {
      console.log(action.payload);
    });

    builder.addCase(updateBoardName.fulfilled, (state, action) => {
      const foundIndex = state.boards.findIndex(
        job => job.id === action.payload.id
      );
      state.boards[foundIndex].title = action.payload.title;
      toast.success('Successfully Renamed a Board');
    });

    // Display errors in addJob with toastify
    builder.addCase(updateBoardName.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    ////////////////////////////// JOBS EXTRA REDUCER ////////////////////////////
    builder.addCase(addJob.fulfilled, (state, action) => {
      state.selectedBoardStatusCols[action.payload.status] = [
        action.payload,
        ...state.selectedBoardStatusCols[action.payload.status]
      ];
      // state.selectedBoardStatusCols[action.payload.status].push(action.payload);
      // state.boards = [...state.boards, action.payload];
      toast.success('Successfully Added a New Job');
    });

    // Display errors in addJob with toastify
    builder.addCase(addJob.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(getjobswithBoardId.fulfilled, (state, action) => {
      // @@@@@@@@ I MIGHT NOT NEED TO KEEP TRACK OF JOBS STATES SINCE IT'S ALREADY IN THE STATUS COLUMN INSIDE BOARD
      // state.jobs = action.payload;
      state.jobsLoading = false;
      const jobs = action.payload;
      // const cols = state.selectedBoardStatusCols;
      jobs.forEach(job => state.selectedBoardStatusCols[job.status].push(job));
      state.jobs = jobs;
    });

    builder.addCase(updateJobStatus.fulfilled, (state, action) => {
      // job status is already updating in the reducer when user drop a job to a different status it
      const foundIndex = state.selectedBoardStatusCols[
        action.payload.status
      ].findIndex(job => job.id === action.payload.id);
      state.selectedBoardStatusCols[action.payload.status][foundIndex].status =
        action.payload.status;
      toast.success('Successfully Updated Job Status');
    });

    builder.addCase(updateJobInfo.fulfilled, (state, action) => {
      // Find the index of the updated job in the selectedBoardStatusCols
      const foundIndex = state.selectedBoardStatusCols[
        action.payload.status
      ].findIndex(job => job.id === action.payload.id);

      // Find the index of the updated job in jobs
      const jobIndexInJobs = state.jobs.findIndex(
        job => job.id === action.payload.id
      );

      // Temporary SelectedJob with the updated Info and the counts
      const tempSelectedJob = action.payload;
      tempSelectedJob.incomplete_task_count =
        state.selectedJob.incomplete_task_count;
      tempSelectedJob.total_note_count = state.selectedJob.total_note_count;
      tempSelectedJob.pending_interview_count =
        state.selectedJob.pending_interview_count;

      // Updates the selectedJob
      state.selectedJob = tempSelectedJob;

      // Updates the updated job in the jobs state
      state.jobs[jobIndexInJobs] = tempSelectedJob;

      // Updates the job in the selectedBoardStatusCols to display the update in the kanban board
      state.selectedBoardStatusCols[action.payload.status][foundIndex] =
        tempSelectedJob;
      toast.success('Successfully Updated Job Info');
    });

    // Display errors in updateJobInfo with toastify
    builder.addCase(updateJobInfo.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(deleteJob.fulfilled, (state, action) => {
      // filters jobs without the deleted job
      const jobsWithoutDeletedJob = state.selectedBoardStatusCols[
        action.payload.status
      ].filter(job => job.id !== action.payload.id);

      state.selectedBoardStatusCols[action.payload.status] =
        jobsWithoutDeletedJob;
      toast.success('Successfully Deleted a Job');
    });

    ////////////////////// UPDATE HERE FROM FULLFILLING ACTIONS FROM ANOTHER REDUCER///////////////////////////////////
    // Updates the incomplete_task_count and pending_interview_count in selectedJob, selectedBoardStatusCols, and jobs on successful task update
    builder.addMatcher(isAnyOf(updateTaskStatus.fulfilled), (state, action) => {
      // Finds the index of the updated job in selectedBoardStatusCols
      const selectedJobIndex = state.selectedBoardStatusCols[
        state.selectedJob.status
      ].findIndex(job => job.id === action.payload.job_id);

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = state.jobs.findIndex(
        job => job.id === action.payload.job_id
      );

      if (action.payload.is_done === false) {
        // Updates incomplete_task_count in selectedJob
        state.selectedJob.incomplete_task_count++;

        // Updates incomplete_task_count in selectedBoardStatusCols
        state.selectedBoardStatusCols[state.selectedJob.status][
          selectedJobIndex
        ].incomplete_task_count++;

        // Updates incomplete_task_count in jobs
        state.jobs[jobIndexInJobs].incomplete_task_count++;
      } else {
        // Updates incomplete_task_count in selectedJob
        state.selectedJob.incomplete_task_count--;

        // Updates incomplete_task_count in selectedBoardStatusCols
        state.selectedBoardStatusCols[state.selectedJob.status][
          selectedJobIndex
        ].incomplete_task_count--;

        // Updates incomplete_task_count in jobs
        state.jobs[jobIndexInJobs].incomplete_task_count--;

        // Updates the pending_interview_count if the task being updated is an interview type
        if (
          action.payload.category.includes('e Interview') ||
          action.payload.category.includes('Screen')
        ) {
          state.selectedJob.pending_interview_count--;
          state.selectedBoardStatusCols[state.selectedJob.status][
            selectedJobIndex
          ].pending_interview_count--;
          state.jobs[jobIndexInJobs].pending_interview_count--;
        }
      }
    });

    // Updates the incomplete_task_count and pending_interview_count in selectedJob, selectedBoardStatusCols, and jobs on successful task creation
    builder.addMatcher(isAnyOf(createTask.fulfilled), (state, action) => {
      const newAddedTask = action.payload[0].rows[0];

      // Finds the index
      const selectedJobIndex = state.selectedBoardStatusCols[
        state.selectedJob.status
      ].findIndex(job => job.id === newAddedTask.job_id);

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = state.jobs.findIndex(
        job => job.id === newAddedTask.job_id
      );

      if (newAddedTask.is_done === false) {
        state.selectedJob.incomplete_task_count++;
        state.selectedBoardStatusCols[state.selectedJob.status][
          selectedJobIndex
        ].incomplete_task_count++;
        state.jobs[jobIndexInJobs].incomplete_task_count++;
      }

      if (
        (newAddedTask.category.includes('e Interview') ||
          newAddedTask.category.includes('Screen')) &&
        newAddedTask.is_done === false
      ) {
        state.selectedJob.pending_interview_count++;
        state.selectedBoardStatusCols[state.selectedJob.status][
          selectedJobIndex
        ].pending_interview_count++;
        state.jobs[jobIndexInJobs].pending_interview_count++;
      }
    });

    // Updates the total_note_count in selectedJob, selectedBoardStatusCols, and jobs on successful note creation
    builder.addMatcher(isAnyOf(createNote.fulfilled), (state, action) => {
      const newAddedNote = action.payload[0].rows[0];

      // Finds the index
      const selectedJobIndex = state.selectedBoardStatusCols[
        state.selectedJob.status
      ].findIndex(job => job.id === newAddedNote.job_id);

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = state.jobs.findIndex(
        job => job.id === newAddedNote.job_id
      );

      state.selectedJob.total_note_count++;
      state.selectedBoardStatusCols[state.selectedJob.status][selectedJobIndex]
        .total_note_count++;
      state.jobs[jobIndexInJobs].total_note_count++;
    });

    // Updates the total_note_count in selectedJob, selectedBoardStatusCols, and jobs on successful note deletion
    builder.addMatcher(isAnyOf(deleteNote.fulfilled), (state, action) => {
      const deletedNote = action.payload[0].rows[0];

      // Finds the index
      const selectedJobIndex = state.selectedBoardStatusCols[
        state.selectedJob.status
      ].findIndex(job => job.id === deletedNote.job_id);

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = state.jobs.findIndex(
        job => job.id === deletedNote.job_id
      );

      state.selectedJob.total_note_count--;
      state.selectedBoardStatusCols[state.selectedJob.status][selectedJobIndex]
        .total_note_count--;
      state.jobs[jobIndexInJobs].total_note_count--;
    });

    // @TODO : update on deleteTask
    // Updates the incomplete_task_count in selectedJob, selectedBoardStatusCols, and jobs on successful task creation
    builder.addMatcher(isAnyOf(deleteTask.fulfilled), (state, action) => {
      const deletedTask = action.payload[0].rows[0];

      // Finds the index
      const selectedJobIndex = state.selectedBoardStatusCols[
        state.selectedJob.status
      ].findIndex(job => job.id === deletedTask.job_id);

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = state.jobs.findIndex(
        job => job.id === deletedTask.job_id
      );

      if (deletedTask.is_done === false) {
        state.selectedJob.incomplete_task_count--;
        state.selectedBoardStatusCols[state.selectedJob.status][
          selectedJobIndex
        ].incomplete_task_count--;
        state.jobs[jobIndexInJobs].incomplete_task_count--;
      }

      if (
        (deletedTask.category.includes('e Interview') ||
          deletedTask.category.includes('Screen')) &&
        deletedTask.is_done === false
      ) {
        state.selectedJob.pending_interview_count--;
        state.selectedBoardStatusCols[state.selectedJob.status][
          selectedJobIndex
        ].pending_interview_count--;
        state.jobs[jobIndexInJobs].pending_interview_count--;
      }
    });
  }
});

export default boardSlice.reducer;
export const {
  changeBoard,
  fillBoardWithJobs,
  removeFromStatus,
  addToStatus,
  changeSelectedJob,
  handleToggleForm,
  handleColumnUpdateForm,
  filterJob
} = boardSlice.actions;
