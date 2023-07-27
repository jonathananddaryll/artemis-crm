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
  //   rate_of_pay: '',
  //   main_contact: '',
  //   selectedboard_user_id: selectedBoard.user_id
  // });

  const [formData, setFormData] = useState({
    company: 'google',
    job_title: 'software engineer',
    status: selectedStatusToAdd,
    job_url: '',
    board_id: selectedBoard.id,
    location: 'remote',
    rate_of_pay: '',
    main_contact: '',
    selectedboard_user_id: selectedBoard.user_id
  });

  const {
    company,
    job_title,
    status,
    job_url,
    board_id,
    location,
    rate_of_pay,
    main_contact,
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
      location: '',
      rate_of_pay: '',
      main_contact: ''
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
      <div className={styles.modal}>
        <form onSubmit={e => onSubmitHandler(e)}>
          <div className={styles.formGroup}>
            <label>Company</label>
            <input
              type='text'
              name='company'
              value={company}
              onChange={e => onChangeHandler(e)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Job Title</label>
            <input
              type='text'
              name='job_title'
              value={job_title}
              onChange={e => onChangeHandler(e)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Location</label>
            <input
              type='text'
              name='location'
              value={location}
              onChange={e => onChangeHandler(e)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Job URL</label>
            <input
              type='text'
              name='job_url'
              value={job_url}
              onChange={e => onChangeHandler(e)}
            />
          </div>
          {/* ADD a dropdown for main contact later  */}
          <div className={styles.formFlex}>
            <div className={styles.formGroup}>
              {/* HAVE THE BOARD NAME AS THE LABEL BUT VALUE WILL BE BOARD_ID*/}
              <label>Board</label>
              <input type='text' name='board_id' value={board_id} readonly />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <input
                type='text'
                name='status'
                value={status}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <input type='submit' value='Save Job' />
          </div>
        </form>

        <button onClick={() => dispatch(handleToggleForm([false, null]))}>
          CANCEL NEW JOB FORM
        </button>
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
