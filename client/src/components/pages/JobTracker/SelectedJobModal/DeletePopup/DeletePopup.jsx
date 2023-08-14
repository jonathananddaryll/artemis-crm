import React from 'react';

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
          <button onClick={() => setConfirmationToggle(false)}>Cancel</button>
          <button onClick={() => handleDeleteJob()}>OK</button>
        </div>
      </div>
    </div>
  );
}
