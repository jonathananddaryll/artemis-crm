import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp
} from '@clerk/clerk-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import SideBar from './components/layout/SideBar/SideBar';
import HomePage from './components/pages/Home/HomePage';
import JobTrackerPage from './components/pages/JobTracker/JobTrackerPage';
import BoardsPage from './components/pages/Boards/BoardsPage';
import ContactsPage from './components/pages/Contacts/ContactsPage';
import DocumentsPage from './components/pages/Documents/DocumentsPage';
import SettingsPage from './components/pages/Settings/SettingsPage';
import RemindersPage from './components/pages/Reminders/RemindersPage';

import './styles/globals.scss';

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
          afterSignInUrl='/boards'
          afterSignUpUrl='/boards'
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

              <Route path='/' element={<HomePage />} />
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
              />

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
              />

              <Route
                path='/contacts'
                element={
                  <>
                    <SignedIn>
                      <ContactsPage />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn></RedirectToSignIn>
                    </SignedOut>
                  </>
                }
              />

              <Route
                path='/settings'
                element={
                  <>
                    <SignedIn>
                      <SettingsPage />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn></RedirectToSignIn>
                    </SignedOut>
                  </>
                }
              />

              <Route
                path='/reminders'
                element={
                  <>
                    <SignedIn>
                      <RemindersPage />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn></RedirectToSignIn>
                    </SignedOut>
                  </>
                }
              />

              <Route
                path='/Documents'
                element={
                  <>
                    <SignedIn>
                      <DocumentsPage />
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn></RedirectToSignIn>
                    </SignedOut>
                  </>
                }
              />
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
