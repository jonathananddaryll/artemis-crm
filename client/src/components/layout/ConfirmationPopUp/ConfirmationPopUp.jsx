import React from 'react';

import styles from './ConfirmationPopUp.module.scss';

// import styles from '../../pages/JobTracker/SelectedJobModal/DeletePopup/DeletePopup.module.css';

export default function ConfirmationPopUp({
  popUpText,
  handleDelete,
  cancelDelete
}) {
  return (
    <div className={styles.popupWrapper}>
      <div
        className={styles.popupOuter}
        onClick={() => cancelDelete(false)}
      ></div>
      <div className={styles.popupBox}>
        <p className={styles.textPopup}>{popUpText}</p>
        <div className={styles.popupButtons}>
          <button onClick={() => cancelDelete(false)}>Cancel</button>
          <button onClick={() => handleDelete()}>OK</button>
        </div>
      </div>
    </div>
  );
}
