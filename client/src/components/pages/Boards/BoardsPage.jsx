import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { getAllBoards } from '../../../reducers/BoardReducer';

export default function BoardsPage() {
  const { boards, loading } = useSelector(state => ({ ...state.board }));

  // this is how to use the action in the extrareducer.
  // const dispatch = useDispatch();

  // // get all the jobs
  // useEffect(() => {
  //   // this will be loaded with the current loggedIn user's id or clerk_id
  //   dispatch(getAllBoards());
  // }, []);

  const handleBoardClick = () => {
    console.log('yeeee handle boardclick');
  };

  return (
    <div>
      <h3>My boards</h3>
      {!loading && (
        <>
          {boards.map(board => (
            <div key={board.id}>
              <div>
                <p onClick={() => handleBoardClick()}>{board.title}</p>
              </div>
            </div>
          ))}
          <div>
            <p>+ NEW BOARD</p>
          </div>
        </>
      )}
    </div>
  );
}
