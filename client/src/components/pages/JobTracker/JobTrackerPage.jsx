import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getJobs } from '../../../reducers/JobReducer';
import styles from './JobTrackerPage.module.css';

import KanbanBoard from './KanbanBoard';

export default function JobTrackerPage() {
  // Delete this later

  const { jobs } = useSelector(state => ({ ...state.job }));
  const dispatch = useDispatch();
  return (
    <>
      <button onClick={() => getJobs()}>getalljobs</button>
      <div>
        {jobs.length > 0 && (
          <div>
            {jobs.map(job => (
              <p>{job.title}</p>
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
