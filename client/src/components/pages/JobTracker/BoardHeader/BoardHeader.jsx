import React from 'react';
import styles from './BoardHeader.module.css';
import SearchBar from '../SearchBar/SearchBar';

export default function BoardHeader({ title, filterJob }) {
  return (
    <div className={styles.boardContainer}>
      <h3 className={styles.boardTitle}>{title}</h3>
      <SearchBar filterJob={filterJob} />

      {/* FILTER */}
    </div>
  );
}
