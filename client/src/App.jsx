import React from 'react';
import './styles/globals.scss';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
  UserButton
} from '@clerk/clerk-react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import SideBar from './components/layout/SideBar/SideBar';
import HomePage from './components/pages/Home/HomePage';
import JobTrackerPage from './components/pages/JobTracker/JobTrackerPage';
import BoardsPage from './components/pages/Boards/BoardsPage';
import Contacts from './components/pages/Contacts/ContactsPage';

// if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
//   throw new Error('Missing Publishable Key');
// }
// const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key');
  }

  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  return (
    <>
      <BrowserRouter>
        <ClerkProvider
          publishableKey={clerkPubKey}
          navigate={to => navigate(to)}
        >
          <div className='flex'>
            <SideBar />
            <Routes>
              <Route
                path='/sign-in/*'
                element={<SignIn routing='path' path='/sign-in' />}
              />
              <Route
                path='/sign-up/*'
                element={<SignUp routing='path' path='/sign-up' />}
              />
              <Route path='/' element={<HomePage />}></Route>
              <Route
                path='/boards'
                element={
                  <>
                    <SignedIn>
                      <BoardsPage />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn></RedirectToSignIn>
                    </SignedOut>
                  </>
                }
              ></Route>

              <Route
                path='/boards/:board_id/jobs'
                element={
                  <>
                    <SignedIn>
                      <JobTrackerPage />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn></RedirectToSignIn>
                    </SignedOut>
                  </>
                }
              ></Route>
              <Route path='/contacts' element={<Contacts />}>
              <>
              <SignedIn>
                < ContactsPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn></RedirectToSignIn>
              </SignedOut>
              </>
            </Route>
          </Routes>
          </div>
        </ClerkProvider>
      </BrowserRouter>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme='light'
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </>
  );
}

export default App;
