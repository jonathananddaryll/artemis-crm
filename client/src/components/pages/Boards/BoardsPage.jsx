import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { getBoards, changeBoard } from '../../../reducers/BoardReducer';
import timeSince from '../../../helpers/convertDate';
import NewBoardForm from './Forms/NewBoardForm';
import UpdateForm from './Forms/UpdateForm';
import loadingInfinity from '../../../assets/loadingInfinity.gif';
import Loader from '../../layout/Loader/Loader';
import styles from './Boards.module.scss';

export default function BoardsPage() {
  const { boards, boardsLoading } = useSelector(state => ({ ...state.board }));
  const [formToggle, setFormToggle] = useState(false);
  const [titleFormToggle, setTitleFormToggle] = useState({
    ind: null,
    state: false
  });
  const { userId } = useAuth();

  // get all the jobs
  useEffect(() => {
    // this will be loaded with the current loggedIn user's user_id
    if (boardsLoading) {
      dispatch(getBoards(userId));
    }
  }, []);

  const dispatch = useDispatch();

  const toggleHandler = () => {
    setFormToggle(!formToggle);
  };

  const handleBoardClick = board => {
    dispatch(changeBoard(board));
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h3 className={styles.textHeader}>My Personal Boards</h3>
      </div>

      {boardsLoading ? (
        <Loader
          text={'Loading Boards'}
          img={loadingInfinity}
          altText={'loading_boards'}
          imageStyle={1}
          textStyle={1}
        />
      ) : (
        <div className={styles.boardsContainer}>
          <div className={styles.flexBox}>
            <div className={styles.newBoardBox}>
              {!formToggle ? (
                <button
                  className={styles.newBoardButton}
                  onClick={() => toggleHandler()}
                >
                  + New Board
                </button>
              ) : (
                <NewBoardForm
                  toggleHandler={toggleHandler}
                  setFormToggle={setFormToggle}
                />
              )}
            </div>
          </div>
          {boards.map((board, idx) => (
            <div key={board.id} className={styles.flexBox}>
              <Link
                to={`/boards/${board.id}/jobs`}
                key={idx}
                className={styles.linkStyle}
              >
                <div
                  className={styles.boardBox}
                  onClick={() => handleBoardClick(board)}
                >
                  <div className={styles.boardBoxHeader}>
                    <p key={board.id} className={styles.textBoardTitle}>
                      {board.title}
                    </p>
                    <p className={styles.textJobsCount}>
                      {board.total_jobs_count} Jobs
                    </p>
                  </div>

                  <p className={styles.textBoardDateCreated}>
                    Created {timeSince(board.date_created)}
                  </p>
                </div>
              </Link>
              <button
                className={styles.editButton}
                onClick={e =>
                  setTitleFormToggle({
                    ind: idx,
                    state: true
                  })
                }
              >
                <i className='bi bi-pencil'></i>
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
