import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

import DemoSignIn from '../../layout/DemoSignIn/DemoSignIn';
import styles from './HomePage.module.scss';

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <div className={styles.navBrand}>
              <img src='/icons/deer.png' className={styles.logoImage} />
              <h2 className={styles.logoText}>Artemis</h2>
            </div>
          </div>
          <div className={styles.actionItems}>
            <a
              className={styles.loginButton}
              href='https://adapting-osprey-11.accounts.dev/sign-in'
            >
              Log In
            </a>

            <a
              className={styles.registerButton}
              href='https://adapting-osprey-11.accounts.dev/sign-up'
            >
              Sign up for free
            </a>
          </div>
        </nav>
        <div className={styles.heroSection}>
          <div className={styles.mainFlex}>
            <div className={styles.mainInfo}>
              <h3>Exciting Things Are Coming!</h3>
              <p>
                Our Landing Page Is Getting a Makeover, but Our CRM is Still
                Accessible
              </p>
              {user === null && <DemoSignIn />}
            </div>
            <div className={styles.mainImage}>
              <img src='/icons/underconstruction.jpg' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
