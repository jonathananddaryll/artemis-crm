import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getAllBoards, changeBoard } from '../../../reducers/BoardReducer';
import { Link } from 'react-router-dom';
import styles from './Boards.module.css';
import NewBoardForm from './NewBoardForm';
import { useAuth } from '@clerk/clerk-react';
import UpdateForm from './UpdateForm';

export default function BoardsPage() {
  const { boards, boardsLoading } = useSelector(state => ({ ...state.board }));
  const [formToggle, setFormToggle] = useState(false);
  const [titleFormToggle, setTitleFormToggle] = useState({
    ind: null,
    state: false
  });

  const { userId } = useAuth();

  const toggleHandler = () => {
    setFormToggle(!formToggle);
  };

  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  // // get all the jobs
  useEffect(() => {
    // this will be loaded with the current loggedIn user's id or clerk_id
    dispatch(getAllBoards(userId));
  }, []);

  const handleBoardClick = board => {
    console.log('yeeee handle boardclick');
    console.log(board);
    dispatch(changeBoard(board));
  };

  return (
    <div className={styles.pageWrapper}>
      <h3>My boards</h3>
      {!boardsLoading && (
        <div className={styles.boardsContainer}>
          <div className={styles.flexBox}>
            <div className={styles.newBoardBox}>
              {!formToggle ? (
                <button onClick={() => toggleHandler()}>+ NEW BOARD</button>
              ) : (
                <NewBoardForm toggleHandler={toggleHandler} />
              )}
            </div>
          </div>
          {boards.map((board, idx) => (
            <div
              key={board.id}
              className={styles.flexBox}
              onClick={() => handleBoardClick(board)}
            >
              <Link to={`/boards/${board.id}/jobs`} key={idx}>
                <div className={styles.boardBox}>
                  <p key={board.id}>{board.title}</p>
                  <p>{board.date_created}</p>
                </div>
              </Link>{' '}
              <button
                className={styles.editButton}
                onClick={e =>
                  setTitleFormToggle({
                    ind: idx,
                    state: true
                  })
                }
              >
                edit
              </button>
              {titleFormToggle.state && titleFormToggle.ind === idx && (
                <UpdateForm
                  board={board}
                  handleToggleUpdateForm={setTitleFormToggle}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
