import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBoardName } from '../../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';

import styles from './UpdateForm.module.css';

export default function UpdateForm({ board, handleToggleUpdateForm }) {
  const [newTitle, setNewTitle] = useState(board.title);
  const dispatch = useDispatch();

  const { session } = useSession();

  async function onSubmitHandler(e) {
    e.preventDefault();

    const formData = {
      id: board.id,
      title: newTitle,
      userId: board.user_id,
      token: await session.getToken()
    };

    // dispatch(createBoard(formData));

    // console.log(formData);

    // Clears the form then close it
    // setNewTitle('');
    // toggleHandler();
    dispatch(updateBoardName(formData));
    handleToggleUpdateForm({ ind: null, state: false });
    console.log(formData);
  }

  return (
    <div className={styles.updateFormContainer}>
      <div className={styles.updateForm}>
        <form onSubmit={e => onSubmitHandler(e)}>
          <input
            type='text'
            value={newTitle}
            name='newTitle'
            placeholder='New Board Name'
            onChange={e => setNewTitle(e.target.value)}
          />
          <div className={styles.formButtons}>
            <input
              type='submit'
              value='Update'
              className={styles.updateBoardButton}
            />
            <input
              type='button'
              value='Cancel'
              className={styles.updateBoardButton}
              onClick={() =>
                handleToggleUpdateForm({ ind: null, state: false })
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
}
