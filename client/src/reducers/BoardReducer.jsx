import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

// @TODO:
// 1. create a getSelectedBoard with Id that calls the in api with the id. usually dont do this unless the page is refreshed
const boardSlice = createSlice({
  name: 'board',
  initialState: {
    boards: [],
    selectedBoard: null,
    selectedBoardStatusCols: [],
    loading: true
  },
  reducers: {
    changeBoard: (state, action) => {
      state.selectedBoard = action.payload;
      const board = action.payload;
      const newColumns = [];
      Object.keys(board)
        .filter(key => key.includes('column') && board[key] !== null)
        .forEach((keyName, i) => {
          newColumns.push(board[keyName]);
        });

      state.selectedBoardStatusCols = newColumns;
      // Object.keys(selectedBoard)
      //   .filter(key => key.includes('column') && selectedBoard[key] !== null)
      //   .map((keyName, i) => (
      //     <Column title={selectedBoard[keyName]} jobs={applied} id={i} />
      //   ));
    }
  },

  extraReducers: builder => {
    // call the action here and then action.payload is whatever the returned value from the action (res.data).
    // .fulfilled is if the action is successful, basically
    builder.addCase(getAllBoards.fulfilled, (state, action) => {
      state.boards = action.payload;
      state.loading = false;
      // delete this later. it's just to check if this triggers
      console.log('getAllBoards is triggered');
    });
  }
});

export default boardSlice.reducer;
export const { changeBoard } = boardSlice.actions;
