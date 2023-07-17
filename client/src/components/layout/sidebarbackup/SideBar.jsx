import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './SideBar.module.css';
import {
  useClerk,
  UserButton,
  useAuth,
  SignOutButton,
  useUser
} from '@clerk/clerk-react';

import { NavLink } from 'react-router-dom';
import {
  getAllBoards,
  changeBoard,
  getjobswithBoardId
} from '../../../reducers/BoardReducer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhoneFlip,
  faHouse,
  faTableColumns,
  faFile
} from '@fortawesome/free-solid-svg-icons';

// import { getjobswithBoardId } from '../../../reducers/JobReducer';

// function SignInButton() {
//   const clerk = useClerk();

//   return (
//     <Button
//       onClick={() => clerk.openSignIn({})}
//       bg={'blue.400'}
//       color={'white'}
//       _hover={{ bg: 'blue.500' }}
//     >
//       SignIn
//     </Button>
//   );
// }

export default function SideBar() {
  const { boards, boardsLoading } = useSelector(state => ({ ...state.board }));
  const { isLoaded, userId, firstName } = useAuth();
  const { user } = useUser();

  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  if (boardsLoading && userId !== null) {
    // change the 111 to userId from clerk or sql user table later
    dispatch(getAllBoards(111));
  }

  // get all the jobs
  // useEffect(() => {
  //   // this will be loaded with the current loggedIn user's id or clerk_id
  //   dispatch(getAllBoards());
  // }, []);

  const handleLink = board => {
    dispatch(changeBoard(board));
    // dispatch(getjobswithBoardId(board.id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.loboBox}>
        <p className={styles.logoImage}>O</p>
        <p className={styles.logoText}>Artemis</p>
      </div>
      {/* <p>sidebar</p> */}
      {/* {isLoaded && <UserButton />} */}

      {/* {userId !== null && user !== undefined && ( */}
      {/* <> */}
      {/* <p>{userId}</p> */}
      {/* <p>{user.firstName}</p> */}
      {/* <p>{user.lastName}</p> */}
      {/* <SignOutButton /> */}
      {/* </> */}
      {/* )} */}

      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <FontAwesomeIcon className={styles.navItemIcon} icon={faPhoneFlip} />
          <NavLink className={styles.navItemText} to='/contacts'>
            contacts
          </NavLink>
        </li>
        {/* <li>
          <NavLink to='/jobtracker'>job tracker</NavLink>
        </li> */}
        <li className={styles.navItem}>
          <FontAwesomeIcon className={styles.navItemIcon} icon={faFile} />
          <NavLink className={styles.navItemText} to='/jobtracker'>
            documents
          </NavLink>
        </li>
        <li className={styles.navItem}>
          {/* will change this and combined boards with jobtracker */}
          <FontAwesomeIcon
            className={styles.navItemIcon}
            icon={faTableColumns}
          />
          <NavLink className={styles.navItemText} to='/boards'>
            Boards
          </NavLink>
          {!boardsLoading && boards.length > 0 && (
            <ul className={styles.navItems}>
              {boards.map(board => (
                <li key={board.id} onClick={() => handleLink(board)}>
                  <NavLink
                    className={styles.navItemTextSub}
                    to={`/boards/${board.id}/jobs`}
                  >
                    {board.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
