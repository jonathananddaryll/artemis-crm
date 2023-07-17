import React, { useState } from 'react';
import styles from './AddListForm.module.css';
import { useDispatch } from 'react-redux';
import { addColumn } from '../../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';

export default function AddListForm({
  setAddListToggle,
  selectedBoard: { id, total_cols, user_id }
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: id,
    totalCols: total_cols,
    columnStatus: '',
    userId: user_id
  });

  const { session } = useSession();

  const { columnStatus } = formData;

  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();

    // IMPORTANT..... MAKE SURE THIS PART OF ADDING TOKEN TO THE FORMDATA IS UNIFORM ACROSS EVERY FORMDATA. FIX THIS LATER, MAKE SURE IT'S CODED BETTER AND CLEANER
    // const token = await session.getToken();
    const formD = formData;
    formD['token'] = await session.getToken();
    console.log(formD);

    dispatch(addColumn(formD));
    setAddListToggle(false);

    // CALL THE ACTION REDUCER here
  }

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
