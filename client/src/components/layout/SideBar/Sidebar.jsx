import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './SideBar.module.css';
import {
  useClerk,
  UserButton,
  useAuth,
  SignOutButton
} from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';
import {
  getAllBoards,
  changeBoard,
  getjobswithBoardId
} from '../../../reducers/BoardReducer';

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

  const menuItems = [
    { index: 1, text: 'Contacts', icon: '/icons/phone.svg', link: '/contacts' },
    {
      index: 2,
      text: 'Documents',
      icon: '/icons/file.svg',
      link: '/documents'
    },
    { index: 3, text: 'Boards', icon: '/icons/table.svg', link: '/boards' }
  ];

  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  if (boardsLoading && userId !== null) {
    // change the 111 to userId from clerk or sql user table later
    dispatch(getAllBoards(userId));
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
              <img src='/icons/deer.png' className={styles.logoImage} />
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
          {menuItems.map(({ index, text, icon, link }) => (
            <NavLink key={index} to={link} className={styles.navMenuLink}>
              <div
                className={
                  styles.menuItem + ' ' + (!isExpanded && styles.menuItemNX)
                }
              >
                <img src={icon} alt='' srcSet='' />
                {isExpanded && <p>{text}</p>}
                {!isExpanded && <div className={styles.tooltip}>{text}</div>}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <SignOutButton />
      <ul className={styles.navItems}>
        {/* <li className={styles.navItem}>
          <NavLink className={styles.navItemText} to='/contacts'>
            contacts
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink className={styles.navItemText} to='/jobtracker'>
            documents
          </NavLink>
        </li> */}
        <li className={styles.navItem}>
          {/* will change this and combined boards with jobtracker */}

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
