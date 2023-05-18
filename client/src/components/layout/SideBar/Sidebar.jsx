import React from 'react';
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
  const { boards, loading } = useSelector(state => ({ ...state.board }));
  const { isLoaded, userId, firstName } = useAuth();
  const { user } = useUser();
  return (
    <div className={styles.container}>
      <p>sidebar</p>
      {isLoaded && <UserButton />}
      {userId !== null && user !== undefined && (
        <>
          <p>{userId}</p>
          <p>{user.firstName}</p>
          <p>{user.lastName}</p>
          <SignOutButton />
        </>
      )}

      <ul>
        <li>
          <NavLink to='/contacts'>contacts</NavLink>
        </li>
        <li>
          <NavLink to='/jobtracker'>job tracker</NavLink>
        </li>
        <li>
          <NavLink to='/jobtracker'>documents</NavLink>
        </li>
        <li>
          {/* will change this and combined boards with jobtracker */}
          <NavLink to='/boards'>Boards</NavLink>
          {!loading && boards.length > 0 && (
            <ul>
              {boards.map(board => (
                <li key={board.id}>
                  <NavLink to={`/boards/${board.id}`}>{board.title}</NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
}
