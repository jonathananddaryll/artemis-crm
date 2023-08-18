import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBoard } from '../../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';
import Button from '../../../layout/Button/Button';

import styles from './UpdateForm.module.scss';

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
        <form>
          <input
            type='text'
            value={title}
            name='title'
            placeholder='New Board Name'
            onChange={e => setTitle(e.target.value)}
            required
          />
          <div className={styles.formButtons}>
            {/* <input
              type='submit'
              value='Create'
              className={styles.updateBoardButton}
            />
            <input
              type='button'
              value='Cancel'
              onClick={() => toggleHandler()}
              className={styles.updateBoardButton}
            /> */}

            <Button
              value={'Cancel'}
              color={'white'}
              size={'small'}
              onClick={() => toggleHandler()}
            />
            <Button
              value={'Create'}
              color={'blue'}
              size={'small'}
              onClick={e => onSubmitHandler(e)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
