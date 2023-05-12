import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getjobswithBoardId } from '../../../reducers/JobReducer';
import styles from './JobTrackerPage.module.css';

import KanbanBoard from './KanbanBoard';

export default function JobTrackerPage() {
  // this is basically the state in the reducer
  const { jobs, loading } = useSelector(state => ({ ...state.job }));

  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  // get all the jobs
  useEffect(() => {
    dispatch(getjobswithBoardId());
  }, []);

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
