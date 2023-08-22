import React from 'react';
import styles from './NoDataPlaceholder.module.scss';

export default function NoDataPlaceholder({ image, header, subHeader }) {
  return (
    <div className={styles.container}>
      <div className={styles.imageBox}>
        <img src={image} />
      </div>
      <div className={styles.textBox}>
        <p className={styles.headerText}>{header}</p>
        <p className={styles.subHeaderText}>{subHeader}</p>
      </div>
    </div>
  );
}
