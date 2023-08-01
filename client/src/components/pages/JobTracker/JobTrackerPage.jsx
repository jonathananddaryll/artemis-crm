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

import loadingInfinity from '../../../assets/loadingInfinity.gif';

export default function JobTrackerPage() {
  const {
    selectedBoard,
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
  const dispatch = useDispatch();

  // get all the jobs
  useEffect(() => {
    if (selectedBoardStatusCols !== null && selectedBoard !== null) {
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
    // Gets all the job with the selectedBoard Id
    dispatch(getjobswithBoardId(board_id));
    setLoadStart1(false);
  }

  // Once the selectedBoard is loaded and the selectedBoardStatusCols has not been filled with the selectedBoard's column status
  if (selectedBoard !== null && selectedBoardStatusCols === null) {
    dispatch(changeBoard(selectedBoard));
  }

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
        <div className={styles.loaderContainer}>
          <img
            className={styles.loaderImg}
            src={loadingInfinity}
            alt='loading_boards'
          />
          <p className={styles.loaderText}>Your board is loading</p>
        </div>
      )}
    </div>
  );
}
