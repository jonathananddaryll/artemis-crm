import React from 'react';
import Button from '../../../../layout/Button/Button';

import styles from './DeletePopup.module.scss';

export default function DeletePopup({
  handleDeleteJob,
  setConfirmationToggle,
  popUpText
}) {
  return (
    <div className={styles.popupWrapper}>
      <div
        className={styles.popupOuter}
        onClick={() => setConfirmationToggle(false)}
      ></div>
      <div className={styles.popupBox}>
        <p className={styles.textPopup}>{popUpText}</p>
        <div className={styles.popupButtons}>
          {/* <button onClick={() => setConfirmationToggle(false)}>Cancel</button> */}
          <Button
            type={'button'}
            size={'small'}
            value={'Cancel'}
            color={'white'}
            onClick={() => setConfirmationToggle(false)}
          />
          <Button
            type={'button'}
            size={'small'}
            value={'OK'}
            color={'blue'}
            onClick={() => handleDeleteJob()}
          />
        </div>
      </div>
    </div>
  );
}
