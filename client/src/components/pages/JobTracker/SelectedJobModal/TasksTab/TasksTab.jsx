import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  createTask,
  updateTaskStatus,
  deleteTask,
  updateTask
} from '../../../../../reducers/SelectedJobReducer';

import timeSince from '../../../../../helpers/convertDate';
import Button from '../../../../layout/Button/Button';
import DeletePopup from '../../../../layout/DeletePopup/DeletePopup';
import { taskCategories } from '../../../../../data/taskCategories';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noTasks from '../../../../../assets/notasks.svg';
import styles from './TasksTab.module.scss';

export default function TasksTab({ selectedBoard_userId, jobId }) {
  const { tasks, completedTasks } = useSelector(state => ({
    ...state.selectedJob
  }));
  const [formToggle, setFormToggle] = useState(false);
  const [confirmationToggle, setConfirmationToggle] = useState(false);
  const [selectedTask, setSelectedTask] = useState({
    isActive: false,
    taskId: null,
    taskTitle: null
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    note: '',
    start_date: new Date(),
    is_done: false
  });

  // Deconstruct formData
  const { title, category, note, start_date, is_done } = formData;

  const dispatch = useDispatch();
  const { session } = useSession();

  // Open Create Form Handler for the 'Create Task' button
  const openCreateForm = () => {
    setFormToggle(true);
    setSelectedTask({
      isActive: false,
      taskId: null,
      taskTitle: null
    });
  };

  // Fills the form with the info from task being updated
  const onEditHandler = task => {
    const updateFormData = {
      title: task.title,
      category: task.category,
      start_date: new Date(task.start_date),
      note: task.note,
      is_done: task.is_done
    };

    // Update Form Data
    setFormData(updateFormData);

    setIsUpdate(true);
    setFormToggle(true);
  };

  // Cancels the edit/create form
  const onCancelFormHandler = () => {
    const resetFormData = {
      title: '',
      category: '',
      note: '',
      start_date: new Date(),
      is_done: false
    };

    setFormData(resetFormData);
    setIsUpdate(false);
    setFormToggle(false);
  };

  // onChange Hander
  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit handler
  const onSubmitHandler = async e => {
    e.preventDefault();

    // Need to change this naming (every formData needs to be uniformed)
    const formD = {
      title: title,
      category: category,
      note: note,
      start_date: start_date.toLocaleString(),
      is_done: is_done,
      selectedboard_user_id: selectedBoard_userId,
      jobId: jobId,
      date_completed: is_done === true ? start_date.toLocaleString() : null,
      token: await session.getToken(),
      taskId: selectedTask.taskId
    };

    if (!isUpdate) {
      dispatch(createTask(formD));
    } else {
      //add dispatch here for update
      dispatch(updateTask(formD));
    }

    // hide the form after creating a new task
    setFormToggle(false);

    // Resets formData ----> maybe create a object that I can import to set the
    // resetFormData or create the resetFormData on top so I can just reuse it,
    // since I've reset formData twice(for successful create/update and for canceling the form)
    const resetFormData = {
      title: '',
      category: '',
      note: '',
      start_date: new Date(),
      is_done: false
    };

    setFormData(resetFormData);
    setIsUpdate(false);
  };

  // Submit handler for updating status of the task
  const onUpdateStatusHandler = async task => {
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
  };

  // Delete Task
  const handleDeleteTask = async (taskId, taskTitle) => {
    const formData = {
      jobId: jobId,
      selectedboard_user_id: selectedBoard_userId,
      taskId: taskId,
      taskTitle: taskTitle,
      token: await session.getToken()
    };

    dispatch(deleteTask(formData));

    // Resets the setSelectedTask and toggles off the confirmation pop up
    setSelectedTask({ isActive: false, taskId: null });
    setConfirmationToggle(false);
  };

  return (
    <div className={styles.tasksTabContainer}>
      {!formToggle ? (
        <div className={styles.buttonsContainer}>
          <Button
            type={'button'}
            value={'Create Task'}
            color={'blue'}
            // onClick={() => setFormToggle(true)}
            onClick={() => openCreateForm()}
            size={'small'}
          />
        </div>
      ) : (
        <div className={styles.newTaskForm}>
          <form onSubmit={e => onSubmitHandler(e)}>
            <div className={styles.formGroup}>
              <label htmlFor='title'>Title</label>
              <input
                type='text'
                name='title'
                id='title'
                placeholder={category !== '' ? category : 'Enter Title'}
                value={title}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='category'>Category</label>
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
              <label htmlFor='categorytype'>
                {category.includes('e Interview') || category.includes('Screen')
                  ? 'Interview Date'
                  : 'Finish Task By'}
              </label>
              <DatePicker
                className={styles.datePicker}
                selected={start_date}
                onChange={date =>
                  setFormData({ ...formData, start_date: date })
                }
                showTimeSelect
                dateFormat='MMMM d, yyyy h:mm aa'
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='note'>Note</label>

              <textarea
                name='note'
                id='note'
                placeholder='Enter Note'
                value={note}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.checkInput}>
                {is_done ? (
                  <i
                    className='bi bi-check-square'
                    onClick={() => setFormData({ ...formData, is_done: false })}
                  ></i>
                ) : (
                  <i
                    className='bi bi-square'
                    onClick={() => setFormData({ ...formData, is_done: true })}
                  ></i>
                )}
                <label htmlFor='current_status'>Mark as completed</label>
              </div>
            </div>
            <div className={styles.formButtonsContainer}>
              <Button
                type={'button'}
                value={'Cancel'}
                color={'white'}
                onClick={() => onCancelFormHandler()}
                size={'small'}
              />
              <Button
                type={'submit'}
                value={isUpdate ? 'Update Task' : 'Create Task'}
                color={'blue'}
                size={'small'}
                disabled={title === '' || category === '' || note === ''}
              />
            </div>
          </form>
        </div>
      )}
      <div className={styles.tasksContentContainer}>
        {tasks.length === 0 && completedTasks.length === 0 && !formToggle ? (
          <NoDataPlaceholder
            image={noTasks}
            header={'NO ACTIVITIES'}
            subHeader={'Here you can create tasks'}
          />
        ) : (
          <>
            {tasks.length > 0 && (
              <div className={styles.tasksBox}>
                <p className={styles.taskBoxHeaderText}>Tasks Todo</p>
                {tasks.map(task => (
                  <div key={task.id} className={styles.taskCard}>
                    <i
                      onClick={() => onUpdateStatusHandler(task)}
                      className='bi bi-square'
                    ></i>
                    <div
                      className={styles.taskCardInfo}
                      onClick={() =>
                        setSelectedTask({
                          isActive: true,
                          taskId: task.id,
                          taskTitle: task.title
                        })
                      }
                    >
                      <div className={styles.taskCardFlexLeft}>
                        <p className={styles.taskText}>{task.title}</p>
                      </div>
                      <div className={styles.taskCardFlexMiddle}>
                        <p className={styles.categoryText}>{task.category}</p>
                      </div>
                      <div className={styles.taskCardFlexRight}>
                        <p className={styles.dueText}>
                          Due {timeSince(task.start_date)}
                        </p>
                      </div>
                    </div>
                    {selectedTask.isActive === true &&
                      selectedTask.taskId === task.id && (
                        <div className={styles.taskCardFlexBottom}>
                          <p>{task.note}</p>
                          <div className={styles.taskCardButtons}>
                            <Button
                              type={'button'}
                              value={'Close'}
                              color={'white'}
                              size={'xsmall'}
                              onClick={() =>
                                setSelectedTask({
                                  isActive: false,
                                  taskId: null,
                                  taskTitle: null
                                })
                              }
                            />
                            <Button
                              type={'button'}
                              value={'Edit Task'}
                              color={'green'}
                              size={'xsmall'}
                              onClick={() => onEditHandler(task)}
                            />
                            <Button
                              type={'button'}
                              value={'Delete Task'}
                              color={'red'}
                              size={'xsmall'}
                              onClick={() => setConfirmationToggle(true)}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
            {completedTasks.length > 0 && (
              <div className={styles.completedTasksBox}>
                <p className={styles.taskBoxHeaderText}>Completed Tasks</p>
                {completedTasks.map(task => (
                  <div key={task.id} className={styles.taskCard}>
                    <i
                      className='bi bi-check-square'
                      onClick={() => onUpdateStatusHandler(task)}
                    ></i>
                    <div
                      className={styles.taskCardInfo}
                      onClick={() =>
                        setSelectedTask({
                          isActive: true,
                          taskId: task.id,
                          taskTitle: task.title
                        })
                      }
                    >
                      <div className={styles.taskCardFlexLeft}>
                        <p className={styles.completedTaskText}>{task.title}</p>
                      </div>
                      <div className={styles.taskCardFlexMiddle}>
                        <p className={styles.categoryText}>{task.category}</p>
                      </div>
                      <div className={styles.taskCardFlexRight}>
                        <p className={styles.dueText}>
                          Completed {timeSince(task.date_completed)}
                        </p>
                      </div>
                    </div>
                    {selectedTask.isActive === true &&
                      selectedTask.taskId === task.id && (
                        <div className={styles.taskCardFlexBottom}>
                          {/* <p>afsasfafsa</p> */}
                          <div className={styles.taskCardButtons}>
                            <Button
                              type={'button'}
                              value={'Close'}
                              color={'white'}
                              size={'xsmall'}
                              onClick={() =>
                                setSelectedTask({
                                  isActive: false,
                                  taskId: null,
                                  taskTitle: null
                                })
                              }
                            />
                            <Button
                              type={'button'}
                              value={'Edit Task'}
                              color={'green'}
                              size={'xsmall'}
                              onClick={() => onEditHandler(task)}
                            />
                            <Button
                              type={'button'}
                              value={'Delete Task'}
                              color={'red'}
                              size={'xsmall'}
                              onClick={() => setConfirmationToggle(true)}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {/* Pop up Modal for Delete Confirmation */}
      {confirmationToggle && (
        <DeletePopup
          handleDelete={() =>
            handleDeleteTask(selectedTask.taskId, selectedTask.taskTitle)
          }
          closePopUp={() => setConfirmationToggle(false)}
          mainText={'Are you sure delete this task?'}
          subText={'This action cannot be undone'}
        />
      )}
    </div>
  );
}
