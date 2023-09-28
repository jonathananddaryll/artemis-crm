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

  const onSubmitHandler = async e => {
    e.preventDefault();
    const formData = {
      id: selectedBoard.id,
      userId: selectedBoard.user_id,
      columnToUpdate: statusFormToggle.column,
      columnStatus: newTitle,
      oldColumnStatus: statusFormToggle.ind,
      token: await session.getToken()
    };

    dispatch(updateBoardColumn(formData));
    setStatusFormToggle({ ind: null, state: false, column: null });
  };

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
          </div>
        </div>
      </form>
    </div>
  );
}
