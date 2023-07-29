import { useState } from 'react';
import './App.css';
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

import SideBar from './components/layout/SideBar/Sidebar';
import HomePage from './components/pages/Home/HomePage';
import JobTrackerPage from './components/pages/JobTracker/JobTrackerPage';
import BoardsPage from './components/pages/Boards/BoardsPage';
import ContactsPage from './components/pages/Contacts/ContactsPage';

// if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
//   throw new Error('Missing Publishable Key');
// }
// const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key');
  }

  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // const navigate1 = useNavigate();

  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey} navigate={to => navigate(to)}>
        <>
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
            <Route 
              path='/contacts/' 
              element={
                <>
                  <SignedIn>
                    < ContactsPage />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn></RedirectToSignIn>
                  </SignedOut>
                </>
              }
              ></Route>
          </Routes>
        </>
      </ClerkProvider>
    </BrowserRouter>
  );
}

export default App;
