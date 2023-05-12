import React from 'react';
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
      </ul>
    </div>
  );
}
