import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import {
  changeSelectedJob,
  deleteJob,
  handleToggleForm
} from '../../../../reducers/BoardReducer';

import styles from './SelectedJobModal.module.css';

export default function SelectedJobModal() {
  const dispatch = useDispatch();
  const { selectedJob, selectedBoard } = useSelector(state => ({
    ...state.board
  }));

  const [confirmationToggle, setConfirmationToggle] = useState(false);

  const { session } = useSession();

  async function handleDeleteJob() {
    const formData = {
      jobId: selectedJob.id,
      selectedBoard_id: selectedBoard.id,
      selectedBoard_userId: selectedBoard.user_id,
      token: await session.getToken()
    };

    dispatch(deleteJob(formData));

    // change selectedJob to null and modal off
    dispatch(changeSelectedJob([false, null]));
  }

  return (
    <>
      <div
        className={styles.wrapper}
        onClick={() => dispatch(changeSelectedJob([false, null]))}
      >
        {' '}
      </div>
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
        {!confirmationToggle ? (
          <button onClick={() => setConfirmationToggle(true)}>
            Delete Job
          </button>
        ) : (
          <div>
            <p>Are you sure you want to delete this job?</p>
            <button onClick={() => handleDeleteJob()}>Yes</button>
            <button onClick={() => setConfirmationToggle(false)}>No</button>
          </div>
        )}
        <button onClick={() => dispatch(changeSelectedJob([false, null]))}>
          Cancel
        </button>
      </div>
    </>
  );
}
