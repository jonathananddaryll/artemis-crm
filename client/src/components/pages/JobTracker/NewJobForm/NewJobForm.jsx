import React from 'react';
import styles from './NewJobForm.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { handleToggleForm } from '../../../../reducers/BoardReducer';

export default function NewJobForm() {
  const { selectedBoardStatusCols } = useSelector(state => ({
    ...state.board
  }));
  const dispatch = useDispatch();
  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
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
