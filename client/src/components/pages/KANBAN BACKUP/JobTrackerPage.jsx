import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getjobswithBoardId } from '../../../reducers/JobReducer';
import styles from './JobTrackerPage.module.css';

import KanbanBoard from './KanbanBoard';

export default function JobTrackerPage() {
  // this is basically the state in the reducer
  const { jobs, loading } = useSelector(state => ({ ...state.job }));
  const { selectedBoard } = useSelector(state => ({ ...state.board }));
  const { board_id } = useParams();
  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  // get all the jobs
  useEffect(() => {
    dispatch(getjobswithBoardId(board_id));
  }, [board_id]);

  // check the params in the query in the browser. then compare it if it's not the same as the selectedBoard, call the getjobswithboardid.. or just call it everytime on the page load.

  return (
    <>
      {/* <button onClick={() => getJobs()}>getalljobs</button> */}
      <div>
        {jobs.length > 0 && !loading && (
          <div>
            {jobs.map(job => (
              <p>{job.job_title}</p>
            ))}
          </div>
        )}
      </div>
      <div className={styles.container}>
        <KanbanBoard />
      </div>
    </>
  );
}
