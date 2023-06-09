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
  const { boards, loading } = useSelector(state => ({ ...state.board }));
  const { isLoaded, userId, firstName } = useAuth();
  const { user } = useUser();

  // this is how to use the action in the extrareducer.
  const dispatch = useDispatch();

  if (loading && userId !== null) {
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
        {/* <li>
          <NavLink to='/jobtracker'>job tracker</NavLink>
        </li> */}
        <li>
          <NavLink to='/jobtracker'>documents</NavLink>
        </li>
        <li>
          {/* will change this and combined boards with jobtracker */}
          <NavLink to='/boards'>Boards</NavLink>
          {!loading && boards.length > 0 && (
            <ul>
              {boards.map(board => (
                <li key={board.id} onClick={() => handleLink(board)}>
                  <NavLink to={`/boards/${board.id}/jobs`}>
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
