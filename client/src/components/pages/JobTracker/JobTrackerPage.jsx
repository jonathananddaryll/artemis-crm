import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import {
  getjobswithBoardId,
  getBoard,
  changeBoard,
  filterJob,
  deleteBoard
} from '../../../reducers/BoardReducer';
import KanbanBoard from './KanbanBoard/KanbanBoard';
import AddListForm from './AddListForm/AddListForm';
import NewJobForm from './NewJobForm/NewJobForm';
import SelectedJobModal from './SelectedJobModal/SelectedJobModal';
import BoardHeader from './BoardHeader/BoardHeader';
import Loader from '../../layout/Loader/Loader';
import loadingInfinity from '../../../assets/loadingInfinity.gif';
import styles from './JobTrackerPage.module.scss';

export default function JobTrackerPage() {
  const {
    selectedBoard,
    toggleJobForm,
    selectedBoardStatusCols,
    toggleSelectedJobModal,
    selectedBoardLoading
  } = useSelector(state => ({
    ...state.board
  }));

  // toggle for the Add List form
  const [addListToggle, setAddListToggle] = useState(false);

  // @TODO: RENAME THESE TWO TO A BETTER NAME LATER ON.. NAME IT SOMETHING THAT MAKE SENSE
  const [loadStart, setLoadStart] = useState(true); // for  board
  const [loadStart1, setLoadStart1] = useState(true); // for jobs
  const { userId } = useAuth();
  const { board_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirects the user when they try to go to board page that they do not own
    if (selectedBoard !== null && selectedBoard.user_id !== userId) {
      navigate('/boards');
    }
  }, [selectedBoard]);

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

  // This will trigger if a user click a board from board page
  if (
    loadStart1 &&
    selectedBoard !== null &&
    selectedBoardStatusCols !== null
  ) {
    dispatch(changeBoard(selectedBoard));
    dispatch(getjobswithBoardId(board_id));
    setLoadStart1(false);
  }

  // Redirects after board deletion
  if (selectedBoard === null && selectedBoardStatusCols === null) {
    navigate('/boards');
  }

  return (
    <div className={styles.container}>
      {selectedBoardStatusCols !== null ? (
        <>
          <BoardHeader
            filterJob={filterJob}
            selectedBoard={selectedBoard}
            deleteBoard={deleteBoard}
          />
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
