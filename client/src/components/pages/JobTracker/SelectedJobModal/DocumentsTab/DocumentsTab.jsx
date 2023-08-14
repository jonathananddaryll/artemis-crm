import React from 'react';
import styles from './DocumentsTab.module.scss';

export default function DocumentsTab() {
  return (
    <div className={styles.documentsTabContainer}>
      <div className={styles.buttonsContainer}>
        <button className={styles.createDocumentButton}>Add Document</button>
        <button className={styles.linkDocumentButton}>Link Document</button>
      </div>
      <div className={styles.documentsContentContainer}>
        <p>no linked documents.. make this pretty later</p>
      </div>
    </div>
  );
}
