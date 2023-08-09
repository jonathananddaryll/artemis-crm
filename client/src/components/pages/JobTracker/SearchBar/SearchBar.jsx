import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function SearchBar({ filterJob }) {
  const [searchFilter, setSearchFilter] = useState('');
  const dispatch = useDispatch();

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (!firstUpdate.current) {
      dispatch(filterJob(searchFilter));
    }
    // dispatch(filterJob(searchFilter));
  }, [searchFilter]);

  // const onChangeHandler = e => {
  //   e.preventDefault();
  //   setSearchFilter(e.target.value);
  //   console.log(searchFilter);
  //   dispatch(filterJob(searchFilter));
  // };

  return (
    <div>
      <p>searchbar</p>
      <input
        type='text'
        name='searchFilter'
        value={searchFilter}
        onChange={e => setSearchFilter(e.target.value)}
      />
      <p>{searchFilter}</p>
    </div>
  );
}
