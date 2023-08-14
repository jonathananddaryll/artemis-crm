import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getjobswithBoardId,
  getBoard,
  changeBoard,
  filterJob
} from '../../../reducers/BoardReducer';
import { useNavigate } from 'react-router-dom';
import styles from './JobTrackerPage.module.scss';

import { useAuth } from '@clerk/clerk-react';

import KanbanBoard from './KanbanBoard/KanbanBoard';
import AddListForm from './AddListForm/AddListForm';
import NewJobForm from './NewJobForm/NewJobForm';
import SelectedJobModal from './SelectedJobModal/SelectedJobModal';
import BoardHeader from './BoardHeader/BoardHeader';

import Loader from '../../layout/Loader/Loader';

import SearchBar from './SearchBar/SearchBar';

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

  // Once the selectedBoard is loaded and the selectedBoardStatusCols has not been filled with the selectedBoard's column status
  if (
    loadStart1 &&
    selectedBoard !== null &&
    selectedBoardStatusCols === null
  ) {
    dispatch(changeBoard(selectedBoard));
    dispatch(getjobswithBoardId(board_id));
    setLoadStart1(false);
  }

  // Redirects the user when they try to go to board page that they do not own
  const navigate = useNavigate();
  if (selectedBoard !== null && selectedBoard.user_id !== userId) {
    // console.log('redirecting since you do not own the board');
    navigate('/boards');
  }

  // IF THE LOADING STOP WORKING, REVERT TO THIS
  // jobs loading
  // if (
  //   jobsLoading &&
  //   board_id !== null &&
  //   loadStart1 &&
  //   selectedBoardStatusCols === null &&
  //   selectedBoard !== null
  // ) {
  //   // Gets all the job with the selectedBoard Id
  //   dispatch(getjobswithBoardId(board_id));
  //   setLoadStart1(false);
  // }

  // // Once the selectedBoard is loaded and the selectedBoardStatusCols has not been filled with the selectedBoard's column status
  // if (selectedBoard !== null && selectedBoardStatusCols === null) {
  //   dispatch(changeBoard(selectedBoard));
  // }

  return (
    <div className={styles.container}>
      {selectedBoardStatusCols !== null ? (
        <>
          <BoardHeader title={selectedBoard.title} filterJob={filterJob} />
          <div className={styles.kanbanBoardContainer}>
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
          </div>
        </>
      ) : (
        <Loader
          text={'Loading Board'}
          img={loadingInfinity}
          altText={'loading_boards'}
          imageStyle={3}
          textStyle={3}
        />
      )}
    </div>
  );
}
