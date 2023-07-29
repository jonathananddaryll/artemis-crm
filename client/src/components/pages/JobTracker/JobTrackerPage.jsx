import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getjobswithBoardId,
  getBoard,
  changeBoard
} from '../../../reducers/BoardReducer';
import styles from './JobTrackerPage.module.css';

import { useAuth } from '@clerk/clerk-react';

import KanbanBoard from './KanbanBoard/KanbanBoard';
import AddListForm from './AddListForm/AddListForm';
import NewJobForm from './NewJobForm/NewJobForm';
import SelectedJobModal from './SelectedJobModal/SelectedJobModal';
import BoardHeader from './BoardHeader/BoardHeader';

export default function JobTrackerPage() {
  // this is basically the state in the reducer
  const {
    selectedBoard,
    jobs,
    jobsLoading,
    toggleJobForm,
    selectedBoardStatusCols,
    toggleSelectedJobModal,
    selectedBoardLoading
  } = useSelector(state => ({
    ...state.board
  }));

  const { userId } = useAuth();

  // toggle for the Add List form
  const [addListToggle, setAddListToggle] = useState(false);

  // @TODO: RENAME THESE TWO TO A BETTER NAME LATER ON.. NAME IT SOMETHING THAT MAKE SENSE
  const [loadStart, setLoadStart] = useState(true); // for  board
  const [loadStart1, setLoadStart1] = useState(true); // for jobs

  const { board_id } = useParams();
  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  // get all the jobs
  // DONT NEED THIS SINCE ALL THE LOADING IS DONE BY THE 3 CONDITIONAL STATEMENT BELOW
  useEffect(() => {
    //
    if (selectedBoardStatusCols !== null && selectedBoard !== null) {
      console.log('yoooooo this triggered just now');
      dispatch(getjobswithBoardId(board_id));
    }
  }, []);

  // Board Loading
  if (
    selectedBoardLoading &&
    board_id !== undefined &&
    selectedBoard === null &&
    loadStart
  ) {
    const boardInfo = {
      userId: userId,
      boardId: board_id
    };
    dispatch(getBoard(boardInfo));
    console.log('ayoooooo this hit');
    setLoadStart(false);
  }

  // jobs loading
  if (
    jobsLoading &&
    board_id !== null &&
    loadStart1 &&
    selectedBoardStatusCols === null &&
    selectedBoard !== null
  ) {
    dispatch(getjobswithBoardId(board_id));
    console.log('ayoooooooooooooooo this ssssss hits');
    setLoadStart1(false);
  }

  if (selectedBoard !== null && selectedBoardStatusCols === null) {
    console.log('changeboard load in jobtrackerpage triggered');
    dispatch(changeBoard(selectedBoard));
  }

  // check the params in the query in the browser. then compare it if it's not the same as the selectedBoard, call the getjobswithboardid.. or just call it everytime on the page load.

  return (
    <div className={styles.container}>
      {selectedBoardStatusCols !== null ? (
        <>
          <BoardHeader title={selectedBoard.title} />

          <KanbanBoard
            setAddListToggle={setAddListToggle}
            selectedBoard={selectedBoard}
            selectedBoardStatusCols={selectedBoardStatusCols}
          />
          {addListToggle && (
            <AddListForm
              setAddListToggle={setAddListToggle}
              selectedBoard={selectedBoard}
            />
          )}
          {toggleJobForm && <NewJobForm />}
          {toggleSelectedJobModal && <SelectedJobModal />}
        </>
      ) : (
        <p>BOARD LOADING</p>
      )}
    </div>
  );
}
