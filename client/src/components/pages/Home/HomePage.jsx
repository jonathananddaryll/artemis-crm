import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

import DemoSignIn from '../../layout/SideBar/DemoSignIn';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <p>HOMEPAGE</p>
      {user === null && <DemoSignIn />}
      <button onClick={() => navigate('/boards')}>Sign In</button>
      <a href='https://adapting-osprey-11.accounts.dev/sign-up'>
        Create Account
      </a>
    </div>
  );
};

export default HomePage;
