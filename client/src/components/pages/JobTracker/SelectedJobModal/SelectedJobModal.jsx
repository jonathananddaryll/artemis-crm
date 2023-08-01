import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import {
  changeSelectedJob,
  deleteJob,
  handleToggleForm
} from '../../../../reducers/BoardReducer';

import {
  getAllTimelines,
  resetSelectedJobItems,
  createNote,
  getAllNotes,
  deleteNote,
  updateNote,
  getAllTasks,
  createTask,
  updateTaskStatus
} from '../../../../reducers/SelectedJobReducer';

import InterviewTab from './InterviewTab/InterviewTab';
import ContactsTab from './ContactsTab/ContactsTab';
import DocumentsTab from './DocumentsTab/DocumentsTab';
import JobInfoTab from './JobInfoTab/JobInfoTab';
import NotesTab from './NotesTab/NotesTab';
import TasksTab from './TasksTab/TasksTab';
import DeletePopup from './DeletePopup/DeletePopup';
import Timeline from './Timeline/Timeline';

import ConfirmationPopUp from '../../../layout/ConfirmationPopup/ConfirmationPopup';

import styles from './SelectedJobModal.module.css';

export default function SelectedJobModal() {
  const dispatch = useDispatch();

  const { selectedJob, selectedBoard } = useSelector(state => ({
    ...state.board
  }));

  const {
    timelines,
    timelinesLoading,
    notes,
    notesLoading,
    tasks,
    completedTasks,
    tasksLoading
  } = useSelector(state => ({
    ...state.selectedJob
  }));

  useEffect(() => {
    // dispatch(getAllTimelines(selectedJob.id));
    handleEveryGetAll();
  }, [selectedJob.id]);

  const handleEveryGetAll = () => {
    dispatch(getAllTimelines(selectedJob.id));
    dispatch(getAllNotes(selectedJob.id));
    dispatch(getAllTasks(selectedJob.id));
  };

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

  const handleClosingModal = () => {
    dispatch(resetSelectedJobItems());
    dispatch(changeSelectedJob([false, null]));
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.modalOuter}
        onClick={() => handleClosingModal()}
      ></div>
      <div className={styles.modalContainer}>
        <div className={styles.mainContainer}>
          <div className={styles.actionButtonsContainer}>
            <button onClick={() => setConfirmationToggle(true)}>Delete</button>
            <button onClick={() => handleClosingModal()}>Close</button>
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
            <div className={styles.subNavigationItems}>
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className={
                    styles.subNavigationItem +
                    ' ' +
                    (activeItem === index && styles.subNavigationItemActive)
                  }
                  onClick={() => setActiveItem(index)}
                >
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
          {/* MAIN CONTENT BOX */}
          {activeItem === 0 && <JobInfoTab selectedJob={selectedJob} />}
          {activeItem === 1 && (
            <NotesTab
              createNote={createNote}
              selectedBoard_userId={selectedBoard.user_id}
              jobId={selectedJob.id}
              notes={notes}
              notesLoading={notesLoading}
              deleteNote={deleteNote}
              updateNote={updateNote}
            />
          )}
          {activeItem === 2 && <ContactsTab />}
          {activeItem === 3 && <DocumentsTab />}
          {activeItem === 4 && (
            <TasksTab
              tasks={tasks}
              completedTasks={completedTasks}
              tasksLoading={tasksLoading}
              createTask={createTask}
              selectedBoard_userId={selectedBoard.user_id}
              jobId={selectedJob.id}
              updateTaskStatus={updateTaskStatus}
            />
          )}
          {activeItem === 5 && <InterviewTab />}
        </div>
        <div className={styles.timelineContainer}>
          <Timeline
            timelines={timelines}
            timelinesLoading={timelinesLoading}
            dateCreated={selectedJob.date_created}
          />
        </div>
        {confirmationToggle && (
          <DeletePopup
            handleDeleteJob={handleDeleteJob}
            setConfirmationToggle={setConfirmationToggle}
          />
          // <ConfirmationPopUp
          //   popUpText={'Are you sure you want to delete this job?'}
          //   handleDelete={handleDeleteJob}
          //   cancelDelete={setConfirmationToggle}
          // />
        )}
      </div>
    </div>
  );
}
