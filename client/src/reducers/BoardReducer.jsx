import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useSession } from '@clerk/clerk-react';

// Create action
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

export const getBoard = createAsyncThunk(
  'board/getBoardwithBoardId',
  async (user_id, board_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/boards/${user_id}/board/${board_id}`);
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

export const createBoard = createAsyncThunk(
  'board/createBoard',
  async (formData, thunkAPI) => {
    // console.log(session);

    // const { session } = useSession();

    console.log('create board triggered asffsafs ' + formData.token);

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

export const addColumn = createAsyncThunk(
  'board/addColumn',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

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

export const updateJobStatus = createAsyncThunk(
  'board/updateJobStatus',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log(formData);

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
    selectedStatusToAdd: null
  },
  reducers: {
    // Changing it to object
    handleToggleForm: (state, action) => {
      state.toggleJobForm = action.payload[0];
      state.selectedStatusToAdd = action.payload[1];
    },
    changeSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    changeBoard: (state, action) => {
      state.selectedBoardLoading = true;
      state.selectedBoard = action.payload;
      const board = action.payload;
      const newColObj = {};
      Object.keys(board)
        .filter(key => key.includes('column') && board[key] !== null)
        .forEach((keyName, i) => {
          newColObj[board[keyName]] = [];
        });

      state.selectedBoardStatusCols = newColObj;
      state.selectedBoardLoading = false;
    },
    fillBoardWithJobs: (state, action) => {
      const jobs = action.payload;
      jobs.forEach(job => state.selectedBoardStatusCols[job.status].push(job));
    },
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
    builder.addCase(getAllBoards.fulfilled, (state, action) => {
      state.boards = action.payload;
      state.boardsLoading = false;
      // delete this later. it's just to check if this triggers
      console.log('getAllBoards is triggered');
    });
    builder.addCase(getBoard.fulfilled, (state, action) => {
      console.log(action.payload);
      state.selectedBoard = action.payload;
      // delete this later. it's just to check if this triggers
      console.log('getAllBoards is triggered');
    });
    builder.addCase(createBoard.fulfilled, (state, action) => {
      state.boards = [...state.boards, action.payload];
      console.log('create board triggered');
    });
    // JOBS EXTRA REDUCER
    // call the action here and then action.payload is whatever the returned value from the action (res.data).
    // .fulfilled is if the action is successful, basically
    // builder.addCase(getjobswithBoardId.pending, (state, action) => {
    //   state.jobs = action.payload;
    //   state.jobsLoading = true;
    //   console.log('getjobswithboardID PENDING is triggered');
    // });
    builder.addCase(getjobswithBoardId.fulfilled, (state, action) => {
      // @@@@@@@@ I MIGHT NOT NEED TO KEEP TRACK OF JOBS STATES SINCE IT'S ALREADY IN THE STATUS COLUMN INSIDE BOARD
      // state.jobs = action.payload;
      state.jobsLoading = false;

      const jobs = action.payload;
      const cols = state.selectedBoardStatusCols;
      jobs.forEach(job => state.selectedBoardStatusCols[job.status].push(job));
      console.log('getjobswithboardID is triggered fsafaasffsafs');
    });

    // ADD COLUMN
    builder.addCase(addColumn.fulfilled, (state, action) => {
      state.selectedBoardStatusCols = {
        ...state.selectedBoardStatusCols,
        [action.payload]: []
      };
    });

    // UPDATE JOB STATUS
    builder.addCase(updateJobStatus.fulfilled, (state, action) => {
      // ADD A ALERT OR LOADING BAR FOR UI.. FIGURE OUT A BETTER WAY TO IMPLEMENT THIS LATER ON, FOR NOW, HAVE THE REDUX CHANGE RIGHT AWAY USING THE REDUCER
      // state.selectedBoardStatusCols[action.payload.status].push(action.payload);
      console.log('successfully updated the job status');
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
  handleToggleForm
} = boardSlice.actions;
