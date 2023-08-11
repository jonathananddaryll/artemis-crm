import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBoard } from '../../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';

import styles from './UpdateForm.module.css';

export default function NewBoardForm({ toggleHandler }) {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const { session } = useSession();

  async function onSubmitHandler(e) {
    e.preventDefault();

    const formData = {
      title: title,
      token: await session.getToken()
    };

    dispatch(createBoard(formData));

    // console.log(formData);

    // Clears the form then close it
    setTitle('');
    toggleHandler();
  }

  return (
    <div className={styles.updateFormContainer}>
      <div className={styles.updateForm}>
        <form onSubmit={e => onSubmitHandler(e)}>
          <input
            type='text'
            value={title}
            name='title'
            placeholder='New Board Name'
            onChange={e => setTitle(e.target.value)}
            required
          />
          <div className={styles.formButtons}>
            <input
              type='submit'
              value='Create'
              className={styles.updateBoardButton}
            />
            <input
              type='button'
              value='Cancel'
              onClick={() => toggleHandler()}
              className={styles.updateBoardButton}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
