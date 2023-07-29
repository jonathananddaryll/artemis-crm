import React from 'react';
import styles from './BoardHeader.module.css';

export default function BoardHeader({ title }) {
  return (
    <div className={styles.boardContainer}>
      <h3 className={styles.boardTitle}>{title}</h3>
      {/* SEARCH BAR */}
      {/* FILTER */}
    </div>
  );
}
