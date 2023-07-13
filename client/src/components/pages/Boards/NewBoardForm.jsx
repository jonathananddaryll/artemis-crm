import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBoard } from '../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';

export default function NewBoardForm({ toggleHandler }) {
  const [title, setTitle] = useState('');
  const [token, setToken] = useState('');
  const dispatch = useDispatch();

  const { session } = useSession();

  async function getsess() {
    const sessToken = await session.getToken();

    setToken(sessToken);
  }

  useEffect(() => {
    getsess();
  }, []);

  const onSubmitHandler = e => {
    e.preventDefault();

    const formData = {
      title: title,
      token: token
    };

    dispatch(createBoard(formData));

    // console.log(formData);

    // Clears the form then close it
    setTitle('');
    toggleHandler();
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
