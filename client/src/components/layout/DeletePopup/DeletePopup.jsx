import React from 'react';
import Button from '../Button/Button';

import styles from './DeletePopup.module.scss';

export default function DeletePopup({
  handleDelete,
  closePopUp,
  mainText,
  subText
}) {
  return (
    <div className={styles.popupWrapper}>
      <div className={styles.popupOuter} onClick={() => closePopUp()}></div>
      <div className={styles.popupBox}>
        <p className={styles.popupMainText}>{mainText}</p>
        <p className={styles.popupSubText}>{subText}</p>

        <div className={styles.popupButtons}>
          {/* <button onClick={() => setConfirmationToggle(false)}>Cancel</button> */}
          <Button
            type={'button'}
            size={'small'}
            value={'Cancel'}
            color={'white'}
            onClick={() => closePopUp()}
          />
          <Button
            type={'button'}
            size={'small'}
            value={'OK'}
            color={'blue'}
            onClick={() => handleDelete()}
          />
        </div>
      </div>
    </div>
  );
}
