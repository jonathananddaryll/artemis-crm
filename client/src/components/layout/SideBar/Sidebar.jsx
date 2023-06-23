import React, { useEffect, useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(true);
  const { boards, boardsLoading } = useSelector(state => ({ ...state.board }));
  const { isLoaded, userId, firstName } = useAuth();
  const { user } = useUser();

  const menuItems = [
    { text: 'Contacts', icon: 'icons/phone.svg' },
    { text: 'Documents', icon: 'icons/file.svg' },
    { text: 'Boards', icon: 'icons/table.svg' }
  ];

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
    <div
      className={
        styles.navContainer + ' ' + (!isExpanded && styles.navContainerNX)
      }
    >
      <div className={styles.navUpper}>
        <div className={styles.navHeading}>
          {isExpanded && (
            <div className={styles.navBrand}>
              <p className={styles.logoImage}>O</p>
              <h2 className={styles.logoText}>Artemis</h2>
            </div>
          )}
          <button
            className={
              styles.hamburger +
              ' ' +
              (isExpanded ? styles.hamburgerIn : styles.hamburgerOut)
            }
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className={styles.navMenu}>
          {menuItems.map(({ text, icon }) => (
            <a
              href='#'
              className={
                styles.menuItem + ' ' + (!isExpanded && styles.menuItemNX)
              }
            >
              <img src={icon} alt='' srcset='' />
              {isExpanded && <p>{text}</p>}
              {!isExpanded && <div className={styles.tooltip}>{text}</div>}
            </a>
          ))}
        </div>
      </div>

      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <FontAwesomeIcon className={styles.navItemIcon} icon={faPhoneFlip} />
          <NavLink className={styles.navItemText} to='/contacts'>
            contacts
          </NavLink>
        </li>
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
