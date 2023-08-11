import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import styles from './SearchBar.module.css';

export default function SearchBar({ filterJob }) {
  const [searchFilter, setSearchFilter] = useState('');
  const dispatch = useDispatch();

  const firstUpdate = useRef(true);

  useEffect(() => {
    // Dont trigger on the first load of the page
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (!firstUpdate.current) {
      dispatch(filterJob(searchFilter));
    }
  }, [searchFilter]);

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <i className='bi bi-search'></i>
        <input
          type='text'
          name='searchFilter'
          value={searchFilter}
          placeholder='Search for company, role, or location'
          onChange={e => setSearchFilter(e.target.value)}
        />
      </div>
    </div>
  );
}
