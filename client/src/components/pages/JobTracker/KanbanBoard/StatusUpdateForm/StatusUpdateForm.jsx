import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';

import Button from '../../../../layout/Button/Button';

import styles from './StatusUpdateForm.module.scss';

export default function StatusUpdateForm({
  selectedBoard,
  setStatusFormToggle,
  statusFormToggle,
  updateBoardColumn
}) {
  const [newTitle, setNewTitle] = useState(statusFormToggle.ind);
  const dispatch = useDispatch();
  const { session } = useSession();

  async function onSubmitHandler(e) {
    e.preventDefault();
    const formData = {
      id: selectedBoard.id,
      userId: selectedBoard.user_id,
      columnToUpdate: statusFormToggle.column,
      columnStatus: newTitle,
      oldColumnStatus: statusFormToggle.ind,
      token: await session.getToken()
    };

    // Dispatch action here
    // setStatusFormToggle({ ind: null, state: false });

    dispatch(updateBoardColumn(formData));
    setStatusFormToggle({ ind: null, state: false, column: null });
    // console.log(newTitle);
    // console.log(statusFormToggle.column);
  }

  return (
    <div className={styles.updateForm}>
      <form onSubmit={e => onSubmitHandler(e)}>
        <div className={styles.formGroup}>
          <input
            type='text'
            value={newTitle}
            name='newTitle'
            placeholder='Status Name'
            onChange={e => setNewTitle(e.target.value)}
            required
          />
          <div className={styles.formButtons}>
            <Button
              type={'button'}
              value={'Cancel'}
              color={'white'}
              size={'small'}
              onClick={() =>
                setStatusFormToggle({ ind: null, state: false, column: null })
              }
            />
            {/* <Button
            type={'submit'}
            value={'Update'}
            color={'blue'}
            size={'small'}
            disabled={newTitle === ''}
          /> */}
          </div>
        </div>
      </form>
    </div>
  );
}
