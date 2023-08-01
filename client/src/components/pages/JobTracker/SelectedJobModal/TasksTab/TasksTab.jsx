import React, { useState } from 'react';
import styles from './TasksTab.module.css';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';

export default function TasksTab({
  tasksLoading,
  tasks,
  completedTasks,
  createTask,
  selectedBoard_userId,
  jobId,
  updateTaskStatus
}) {
  const [toggleForm, setToggleForm] = useState(false);
  const [nameText, setNameText] = useState('');

  const dispatch = useDispatch();
  const { session } = useSession();

  // Submit handler
  async function onSubmitHandler(e) {
    e.preventDefault();

    const formData = {
      name: nameText,
      selectedboard_user_id: selectedBoard_userId,
      jobId: jobId,
      token: await session.getToken()
    };

    dispatch(createTask(formData));

    // Clears the noteText then close it
    setNameText('');

    // hide the form after creating a note
    setToggleForm(false);
  }

  // Submit handler
  async function onUpdateStatusHandler(task) {
    const formData = {
      status: !task.is_done,
      taskId: task.id,
      selectedboard_user_id: selectedBoard_userId,
      jobId: jobId,
      token: await session.getToken()
    };

    dispatch(updateTaskStatus(formData));
  }

  // Cancels the edit/create form
  const onCancelFormHandler = () => {
    setNameText('');
    setToggleForm(false);
  };

  return (
    <div className={styles.tasksTabContainer}>
      {!toggleForm ? (
        <div className={styles.buttonsContainer}>
          <button
            className={styles.createTaskButton}
            onClick={() => setToggleForm(true)}
          >
            Add Task
          </button>
        </div>
      ) : (
        <div className={styles.newTaskForm}>
          <form onSubmit={e => onSubmitHandler(e)}>
            <input
              type='text'
              name='nameText'
              placeholder='Enter a new task'
              value={nameText}
              onChange={e => setNameText(e.target.value)}
            />
            <input type='submit' value='save' />
            <button onClick={() => setToggleForm(false)}>Cancel</button>
          </form>
        </div>
      )}
      <div className={styles.tasksContentContainer}>
        <div className={styles.tasksBox}>
          <p>Tasks List</p>
          {tasks.map(task => (
            <p key={task.id} onClick={() => onUpdateStatusHandler(task)}>
              {task.task_name}
            </p>
          ))}
        </div>
        <div className={styles.completedTasksBox}>
          <p>Completed Tasks</p>
          {completedTasks.map(task => (
            <p key={task.id} onClick={() => onUpdateStatusHandler(task)}>
              {task.task_name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
