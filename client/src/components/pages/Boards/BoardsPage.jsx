import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getBoards, changeBoard } from '../../../reducers/BoardReducer';
import { Link } from 'react-router-dom';
import styles from './Boards.module.css';
import NewBoardForm from './NewBoardForm';
import { useAuth } from '@clerk/clerk-react';
import UpdateForm from './UpdateForm';
import loadingInfinity from '../../../assets/loadingInfinity.gif';
import timeSince from '../../../helpers/convertDate';

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
    dispatch(getBoards(userId));
  }, []);

  const handleBoardClick = board => {
    dispatch(changeBoard(board));
  };

  return (
    <div className={styles.pageWrapper}>
      <h3>My Personal Boards</h3>
      {boardsLoading ? (
        <div className={styles.loaderContainer}>
          <img
            className={styles.loaderImg}
            src={loadingInfinity}
            alt='loading_boards'
          />
          <p className={styles.loaderText}>Your boards are loading</p>
        </div>
      ) : (
        <div className={styles.boardsContainer}>
          <div className={styles.flexBox}>
            <div className={styles.newBoardBox}>
              {!formToggle ? (
                <button
                  className={styles.newBoardButton}
                  onClick={() => toggleHandler()}
                >
                  + NEW BOARD
                </button>
              ) : (
                <NewBoardForm toggleHandler={toggleHandler} />
              )}
            </div>
          </div>
          {boards.map((board, idx) => (
            <div key={board.id} className={styles.flexBox}>
              <Link
                to={`/boards/${board.id}/jobs`}
                key={idx}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className={styles.boardBox}
                  onClick={() => handleBoardClick(board)}
                >
                  <p key={board.id} className={styles.textBoardTitle}>
                    {board.title}
                  </p>
                  <p className={styles.textBoardDateCreated}>
                    created {timeSince(board.date_created)}
                  </p>
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
                Edit
              </button>
              {titleFormToggle.state && titleFormToggle.ind === idx && (
                <UpdateForm
                  board={board}
                  handleToggleUpdateForm={setTitleFormToggle}
                />
              )}
            </div>
          ))}
          {/* if there's 4 gap */}
          {(boards.length + 1) % 5 === 1 && (
            <>
              <div className={styles.flexboxSpacer}></div>
              <div className={styles.flexboxSpacer}></div>
              <div className={styles.flexboxSpacer}></div>
              <div className={styles.flexboxSpacer}></div>
            </>
          )}

          {/* if there's 3 gaps */}
          {(boards.length + 1) % 5 === 2 && (
            <>
              <div className={styles.flexboxSpacer}></div>
              <div className={styles.flexboxSpacer}></div>
              <div className={styles.flexboxSpacer}></div>
            </>
          )}

          {/* if there's 2 gaps */}
          {(boards.length + 1) % 5 === 3 && (
            <>
              <div className={styles.flexboxSpacer}></div>
              <div className={styles.flexboxSpacer}></div>
            </>
          )}

          {/* if there's 1 gaps */}
          {(boards.length + 1) % 5 === 4 && (
            <div className={styles.flexboxSpacer}></div>
          )}
        </div>
      )}
    </div>
  );
}
