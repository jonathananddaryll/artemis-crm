import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getjobswithBoardId } from '../../../reducers/BoardReducer';
import styles from './JobTrackerPage.module.css';

import KanbanBoard from './KanbanBoard';
import AddListForm from './AddListForm';

export default function JobTrackerPage() {
  // this is basically the state in the reducer
  const { selectedBoard, jobs, jobsLoading, selectedBoardStatusCols } =
    useSelector(state => ({
      ...state.board
    }));

  // toggle for the Add List form
  const [addListToggle, setAddListToggle] = useState(false);

  const { board_id } = useParams();
  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  // get all the jobs
  useEffect(() => {
    dispatch(getjobswithBoardId(board_id));
  }, [board_id]);

  // if (jobsLoading && board_id !== null && selectedBoard === null) {
  //   dispatch(getjobswithBoardId(board_id));
  // }

  // check the params in the query in the browser. then compare it if it's not the same as the selectedBoard, call the getjobswithboardid.. or just call it everytime on the page load.

  return (
    <div className={styles.container}>
      {selectedBoardStatusCols !== null && (
        <>
          <KanbanBoard setAddListToggle={setAddListToggle} />
          {addListToggle && (
            <AddListForm
              setAddListToggle={setAddListToggle}
              selectedBoard={selectedBoard}
            />
          )}
        </>
      )}
    </div>
  );
}
