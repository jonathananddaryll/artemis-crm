import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import { handleToggleForm, addJob } from '../../../../reducers/BoardReducer';
import Button from '../../../layout/Button/Button';
import styles from './NewJobForm.module.scss';

import { motion, AnimatePresence } from 'framer-motion';

export default function NewJobForm() {
  const { selectedStatusToAdd, selectedBoard } = useSelector(state => ({
    ...state.board
  }));

  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    status: selectedStatusToAdd,
    job_url: '',
    board_id: selectedBoard.id,
    location: '',
    selectedboard_user_id: selectedBoard.user_id
  });

  // Destructure formData
  const {
    company,
    job_title,
    status,
    job_url,
    board_id,
    location,
    selectedboard_user_id
  } = formData;

  const { session } = useSession();
  const dispatch = useDispatch();

  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async e => {
    e.preventDefault();

    const formD = {
      company: company,
      job_title: job_title,
      status: status,
      job_url: job_url,
      board_id: board_id,
      location: location,
      selectedboard_user_id: selectedboard_user_id,
      token: await session.getToken()
    };

    // Clears the form then close it
    const clearedForm = {
      company: '',
      job_title: '',
      status: selectedStatusToAdd,
      job_url: '',
      board_id: selectedBoard.id,
      location: ''
    };

    dispatch(addJob(formD));
    setFormData(clearedForm);
    dispatch(handleToggleForm([false, null]));
  };

  // for modal backdrop motionframer
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const modal = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: { delay: 0.1 }
    }
  };

  // Handles Escape to close the modal
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === 'Escape') {
        dispatch(handleToggleForm([false, null]));
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        className={styles.wrapper}
        variants={backdrop}
        initial='hidden'
        animate='visible'
      >
        <div
          className={styles.outerModal}
          onClick={() => dispatch(handleToggleForm([false, null]))}
        ></div>
        <motion.div
          className={styles.modal}
          variants={modal}
          initial='hidden'
          animate='visible'
        >
          <div className={styles.formHeader}>
            <p className={styles.headerText}>Add New Job</p>
            <button onClick={() => dispatch(handleToggleForm([false, null]))}>
              <i className='bi bi-x-lg'></i>
            </button>
          </div>
          <div className={styles.formContainer}>
            <form onSubmit={e => onSubmitHandler(e)}>
              <div className={styles.formGroup}>
                <label htmlFor='company'>
                  Company<span> *</span>
                </label>
                <input
                  type='text'
                  name='company'
                  id='company'
                  value={company}
                  placeholder='Add company name'
                  onChange={e => onChangeHandler(e)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='job_title'>
                  Job Title<span> *</span>
                </label>
                <input
                  type='text'
                  name='job_title'
                  id='job_title'
                  value={job_title}
                  placeholder='Add a new job name'
                  onChange={e => onChangeHandler(e)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='location'>
                  Location<span> *</span>
                </label>
                <input
                  type='text'
                  name='location'
                  id='location'
                  value={location}
                  placeholder='Add Location'
                  onChange={e => onChangeHandler(e)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='job_url'>Job URL</label>
                <input
                  type='text'
                  name='job_url'
                  id='job_url'
                  value={job_url}
                  placeholder='Add job url'
                  onChange={e => onChangeHandler(e)}
                />
              </div>

              <div className={styles.formFlex}>
                <div className={`${styles.formGroup} ${styles.formGroupFlex}`}>
                  <label htmlFor='status'>Status</label>
                  <input
                    type='text'
                    name='status'
                    id='status'
                    value={status}
                    readOnly
                    required
                  />
                </div>
                {/* IMPLEMENT THIS LATER FOR V2 */}
                {/* <div className={`${styles.formGroup} ${styles.formGroupFlex}`}>
                  <label>Link Contact</label>
                  <input type='text' name='contact' readOnly />
                </div> */}
              </div>
              <div className={styles.buttonsContainer}>
                <Button
                  type={'button'}
                  value={'Cancel'}
                  color={'white'}
                  onClick={() => dispatch(handleToggleForm([false, null]))}
                />
                <Button
                  type={'submit'}
                  value={'Save Job'}
                  color={'blue'}
                  disabled={
                    company === '' || job_title === '' || location === ''
                  }
                />
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
