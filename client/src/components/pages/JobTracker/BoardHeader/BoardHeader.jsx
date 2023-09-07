import React, { useState } from 'react';
import styles from './BoardHeader.module.scss';
import SearchBar from '../SearchBar/SearchBar';
import Button from '../../../layout/Button/Button';
import DeletePopup from '../../../layout/DeletePopup/DeletePopup';

export default function BoardHeader({ title, filterJob, totalJobsCount }) {
  const [confirmationToggle, setConfirmationToggle] = useState(false);
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
          disabled={totalJobsCount > 0}
          onClick={() => setConfirmationToggle(true)}
        />
      </div>

      {confirmationToggle && (
        <DeletePopup
          // handleDelete={handleDeleteJob}
          closePopUp={() => setConfirmationToggle(false)}
          mainText={`Are you sure you want to delete ${title} board?`}
          subText={
            'This will delete this board permanently. You cannot undo this action'
          }
        />
      )}
    </div>
  );
}
