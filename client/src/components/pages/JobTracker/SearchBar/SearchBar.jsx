import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function SearchBar({ filterJob }) {
  const [searchFilter, setSearchFilter] = useState('');
  const dispatch = useDispatch();

  const onChangeHandler = e => {
    console.log('ayoooooooooooooooooooooo');
    e.preventDefault();

    setSearchFilter(e.target.value);

    console.log(searchFilter);
    dispatch(filterJob(searchFilter));
  };

  return (
    <div>
      <p>searchbar</p>
      <input
        type='text'
        name='searchFilter'
        value={searchFilter}
        onChange={e => onChangeHandler(e)}
      />
      <p>{searchFilter}</p>
    </div>
  );
}
