import React, { useState } from 'react';
import styles from './AddListForm.module.css';
import { useDispatch } from 'react-redux';
import { addColumn } from '../../../reducers/BoardReducer';

export default function AddListForm({
  setAddListToggle,
  selectedBoard: { id, total_cols }
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: id,
    totalCols: total_cols,
    columnStatus: ''
  });

  const { columnStatus } = formData;

  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    dispatch(addColumn(formData));
    setAddListToggle(false);

    // CALL THE ACTION REDUCER here
  };

  return (
    <div className={styles.form_wrapper}>
      <p>ADD LIST FORM</p>
      <p>{columnStatus}</p>
      <form onSubmit={e => onSubmit(e)}>
        <input
          type='text'
          name='columnStatus'
          value={columnStatus}
          onChange={e => onChangeHandler(e)}
        />
        <input type='submit' value='Add List' />
      </form>
      <button onClick={() => setAddListToggle(false)}>Cancel</button>
    </div>
  );
}
