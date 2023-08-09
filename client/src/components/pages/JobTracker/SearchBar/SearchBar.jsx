import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

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
    <div>
      <p>searchbar</p>
      <input
        type='text'
        name='searchFilter'
        value={searchFilter}
        onChange={e => setSearchFilter(e.target.value)}
      />
    </div>
  );
}
