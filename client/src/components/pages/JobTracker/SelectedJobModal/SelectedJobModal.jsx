import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  changeSelectedJob,
  deleteJob
} from '../../../../reducers/BoardReducer';
import {
  getAllTimelines,
  resetSelectedJobItems,
  getAllNotes,
  getAllTasks,
  getAllLinkedContactsWithJobId
} from '../../../../reducers/SelectedJobReducer';

import Button from '../../../layout/Button/Button';
import InterviewsTab from './InterviewsTab/InterviewsTab';
import ContactsTab from './ContactsTab/ContactsTab';
import DocumentsTab from './DocumentsTab/DocumentsTab';
import JobInfoTab from './JobInfoTab/JobInfoTab';
import NotesTab from './NotesTab/NotesTab';
import TasksTab from './TasksTab/TasksTab';
import DeletePopup from '../../../layout/DeletePopup/DeletePopup';
import Timeline from './Timeline/Timeline';
import styles from './SelectedJobModal.module.scss';

export default function SelectedJobModal() {
  const { tasks, notes, interviews, linkedContacts } = useSelector(state => ({
    ...state.selectedJob
  }));
  const { selectedJob, selectedBoard } = useSelector(state => ({
    ...state.board
  }));
  const [confirmationToggle, setConfirmationToggle] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const { session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getAllTimelines(selectedJob.id));
    handleEveryGetAll();
  }, [selectedJob.id]);

  const handleEveryGetAll = () => {
    dispatch(getAllTimelines(selectedJob.id));
    dispatch(getAllNotes(selectedJob.id));
    dispatch(getAllTasks(selectedJob.id));
    dispatch(getAllLinkedContactsWithJobId(selectedJob.id));
  };

  // Navigation Items for the subNav inside Selected Job Modal
  const navItems = [
    { name: 'job info', icon: 'bi bi-info-circle' },
    { name: 'notes', icon: 'bi bi-journal', itemL: notes.length },
    { name: 'contacts', icon: 'bi bi-people', itemL: linkedContacts.length },
    { name: 'documents', icon: 'bi bi-file-earmark-text' },
    { name: 'tasks', icon: 'bi bi-list-task', itemL: tasks.length },
    {
      name: 'interview',
      icon: 'bi bi-calendar-check',
      itemL: interviews.length
    }
  ];

  const handleDeleteJob = async () => {
    const formData = {
      jobId: selectedJob.id,
      selectedBoard_id: selectedBoard.id,
      selectedBoard_userId: selectedBoard.user_id,
      token: await session.getToken()
    };

    dispatch(deleteJob(formData));

    // change selectedJob to null and modal off
    dispatch(changeSelectedJob([false, null]));
  };

  // Handles closing the modal
  const handleClosingModal = () => {
    dispatch(resetSelectedJobItems());
    dispatch(changeSelectedJob([false, null]));
  };

  // for modal backdrop motionframer
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const modal = {
    hidden: {
      // y: '-110vh',
      opacity: 0
    },
    visible: {
      opacity: 1,
      // y: '100vh',
      transition: { delay: 0.1 }
    }
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        className={styles.wrapper}
        variants={backdrop}
        initial='hidden'
        animate='visible'
      >
        <div
          className={styles.modalOuter}
          onClick={() => handleClosingModal()}
        ></div>
        <motion.div
          className={styles.modalContainer}
          variants={modal}
          initial='hidden'
          animate='visible'
        >
          <div className={styles.mainContainer}>
            <div className={styles.actionButtonsContainer}>
              <Button
                type={'button'}
                value={'Delete'}
                color={'red'}
                size={'small'}
                onClick={() => setConfirmationToggle(true)}
              />
              <Button
                type={'button'}
                value={'Close'}
                color={'white'}
                size={'small'}
                onClick={() => handleClosingModal()}
              />
            </div>
            <div className={styles.header}>
              <div className={styles.headerLogoContainer}>
                <div className={styles.headerLogo}></div>
              </div>
              <div className={styles.headerInfo}>
                <h2 className={styles.textJobTitle}>{selectedJob.job_title}</h2>
                <div className={styles.headerSub}>
                  <p className={styles.textSub}>
                    <i className='bi bi-building' />
                    {selectedJob.company}
                  </p>

                  <p className={styles.textSub}>
                    <i className='bi bi-geo-alt' />
                    {selectedJob.location}
                  </p>
                  <p className={styles.textSubAdded}>
                    <i className='bi bi-calendar3'></i>
                    Added on {selectedJob.date_added}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.subNavigation}>
              <div className={styles.subNavigationItems}>
                {navItems.map((item, index) => (
                  <div
                    key={index}
                    className={`${styles.subNavigationItem} ${
                      activeItem === index && styles.subNavigationItemActive
                    }`}
                    onClick={() => setActiveItem(index)}
                  >
                    <p className={styles.subNavigationText}>
                      <i className={item.icon}></i>
                      {item.name}

                      {item.itemL > 0 && (
                        <span className={styles.itemCount}>{item.itemL}</span>
                      )}
                    </p>
                    {activeItem === index ? (
                      <motion.div
                        className={styles.underline}
                        layoutId='underline'
                      ></motion.div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            {/* MAIN CONTENT BOX */}
            {activeItem === 0 && (
              <JobInfoTab
                selectedJob={selectedJob}
                selectedBoard_userId={selectedBoard.user_id}
              />
            )}
            {activeItem === 1 && (
              <NotesTab
                selectedBoard_userId={selectedBoard.user_id}
                jobId={selectedJob.id}
              />
            )}
            {activeItem === 2 && <ContactsTab />}
            {activeItem === 3 && <DocumentsTab />}
            {activeItem === 4 && (
              <TasksTab
                selectedBoard_userId={selectedBoard.user_id}
                jobId={selectedJob.id}
              />
            )}
            {activeItem === 5 && (
              <InterviewsTab
                jobId={selectedJob.id}
                selectedBoard_userId={selectedBoard.user_id}
              />
            )}
          </div>
          <div className={styles.timelineContainer}>
            <Timeline dateCreated={selectedJob.date_created} />
          </div>
          {confirmationToggle && (
            <DeletePopup
              handleDelete={handleDeleteJob}
              closePopUp={() => setConfirmationToggle(false)}
              mainText={'Are you sure delete this job?'}
              subText={'This action cannot be undone'}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
