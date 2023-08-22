import React, { useState } from 'react';
import styles from './AddListForm.module.scss';
import { useDispatch } from 'react-redux';
import { addColumn } from '../../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';
import Button from '../../../layout/Button/Button';

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
      <div
        className={styles.popupOuter}
        onClick={() => setConfirmationToggle(false)}
      ></div>
      <div className={styles.popupBox}>
        <form onSubmit={e => onSubmit(e)}>
          <input
            className={styles.columnStatusInput}
            type='text'
            name='columnStatus'
            value={columnStatus}
            onChange={e => onChangeHandler(e)}
            required
          />
          <div className={styles.buttonsContainer}>
            <Button
              type={'button'}
              value={'Cancel'}
              color={'white'}
              // size={'small'}
              onClick={() => setAddListToggle(false)}
            />
            <Button
              type={'submit'}
              value={'Add New List'}
              color={'blue'}
              // size={'small'}
            />
          </div>
        </form>
        {/* <button onClick={() => setAddListToggle(false)}>Cancel</button> */}
      </div>
    </div>
  );
}
