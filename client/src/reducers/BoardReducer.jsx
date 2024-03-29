import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import findIndex from '../helpers/findIndex';

import {
  updateTaskStatus,
  createTask,
  deleteTask,
  createNote,
  deleteNote
} from './SelectedJobReducer';

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

      // [0] = res.data
      // [1] = old Column Status Name - will be used to find the key to update selectedBoardStatusCols
      return [res.data, formData.oldColumnStatus];
      // return res.data;

      // return formData;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Update a board name
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

// Deletes a board
export const deleteBoard = createAsyncThunk(
  'job/deleteBoard',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        Authorization: `Bearer ${formData.token}`
      },
      data: formData
    };

    try {
      const res = await axios.delete(`/api/boards/${formData.boardId}`, config);

      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
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
    const config = {
      headers: {
        Authorization: `Bearer ${formData.token}`
      },
      data: formData
    };

    try {
      const res = await axios.delete(`/api/jobs/${formData.jobId}`, config);

      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

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
    toggleSelectedJobModal: false
  },
  reducers: {
    handleToggleForm: (state, action) => {
      state.toggleJobForm = action.payload[0];
      state.selectedStatusToAdd = action.payload[1];
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
      const index = findIndex(
        state.selectedBoardStatusCols[action.payload[1]],
        parseInt(action.payload[2])
      );

      state.selectedBoardStatusCols[action.payload[1]].splice(index, 1);
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
          job.company
            .toLowerCase()
            .includes(searchFilter.trim().toLowerCase()) ||
          job.job_title
            .toLowerCase()
            .includes(searchFilter.trim().toLowerCase()) ||
          job.location.toLowerCase().includes(searchFilter.trim().toLowerCase())
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
    /////////////// BOARDS EXTRA REDUCER //////////////////////////////////////
    builder.addCase(getBoards.fulfilled, (state, action) => {
      state.boards = action.payload;
      state.boardsLoading = false;
    });

    builder.addCase(getBoard.fulfilled, (state, action) => {
      state.selectedBoard = action.payload;
      state.selectedBoardLoading = false;
    });

    builder.addCase(createBoard.pending, () => {
      toast.loading('Creating New Board', {
        toastId: 'creatingBoard'
      });
    });

    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.boards = [
        { ...action.payload, total_jobs_count: 0 },
        ...state.boards
      ];

      toast.dismiss('creatingBoard');
      toast.success('Successfully Created New Board');
    });

    // Display errors in createBoard with toastify
    builder.addCase(createBoard.rejected, (state, action) => {
      toast.dismiss('creatingBoard');
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(addColumn.pending, () => {
      toast.loading('Adding New Column', {
        toastId: 'addingStatusColumn'
      });
    });

    builder.addCase(addColumn.fulfilled, (state, action) => {
      state.selectedBoardStatusCols = {
        ...state.selectedBoardStatusCols,
        [action.payload]: []
      };
      const newCol = 'column' + (state.selectedBoard.total_cols + 1);
      state.selectedBoard.total_cols = state.selectedBoard.total_cols + 1;
      state.selectedBoard[newCol] = action.payload;

      toast.dismiss('addingStatusColumn');
      toast.success(
        `Successfully Added a Column in ${state.selectedBoard.title}`
      );
    });

    // Display errors in addColumn with toastify
    builder.addCase(addColumn.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(deleteColumn.pending, () => {
      toast.loading('Deleting Status Column', {
        toastId: 'deletingStatusColumn'
      });
    });

    builder.addCase(deleteColumn.fulfilled, (state, action) => {
      delete state.selectedBoardStatusCols[action.payload[1]];
      state.selectedBoard = action.payload[0];

      toast.dismiss('deletingStatusColumn');
      toast.success(
        `Successfully Deleted a Column in ${state.selectedBoard.title}`
      );
    });

    builder.addCase(updateBoardColumn.pending, () => {
      toast.loading('Updating Status Column', {
        toastId: 'updatingStatusColumn'
      });
    });

    builder.addCase(updateBoardColumn.fulfilled, (state, action) => {
      const columnName = Object.keys(action.payload[0][0].rows[0])[0];
      const newStatusName = Object.values(action.payload[0][0].rows[0])[0];
      const oldStatusName = action.payload[1];

      // Updates the key of selectedBoardStatusCols and the jobs inside it with the updated jobs
      if (newStatusName !== oldStatusName) {
        delete Object.assign(state.selectedBoardStatusCols, {
          [newStatusName]: action.payload[0][1].rows
        })[oldStatusName];

        state.selectedBoard[columnName] = newStatusName;
      }

      toast.dismiss('updatingStatusColumn');
      toast.success('Successfully Renamed List');
    });

    // Display errors in updateBoardColumn with toastify
    builder.addCase(updateBoardColumn.rejected, (state, action) => {
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(updateBoardName.pending, () => {
      toast.loading('Updating Board Name', {
        toastId: 'updatingBoardName'
      });
    });

    builder.addCase(updateBoardName.fulfilled, (state, action) => {
      const index = findIndex(state.boards, action.payload.id);
      state.boards[index].title = action.payload.title;

      toast.dismiss('updatingBoardName');
      toast.success('Successfully Renamed Board');
    });

    // Display errors in updateBoardName with toastify
    builder.addCase(updateBoardName.rejected, (state, action) => {
      toast.dismiss('updatingBoardName');
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    // Remove the deleted board from state.boards and state.selectedBoard to null
    builder.addCase(deleteBoard.fulfilled, (state, action) => {
      state.selectedBoard = null;
      state.selectedBoardStatusCols = null;
      // state.selectedBoardLoading = true;

      // Removes the deleted board from the state.boards
      state.boards = state.boards.filter(
        board => board.id !== action.payload.id
      );

      toast.success('Successfully Deleted Board');
    });
    ////////////////////////////// JOBS EXTRA REDUCER ////////////////////////////
    builder.addCase(addJob.pending, (state, action) => {
      toast.loading('Adding New Job', {
        toastId: 'addingJob'
      });
    });

    builder.addCase(addJob.fulfilled, (state, action) => {
      // Updates the Kanban Board
      state.selectedBoardStatusCols[action.payload.status] = [
        {
          ...action.payload,
          incomplete_task_count: 0,
          total_note_count: 0,
          pending_interview_count: 0
        },
        ...state.selectedBoardStatusCols[action.payload.status]
      ];

      // Updates the jobs state
      state.jobs = [
        {
          ...action.payload,
          incomplete_task_count: 0,
          total_note_count: 0,
          pending_interview_count: 0
        },
        ...state.jobs
      ];

      // Updates total_jobs_count
      state.selectedBoard.total_jobs_count++;

      if (state.boards.length !== 0) {
        const index = findIndex(state.boards, action.payload.board_id);
        state.boards[index].total_jobs_count++;
      }

      toast.dismiss('addingJob');
      toast.success('Successfully Added New Job');
    });

    // Display errors in addJob with toastify
    builder.addCase(addJob.rejected, (state, action) => {
      toast.dismiss('addingJob');
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

    builder.addCase(updateJobStatus.pending, () => {
      toast.loading('Updating Job Status', {
        toastId: 'updatingJobStatus'
      });
    });

    builder.addCase(updateJobStatus.fulfilled, (state, action) => {
      // job status is already updating in the reducer when user drop a job to a different status it
      const statusColsIndex = findIndex(
        state.selectedBoardStatusCols[action.payload.status],
        action.payload.id
      );
      state.selectedBoardStatusCols[action.payload.status][
        statusColsIndex
      ].status = action.payload.status;

      // Find the index of the updated job in jobs
      const jobIndex = findIndex(state.jobs, action.payload.id);
      state.jobs[jobIndex].status = action.payload.status;

      toast.dismiss('updatingJobStatus');
      toast.success('Successfully Updated Job Status');
    });

    builder.addCase(updateJobInfo.pending, () => {
      toast.loading('Updating Job Info', {
        toastId: 'updatingJobInfo'
      });
    });

    builder.addCase(updateJobInfo.fulfilled, (state, action) => {
      // Find the index of the updated job in the selectedBoardStatusCols
      const statusColsIndex = findIndex(
        state.selectedBoardStatusCols[action.payload.status],
        action.payload.id
      );

      // Find the index of the updated job in jobs
      const jobIndex = findIndex(state.jobs, action.payload.id);

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
      state.jobs[jobIndex] = tempSelectedJob;

      // Updates the job in the selectedBoardStatusCols to display the update in the kanban board
      state.selectedBoardStatusCols[action.payload.status][statusColsIndex] =
        tempSelectedJob;

      toast.dismiss('updatingJobInfo');
      toast.success('Successfully Updated Job Info');
    });

    // Display errors in updateJobInfo with toastify
    builder.addCase(updateJobInfo.rejected, (state, action) => {
      toast.dismiss('updatingJobInfo');
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(deleteJob.pending, () => {
      toast.loading('Deleting Job', {
        toastId: 'deletingJob'
      });
    });

    builder.addCase(deleteJob.fulfilled, (state, action) => {
      // Remove the deleted job from state.selectedBoardStatusCols
      state.selectedBoardStatusCols[action.payload.status] =
        state.selectedBoardStatusCols[action.payload.status].filter(
          job => job.id !== action.payload.id
        );

      // Remove the deleted job from state.jobs
      state.jobs = state.jobs.filter(job => job.id !== action.payload.id);

      // Updates total_jobs_count
      state.selectedBoard.total_jobs_count--;

      if (state.boards.length !== 0) {
        const index = findIndex(state.boards, action.payload.board_id);
        state.boards[index].total_jobs_count--;
      }

      toast.dismiss('deletingJob');
      toast.success('Successfully Deleted Job');
    });

    // @TODO: CREATE A BETTER REJECTED MESSAGE
    builder.addCase(deleteJob.rejected, () => {
      toast.dismiss('deletingJob');
      toast.error('Delete Failed');
    });

    ////////////////////// UPDATE HERE FROM FULLFILLING ACTIONS FROM ANOTHER REDUCER///////////////////////////////////
    // Updates the incomplete_task_count and pending_interview_count in selectedJob, selectedBoardStatusCols, and jobs on successful task update
    builder.addMatcher(isAnyOf(updateTaskStatus.fulfilled), (state, action) => {
      // Finds the index of the updated job in selectedBoardStatusCols
      const selectedJobIndex = findIndex(
        state.selectedBoardStatusCols[state.selectedJob.status],
        action.payload.job_id
      );

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = findIndex(state.jobs, action.payload.job_id);

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
      const selectedJobIndex = findIndex(
        state.selectedBoardStatusCols[state.selectedJob.status],
        newAddedTask.job_id
      );

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = findIndex(state.jobs, newAddedTask.job_id);

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
      const selectedJobIndex = findIndex(
        state.selectedBoardStatusCols[state.selectedJob.status],
        newAddedNote.job_id
      );

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = findIndex(state.jobs, newAddedNote.job_id);

      state.selectedJob.total_note_count++;
      state.selectedBoardStatusCols[state.selectedJob.status][selectedJobIndex]
        .total_note_count++;
      state.jobs[jobIndexInJobs].total_note_count++;
    });

    // Updates the total_note_count in selectedJob, selectedBoardStatusCols, and jobs on successful note deletion
    builder.addMatcher(isAnyOf(deleteNote.fulfilled), (state, action) => {
      const deletedNote = action.payload[0].rows[0];

      // Finds the index
      const selectedJobIndex = findIndex(
        state.selectedBoardStatusCols[state.selectedJob.status],
        deletedNote.job_id
      );

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = findIndex(state.jobs, deletedNote.job_id);

      state.selectedJob.total_note_count--;
      state.selectedBoardStatusCols[state.selectedJob.status][selectedJobIndex]
        .total_note_count--;
      state.jobs[jobIndexInJobs].total_note_count--;
    });

    // Updates the incomplete_task_count in selectedJob, selectedBoardStatusCols, and jobs on successful task creation
    builder.addMatcher(isAnyOf(deleteTask.fulfilled), (state, action) => {
      const deletedTask = action.payload[0].rows[0];

      // Finds the index
      const selectedJobIndex = findIndex(
        state.selectedBoardStatusCols[state.selectedJob.status],
        deletedTask.job_id
      );

      // Finds the index of the updated job in jobs
      const jobIndexInJobs = findIndex(state.jobs, deletedTask.job_id);

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
  filterJob
} = boardSlice.actions;
