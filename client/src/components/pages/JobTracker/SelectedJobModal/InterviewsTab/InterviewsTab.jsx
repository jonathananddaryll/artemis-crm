import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import timeSince from '../../../../../helpers/convertDate';
import Button from '../../../../layout/Button/Button';
import { interviewCategories } from '../../../../../data/taskCategories';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noInterviews from '../../../../../assets/nointerviews.svg';
import styles from './InterviewsTab.module.scss';

export default function InteviewTab({
  interviews,
  completedInterviews,
  jobId,
  createTask,
  selectedBoard_userId
}) {
  const [formToggle, setFormToggle] = useState(false);
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

  // onChange Hander
  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      date_completed: is_done === true ? start_date.toLocaleString() : null,
      token: await session.getToken()
    };

    dispatch(createTask(formD));

    // hide the form after creating a new interview
    setFormToggle(false);

    const resetFormData = {
      title: '',
      category: '',
      note: '',
      start_date: new Date(),
      is_done: false
    };

    setFormData(resetFormData);
  }

  return (
    <div className={styles.interviewsTabContainer}>
      {!formToggle ? (
        <div className={styles.buttonsContainer}>
          <Button
            type={'button'}
            value={'Add Interview'}
            color={'blue'}
            size={'small'}
            onClick={() => setFormToggle(true)}
          />
        </div>
      ) : (
        <div className={styles.newTaskForm}>
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
              <label>Interview Category</label>
              <div className={styles.categoriesInput}>
                {interviewCategories.map((task, idx) => (
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
              <label>Interview Date</label>
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
              <label>Note</label>
              <textarea
                name='note'
                placeholder='Enter Note'
                value={note}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formButtonsContainer}>
              <Button
                type={'button'}
                value={'Cancel'}
                color={'white'}
                onClick={() => setFormToggle(false)}
                size={'small'}
              />
              <Button
                type={'submit'}
                value={'Add Interview'}
                color={'blue'}
                size={'small'}
              />
            </div>
          </form>
        </div>
      )}

      {interviews.length === 0 &&
      completedInterviews.length === 0 &&
      !formToggle ? (
        <NoDataPlaceholder
          image={noInterviews}
          header={'NO UPCOMING INTERVIEWS'}
          subHeader={'Here you can add and see upcoming interviews'}
        />
      ) : (
        <>
          {interviews.length > 0 && (
            <div className={styles.interviewBox}>
              <p className={styles.interviewBoxHeaderText}>
                Upcoming Interviews
              </p>
              {interviews.map(interview => (
                <div key={interview.id} className={styles.interviewCard}>
                  <div className={styles.interviewCardFlexLeft}>
                    <p className={styles.titleText}>{interview.title}</p>
                  </div>
                  <div className={styles.interviewCardFlexMiddle}>
                    <p className={styles.categoryText}>{interview.category}</p>
                  </div>
                  <div className={styles.interviewCardFlexRight}>
                    <p className={styles.dateText}>
                      {timeSince(interview.start_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {completedInterviews.length > 0 && (
            <div className={styles.interviewBox}>
              <p className={styles.interviewBoxHeaderText}>
                Completed Interviews
              </p>
              {completedInterviews.map(interview => (
                <div key={interview.id} className={styles.interviewCard}>
                  <div className={styles.interviewCardFlexLeft}>
                    <p className={styles.titleText}>{interview.title}</p>
                  </div>
                  <div className={styles.interviewCardFlexMiddle}>
                    <p className={styles.categoryText}>{interview.category}</p>
                  </div>
                  <div className={styles.interviewCardFlexRight}>
                    <p className={styles.dateText}>
                      {/* {timeSince(interview.start_date)} */}
                      Completed {timeSince(interview.date_completed)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
