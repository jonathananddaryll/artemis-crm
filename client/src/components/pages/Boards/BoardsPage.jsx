import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getAllBoards, changeBoard } from '../../../reducers/BoardReducer';
import { Link } from 'react-router-dom';
import styles from './Boards.module.css';
import NewBoardForm from './NewBoardForm';

export default function BoardsPage() {
  const { boards, boardsLoading } = useSelector(state => ({ ...state.board }));
  const [formToggle, setFormToggle] = useState(false);

  const toggleHandler = () => {
    setFormToggle(!formToggle);
  };

  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  // // get all the jobs
  // useEffect(() => {
  //   // this will be loaded with the current loggedIn user's id or clerk_id
  //   dispatch(getAllBoards());
  // }, []);

  const handleBoardClick = board => {
    console.log('yeeee handle boardclick');
    console.log(board);
    dispatch(changeBoard(board));
  };

  return (
    <div className={styles.page_wrapper}>
      <h3>My boards</h3>
      {!boardsLoading && (
        <div className={styles.boards_container}>
          {boards.map(board => (
            <Link to={`/boards/${board.id}/jobs`}>
              <div key={board.id} className={styles.board_box}>
                <p onClick={() => handleBoardClick(board)}>{board.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className={styles.newboard_box}>
        {!formToggle ? (
          <button onClick={() => toggleHandler()}>+ NEW BOARD</button>
        ) : (
          <NewBoardForm toggleHandler={toggleHandler} />
        )}
      </div>
    </div>
  );
}
