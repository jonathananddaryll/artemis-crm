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
  const [activeItem, setActiveItem] = useState(0);

  const { session } = useSession();

  const navItems = [
    'job info',
    'notes',
    'contacts',
    'documents',
    'tasks',
    'company'
  ];

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
      ></div>
      <div className={styles.modalContainer}>
        <div className={styles.mainContainer}>
          <div className={styles.actionButtonsContainer}>
            <button onClick={() => setConfirmationToggle(true)}>Delete</button>
            <button onClick={() => dispatch(changeSelectedJob([false, null]))}>
              Close
            </button>
          </div>
          <div className={styles.header}>
            <div className={styles.headerLogo}></div>
            <div className={styles.headerInfo}>
              <h2 className={styles.textJobTitle}>{selectedJob.job_title}</h2>
              <div className={styles.headerSub}>
                <p className={styles.textSub}>{selectedJob.company}</p>
                <p className={styles.textSub}>{selectedJob.location}</p>
              </div>
            </div>
          </div>
          <div className={styles.subNavigation}>
            <ul className={styles.subNavigationItems}>
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className={styles.subNavigationItem}
                  onClick={() => setActiveItem(index)}
                >
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
          {activeItem === 0 && (
            <div className={styles.contentBox}>
              <p>contentbox - jobinfo</p>
            </div>
          )}
          {activeItem === 1 && (
            <div className={styles.contentBox}>
              <p>contentbox - notes</p>
            </div>
          )}
          {activeItem === 2 && (
            <div className={styles.contentBox}>
              <p>contentbox - contacts</p>
            </div>
          )}
          {activeItem === 3 && (
            <div className={styles.contentBox}>
              <p>contentbox - documents</p>
            </div>
          )}
          {activeItem === 4 && (
            <div className={styles.contentBox}>
              <p>contentbox - tasks</p>
            </div>
          )}
          {activeItem === 5 && (
            <div className={styles.contentBox}>
              <p>contentbox - company</p>
            </div>
          )}
        </div>
        <div className={styles.timelineContainer}>TIMELINE</div>
        {/* <div>
          <p>{selectedJob.job_title}</p>
          <p>{selectedJob.company}</p>
        </div> */}

        {/*         
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
        
        */}
      </div>
    </>
  );
}
