import React, { useState } from 'react';
import styles from './TasksTab.module.css';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';

import timeSince from '../../../../../helpers/convertDate';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { taskCategories } from '../../../../../data/taskCategories';

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

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    note: '',
    start_date: new Date(),
    is_done: false
  });

  const timestamp = { seconds: 1627282008, nanoseconds: 285000000 };

  // Deconstruct formData
  const { title, category, note, start_date, is_done } = formData;

  const dispatch = useDispatch();
  const { session } = useSession();

  // onChange Hander
  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // const handleDateChange = d => {
  //   setFormData({ ...formData, start_date: d });
  //   console.log(d);
  // };

  // Submit handler
  async function onSubmitHandler(e) {
    e.preventDefault();

    const formD = {
      title: title,
      category: category,
      note: note,
      start_date: start_date.toLocaleString(),
      is_done: is_done,
      selectedboard_user_id: selectedBoard_userId,
      jobId: jobId,
      token: await session.getToken()
    };

    dispatch(createTask(formD));

    // Clears the noteText then close it
    setNameText('');

    // hide the form after creating a note
    setToggleForm(false);

    const resetFormData = {
      title: '',
      category: '',
      note: '',
      start_date: new Date(),
      is_done: false
    };

    setFormData(resetFormData);
  }

  // Submit handler for updating status of the task
  async function onUpdateStatusHandler(task) {
    const formD = {
      status: !task.is_done,
      taskId: task.id,
      selectedboard_user_id: selectedBoard_userId,
      jobId: jobId,
      date_completed:
        task.is_done === false
          ? new Date().toLocaleString('en-US', {
              timeZone: 'America/Los_Angeles'
            })
          : null,
      token: await session.getToken()
    };

    dispatch(updateTaskStatus(formD));
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
            Create Task
          </button>
        </div>
      ) : (
        <div className={styles.newTaskForm}>
          <div className={styles.formHeader}>
            <p>Create New Task</p>
          </div>
          <form onSubmit={e => onSubmitHandler(e)}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type='text'
                name='title'
                placeholder={category !== '' ? category : 'Enter Title'}
                value={title}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Category</label>
              {/* <input
                type='text'
                name='category'
                placeholder='Enter Category'
                value={category}
                onChange={e => onChangeHandler(e)}
              /> */}
              <div className={styles.categoriesInput}>
                {taskCategories.map((task, idx) => (
                  <p
                    key={idx}
                    className={category === task && styles.selectedCategory}
                    onClick={() => setFormData({ ...formData, category: task })}
                  >
                    {task}
                  </p>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>
                {category.includes('e Interview') || category.includes('Screen')
                  ? 'Interview Date'
                  : 'Finish Task By'}
              </label>
              <DatePicker
                selected={start_date}
                onChange={date =>
                  setFormData({ ...formData, start_date: date })
                }
                showTimeSelect
                dateFormat='MMMM d, yyyy h:mm aa'
              />
            </div>
            <div className={styles.formGroup}>
              <label>Note</label>

              <textarea
                name='note'
                placeholder='Enter Note'
                value={note}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mark as completed</label>
            </div>

            <input type='submit' value='save' />
            <button onClick={() => setToggleForm(false)}>Cancel</button>
          </form>
        </div>
      )}
      <div className={styles.tasksContentContainer}>
        {tasks.length === 0 && completedTasks.length === 0 ? (
          <p>NO TASKS MAKE THIS PRETTIER LATER</p>
        ) : (
          <>
            {tasks.length > 0 && (
              <div className={styles.tasksBox}>
                <p>Tasks Todo</p>
                {tasks.map(task => (
                  <div key={task.id} className={styles.taskCard}>
                    <p className={styles.taskText}>
                      <i
                        onClick={() => onUpdateStatusHandler(task)}
                        className='bi bi-square'
                      ></i>
                      {task.title}
                    </p>
                    <p className={styles.categoryText}>{task.category}</p>
                    <p>Due {timeSince(task.start_date)}</p>
                  </div>
                ))}
              </div>
            )}
            {completedTasks.length > 0 && (
              <div className={styles.completedTasksBox}>
                <p>Completed Tasks</p>
                {completedTasks.map(task => (
                  <div key={task.id} className={styles.taskCard}>
                    <p className={styles.completedTaskText}>
                      <i
                        className='bi bi-check-square'
                        onClick={() => onUpdateStatusHandler(task)}
                      ></i>
                      {task.title}
                    </p>
                    <p>Completed {timeSince(task.date_completed)}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
