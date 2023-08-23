import React from 'react';

import styles from './ConfirmationPopUp.module.scss';
import Button from '../Button/Button';

// import styles from '../../pages/JobTracker/SelectedJobModal/DeletePopup/DeletePopup.module.css';

export default function ConfirmationPopUp({
  popUpText,
  setSelectedNote,
  handleDeleteNote,
  noteId
}) {
  return (
    <div className={styles.popupWrapper}>
      <div
        className={styles.popupOuter}
        onClick={() =>
          setSelectedNote({
            isActive: false,
            noteId: null
          })
        }
      ></div>
      <div className={styles.popupBox}>
        <p className={styles.textPopup}>{popUpText}</p>
        <div className={styles.popupButtons}>
          <Button
            type={'button'}
            value={'Cancel'}
            color={'white'}
            // size={'small'}
            onClick={() =>
              setSelectedNote({
                isActive: false,
                noteId: null
              })
            }
          />

          <Button
            type={'button'}
            value={'OK'}
            color={'blue'}
            // size={'small'}
            onClick={() => handleDeleteNote(noteId)}
          />
          {/* <button onClick={() => cancelDelete(false)}>Cancel</button>
          <button onClick={() => handleDelete()}>OK</button> */}
        </div>
      </div>
    </div>
  );
}
