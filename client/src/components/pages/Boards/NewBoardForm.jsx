import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBoard } from '../../../reducers/BoardReducer';

export default function NewBoardForm({ toggleHandler }) {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const onSubmitHandler = e => {
    e.preventDefault();

    dispatch(createBoard(title));
  };

  return (
    <div>
      <form onSubmit={e => onSubmitHandler(e)}>
        <input
          type='text'
          value={title}
          name='title'
          placeholder='New Board Name'
          onChange={e => setTitle(e.target.value)}
        />
        <input type='submit' value='Create' />
      </form>
      <button onClick={() => toggleHandler()}>Cancel </button>
    </div>
  );
}
