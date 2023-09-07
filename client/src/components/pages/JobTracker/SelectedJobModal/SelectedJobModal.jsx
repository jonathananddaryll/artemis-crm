import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import {
  changeSelectedJob,
  deleteJob,
  updateJobInfo
} from '../../../../reducers/BoardReducer';

import Button from '../../../layout/Button/Button';

import {
  getAllTimelines,
  resetSelectedJobItems,
  createNote,
  getAllNotes,
  deleteNote,
  updateNote,
  getAllTasks,
  createTask,
  updateTaskStatus,
  deleteTask
} from '../../../../reducers/SelectedJobReducer';

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
    tasksLoading,
    interviews,
    completedInterviews
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
    { name: 'job info', icon: 'bi bi-info-circle' },
    { name: 'notes', icon: 'bi bi-journal', itemL: notes.length },
    { name: 'contacts', icon: 'bi bi-people' },
    { name: 'documents', icon: 'bi bi-file-earmark-text' },
    { name: 'tasks', icon: 'bi bi-list-task', itemL: tasks.length },
    {
      name: 'interview',
      icon: 'bi bi-calendar-check',
      itemL: interviews.length
    }
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
            {/* <button onClick={() => setConfirmationToggle(true)}>Delete</button> */}
            {/* <button onClick={() => handleClosingModal()}>Close</button> */}
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
            <div className={styles.headerLogo}></div>
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
                  className={
                    styles.subNavigationItem +
                    ' ' +
                    (activeItem === index && styles.subNavigationItemActive)
                  }
                  onClick={() => setActiveItem(index)}
                >
                  <p className={styles.subNavigationText}>
                    <i className={item.icon}></i>
                    {item.name}

                    {item.itemL > 0 && (
                      <span className={styles.itemCount}>{item.itemL}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* MAIN CONTENT BOX */}
          {activeItem === 0 && (
            <JobInfoTab
              selectedJob={selectedJob}
              selectedBoard_userId={selectedBoard.user_id}
              updateJobInfo={updateJobInfo}
              jobId={selectedJob.id}
            />
          )}
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
              deleteTask={deleteTask}
            />
          )}
          {activeItem === 5 && (
            <InterviewsTab
              interviews={interviews}
              completedInterviews={completedInterviews}
              createTask={createTask}
              jobId={selectedJob.id}
              selectedBoard_userId={selectedBoard.user_id}
            />
          )}
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
            handleDelete={handleDeleteJob}
            closePopUp={() => setConfirmationToggle(false)}
            mainText={'Are you sure you want to delete this job?'}
            subText={
              'This will delete this job permanently. You cannot undo this action'
            }
          />
        )}
      </div>
    </div>
  );
}
