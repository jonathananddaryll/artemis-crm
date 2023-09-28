import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../../../layout/Button/Button';
import DeletePopup from '../../../layout/DeletePopup/DeletePopup';
import styles from './BoardHeader.module.scss';

export default function BoardHeader({
  filterJob,
  deleteBoard,
  selectedBoard: { id, user_id, title, total_jobs_count }
}) {
  const [confirmationToggle, setConfirmationToggle] = useState(false);
  const dispatch = useDispatch();
  const { session } = useSession();

  const handleDeleteBoard = async () => {
    const formData = {
      boardId: id,
      selectedBoard_userId: user_id,
      token: await session.getToken()
    };

    dispatch(deleteBoard(formData));
  };

  return (
    <div className={styles.boardContainer}>
      <SearchBar filterJob={filterJob} />
      <div className={styles.titleContainer}>
        <h3 className={styles.titleText}>{title}</h3>
      </div>

      <div className={styles.filterContainer}>
        <Button
          type={'button'}
          size={'small'}
          value={'Delete Board'}
          color={'red'}
          disabled={total_jobs_count > 0}
          onClick={() => setConfirmationToggle(true)}
        />
      </div>

      {confirmationToggle && (
        <DeletePopup
          handleDelete={handleDeleteBoard}
          closePopUp={() => setConfirmationToggle(false)}
          mainText={`Are you sure delete '${title}' board?`}
          subText={'This action cannot be undone'}
        />
      )}
    </div>
  );
}
