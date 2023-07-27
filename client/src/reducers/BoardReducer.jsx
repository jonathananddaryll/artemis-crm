import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create action

////////////////////////////////// BOARDS ////////////////////////////

// Get All Boards with userID
export const getAllBoards = createAsyncThunk(
  'board/getBoardswithUserId',
  async (user_id, thunkAPI) => {
    try {
      // const res = await axios.get(`/api/boards/${user_id}`);
      // chill change this later tro dynamic user_id
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
    console.log('create board triggered in createBoard redux reducer');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    // Makes the string an obj to send a json to the post route
    // const formData = {
    //   title: title
    // };

    try {
      const res = await axios.post('/api/boards', formData, config);
      return res.data;
    } catch (error) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Adds a new column/status in the board
export const addColumn = createAsyncThunk(
  'board/addColumn',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    console.log('token sent from addColumn: ' + formData.token);
    // console.log(token);

    try {
      const res = await axios.patch(
        `/api/boards/${formData.id}/add`,
        formData,
        config
      );

      // return res.data;
      return formData.columnStatus;
    } catch (error) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Update a column status
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
    } catch (error) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Update a column name
export const updateColumnName = createAsyncThunk(
  'board/updateColumnName',
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
    } catch (error) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// @TODO:
// 1. update board (name)
// 2. update board (column)
// 3. delete board (make sure no jobs in it)
//////////////////////////// JOBS //////////////////////////////////////////////

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

// Adds a new job
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
    } catch (error) {
      // have a better error catch later
      console.log(err);
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

    console.log(formData);
    console.log(formData.token);

    try {
      const res = await axios.patch(
        `/api/jobs/${formData.job_id}/status`,
        formData,
        config
      );

      return res.data;
    } catch (error) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Deletes a job
export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (formData, thunkAPI) => {
    console.log('Delete Job Trigger in redux reducer');

    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${formData.token}`
    //   }
    // };

    const headers = {
      Authorization: `Bearer ${formData.token}`
    };

    // const data = {
    //   formData
    // };

    console.log(formData);
    console.log('it got to delete job extra reducer');
    try {
      const res = await axios.delete(`/api/jobs/${formData.jobId}`, {
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

// @todo:
// 1. Delete job
// 2. update job (name and information)
//

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
    // Changing it to object
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
      const newColObj = {};
      Object.keys(board)
        .filter(key => key.includes('column') && board[key] !== null)
        .forEach((keyName, i) => {
          newColObj[board[keyName]] = [];
        });

      console.log('ayooo changeboard triggered');

      state.selectedBoardStatusCols = newColObj;
      state.selectedBoardLoading = false;
    },
    // fillBoardWithJobs: (state, action) => {
    //   const jobs = action.payload;
    //   jobs.forEach(job => state.selectedBoardStatusCols[job.status].push(job));
    // },
    // Remove job from the status array
    removeFromStatus: (state, action) => {
      state.selectedBoardStatusCols[action.payload[1]].splice(
        state.selectedBoardStatusCols[action.payload[1]].findIndex(
          job => job.id === parseInt(action.payload[2])
        ),
        1
      );

      // state.selectedBoardStatusCols['screening'] = 'yfhgasfafsa';
    },
    // Add the job dragged into the new status
    addToStatus: (state, action) => {
      // Get the job that the user is dragging
      const job = state.selectedBoardStatusCols[action.payload[1]].find(
        item => item.id === parseInt(action.payload[2])
      );

      // Add the job that was removed from previous status to the new status
      state.selectedBoardStatusCols[action.payload[0]].push(job);
    }
  },

  extraReducers: builder => {
    // call the action here and then action.payload is whatever the returned value from the action (res.data).
    // .fulfilled is if the action is successful, basically
    /////////////// BOARDS EXTRA REDUCER //////////////////////////////////////
    builder.addCase(getAllBoards.fulfilled, (state, action) => {
      state.boards = action.payload;
      state.boardsLoading = false;
      // delete this later. it's just to check if this triggers
      console.log('getAllBoards is triggered');
    });

    builder.addCase(getBoard.fulfilled, (state, action) => {
      console.log('here is the action payload for getboard: ' + action.payload);
      state.selectedBoard = action.payload;
      state.selectedBoardLoading = false;
      // delete this later. it's just to check if this triggers
      console.log('getBoard with ID is triggered');
    });

    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.boards = [action.payload, ...state.boards];
      console.log('create board triggered');
    });

    // ADD COLUMN
    builder.addCase(addColumn.fulfilled, (state, action) => {
      state.selectedBoardStatusCols = {
        ...state.selectedBoardStatusCols,
        [action.payload]: []
      };
      const newCol = 'column' + (state.selectedBoard.total_cols + 1);
      console.log('new column is: ' + newCol);
      state.selectedBoard.total_cols = state.selectedBoard.total_cols + 1;
      state.selectedBoard[newCol] = action.payload;
    });

    builder.addCase(updateBoardColumn.fulfilled, (state, action) => {
      console.log('successfully updated column');
      console.log(action.payload);
    });

    builder.addCase(updateColumnName.fulfilled, (state, action) => {
      const foundIndex = state.boards.findIndex(
        job => job.id === action.payload.id
      );
      state.boards[foundIndex].title = action.payload.title;

      console.log('successfully updated column name');
    });

    ////////////////////////////// JOBS EXTRA REDUCER ////////////////////////////
    // builder.addCase(getjobswithBoardId.pending, (state, action) => {
    //   state.jobs = action.payload;
    //   state.jobsLoading = true;
    //   console.log('getjobswithboardID PENDING is triggered');
    // });
    builder.addCase(addJob.fulfilled, (state, action) => {
      state.selectedBoardStatusCols[action.payload.status].push(action.payload);
      // state.boards = [...state.boards, action.payload];
    });

    builder.addCase(getjobswithBoardId.fulfilled, (state, action) => {
      // @@@@@@@@ I MIGHT NOT NEED TO KEEP TRACK OF JOBS STATES SINCE IT'S ALREADY IN THE STATUS COLUMN INSIDE BOARD
      // state.jobs = action.payload;
      state.jobsLoading = false;

      const jobs = action.payload;
      const cols = state.selectedBoardStatusCols;
      jobs.forEach(job => state.selectedBoardStatusCols[job.status].push(job));
      // const cols = state.selectedBoardStatusCols;
      // jobs.forEach(job => cols[job.status].push(job));
      // state.selectedBoardStatusCols = cols;
      console.log('getjobswithboardID is triggered fsafaasffsafs');
    });

    // UPDATE JOB STATUS
    builder.addCase(updateJobStatus.fulfilled, (state, action) => {
      // ADD A ALERT OR LOADING BAR FOR UI.. FIGURE OUT A BETTER WAY TO IMPLEMENT THIS LATER ON, FOR NOW, HAVE THE REDUX CHANGE RIGHT AWAY USING THE REDUCER
      // state.selectedBoardStatusCols[action.payload.status].push(action.payload);
      // job status is already updating in the reducer when user drop a job to a different status it
      console.log('successfully updated the job status');
      console.log(action.payload);

      const foundIndex = state.selectedBoardStatusCols[
        action.payload.status
      ].findIndex(job => job.id === action.payload.id);
      state.selectedBoardStatusCols[action.payload.status][foundIndex].status =
        action.payload.status;
    });

    builder.addCase(deleteJob.fulfilled, (state, action) => {
      console.log('successfully deleted job');
      // filtered job without the deleted job
      const jobsWithoutDeletedJob = state.selectedBoardStatusCols[
        action.payload.status
      ].filter(job => job.id !== action.payload.id);

      state.selectedBoardStatusCols[action.payload.status] =
        jobsWithoutDeletedJob;
      console.log(action.payload);
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
  handleColumnUpdateForm
} = boardSlice.actions;
