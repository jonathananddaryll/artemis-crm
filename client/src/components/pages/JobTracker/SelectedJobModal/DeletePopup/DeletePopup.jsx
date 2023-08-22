import React from 'react';
import Button from '../../../../layout/Button/Button';

import styles from './DeletePopup.module.scss';

export default function DeletePopup({
  handleDeleteJob,
  setConfirmationToggle
}) {
  return (
    <div className={styles.popupWrapper}>
      <div
        className={styles.popupOuter}
        onClick={() => setConfirmationToggle(false)}
      ></div>
      <div className={styles.popupBox}>
        <p className={styles.textPopup}>
          Are you sure you want to delete this job?
        </p>
        <div className={styles.popupButtons}>
          {/* <button onClick={() => setConfirmationToggle(false)}>Cancel</button> */}
          <Button
            type={'button'}
            value={'Cancel'}
            color={'white'}
            onClick={() => setConfirmationToggle(false)}
          />
          <Button
            type={'button'}
            value={'OK'}
            color={'blue'}
            onClick={() => handleDeleteJob()}
          />
        </div>
      </div>
    </div>
  );
}
