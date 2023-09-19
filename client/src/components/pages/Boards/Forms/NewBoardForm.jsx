import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBoard } from '../../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';
import Button from '../../../layout/Button/Button';

import styles from './UpdateForm.module.scss';

export default function NewBoardForm({ toggleHandler, setFormToggle }) {
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

    // Clears the form then close it
    setTitle('');

    // Close the Form
    setFormToggle(false);
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
            <Button
              type={'button'}
              value={'Cancel'}
              color={'white'}
              size={'small'}
              onClick={() => toggleHandler()}
            />

            <Button
              type={'submit'}
              value={'Create'}
              color={'blue'}
              size={'small'}
              disabled={title === ''}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
