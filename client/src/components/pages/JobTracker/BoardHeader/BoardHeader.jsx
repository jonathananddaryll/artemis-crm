import React from 'react';
import styles from './BoardHeader.module.scss';
import SearchBar from '../SearchBar/SearchBar';

export default function BoardHeader({ title, filterJob }) {
  return (
    <div className={styles.boardContainer}>
      <SearchBar filterJob={filterJob} />
      <div className={styles.titleContainer}>
        <h3 className={styles.titleText}>{title}</h3>
      </div>

      <div className={styles.filterContainer}>Filter by date goes here</div>

      {/* FILTER */}
    </div>
  );
}
