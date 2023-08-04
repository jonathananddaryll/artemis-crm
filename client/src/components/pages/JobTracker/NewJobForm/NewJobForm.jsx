import React, { useState } from 'react';
import styles from './NewJobForm.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';

import { handleToggleForm, addJob } from '../../../../reducers/BoardReducer';

export default function NewJobForm() {
  const { selectedBoardStatusCols, selectedStatusToAdd, selectedBoard } =
    useSelector(state => ({
      ...state.board
    }));

  // const [formData, setFormData] = useState({
  //   company: '',
  //   job_title: '',
  //   status: selectedStatusToAdd,
  //   job_url: '',
  //   board_id: selectedBoard.id,
  //   location: '',
  //   selectedboard_user_id: selectedBoard.user_id
  // });

  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    status: selectedStatusToAdd,
    job_url: '',
    board_id: selectedBoard.id,
    location: '',
    selectedboard_user_id: selectedBoard.user_id
  });

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

  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  async function onSubmitHandler(e) {
    e.preventDefault();

    // dispatch(createBoard(title));

    // const token = await session.getToken();

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
    // console.log(foformDrmData);
    // console.log(token);

    setFormData(clearedForm);
    dispatch(handleToggleForm([false, null]));
  }

  const dispatch = useDispatch();
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.outerModal}
        onClick={() => dispatch(handleToggleForm([false, null]))}
      ></div>
      <div className={styles.modal}>
        <div className={styles.formHeader}>
          <p>Add Job</p>
          <button onClick={() => dispatch(handleToggleForm([false, null]))}>
            X
          </button>
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={e => onSubmitHandler(e)}>
            <div className={styles.formGroup}>
              <label>Company</label>
              <input
                type='text'
                name='company'
                value={company}
                placeholder='Add company name'
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Job Title</label>
              <input
                type='text'
                name='job_title'
                value={job_title}
                placeholder='Add a new job name'
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                type='text'
                name='location'
                value={location}
                placeholder='Add Location'
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Job URL</label>
              <input
                type='text'
                name='job_url'
                value={job_url}
                placeholder='Add job url'
                onChange={e => onChangeHandler(e)}
              />
            </div>

            <div className={styles.formFlex}>
              <div className={`${styles.formGroup} ${styles.formGroupFlex}`}>
                <label>Status</label>
                <input type='text' name='status' value={status} readonly />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFlex}`}>
                <label>Link Contact</label>
                <input type='text' name='contact' readonly />
              </div>
            </div>
            <div className={styles.buttonsContainer}>
              <input className={styles.button} type='submit' value='Save Job' />
              <input
                className={styles.button}
                type='button'
                value='Cancel'
                onClick={() => dispatch(handleToggleForm([false, null]))}
              />
            </div>
            {/* <button onClick={() => dispatch(handleToggleForm([false, null]))}>
                CANCEL NEW JOB FORM
              </button> */}
          </form>
        </div>
      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import styles from './AddListForm.module.css';
// import { useDispatch } from 'react-redux';
// import { addColumn } from '../../../reducers/BoardReducer';

// export default function AddListForm({
//   setAddListToggle,
//   selectedBoard: { id, total_cols }
// }) {
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     id: id,
//     totalCols: total_cols,
//     columnStatus: ''
//   });

//   const { columnStatus } = formData;

//   const onChangeHandler = e =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = e => {
//     e.preventDefault();

//     dispatch(addColumn(formData));
//     setAddListToggle(false);

//     // CALL THE ACTION REDUCER here
//   };

//   return (
//     <div className={styles.form_wrapper}>
//       <p>ADD LIST FORM</p>
//       <p>{columnStatus}</p>
//       <form onSubmit={e => onSubmit(e)}>
//         <input
//           type='text'
//           name='columnStatus'
//           value={columnStatus}
//           onChange={e => onChangeHandler(e)}
//         />
//         <input type='submit' value='Add List' />
//       </form>
//       <button onClick={() => setAddListToggle(false)}>Cancel</button>
//     </div>
//   );
// }
