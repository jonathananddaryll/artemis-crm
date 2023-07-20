import React, { useState } from 'react';
import styles from './SelectedJobModal.module.css';

import { useDispatch, useSelector } from 'react-redux';

import { changeSelectedJob } from '../../../../reducers/BoardReducer';

export default function SelectedJobModal() {
  const dispatch = useDispatch();
  const { selectedJob } = useSelector(state => ({
    ...state.board
  }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
        {selectedJob !== null ? (
          <div>
            <p>{selectedJob.job_title}</p>
            <p>{selectedJob.company}</p>
          </div>
        ) : (
          // might not even need this since the selected job is passed to the reducer onClick
          <p>Job is loading</p>
        )}
        <button onClick={() => dispatch(changeSelectedJob([false, null]))}>
          Cancel
        </button>
      </div>
    </div>
  );
}
