import React from 'react';
import styles from './DocumentsTab.module.scss';
import Button from '../../../../layout/Button/Button';

export default function DocumentsTab() {
  return (
    <div className={styles.documentsTabContainer}>
      <div className={styles.buttonsContainer}>
        <Button value={'Link Document'} color={'blue'} size={'small'} />
        <Button value={'Add Document'} color={'blue'} size={'small'} />
      </div>
      <div className={styles.documentsContentContainer}>
        <p>no linked documents.. make this pretty later</p>
      </div>
    </div>
  );
}
