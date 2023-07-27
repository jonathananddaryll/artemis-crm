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

import KanbanBoard from './KanbanBoard';
import AddListForm from './AddListForm/AddListForm';
import NewJobForm from './NewJobForm/NewJobForm';
import SelectedJobModal from './SelectedJobModal/SelectedJobModal';

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
  const [loadStart, setLoadStart] = useState(true);
  const [loadStart1, setLoadStart1] = useState(true);

  const { board_id } = useParams();
  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  // get all the jobs
  useEffect(() => {
    if (selectedBoardStatusCols !== null) {
      console.log('yoooooo this triggered just now');
      dispatch(getjobswithBoardId(board_id));
    }
  }, [board_id]);

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
    selectedBoardStatusCols !== null &&
    loadStart1
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
          <KanbanBoard setAddListToggle={setAddListToggle} />
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
