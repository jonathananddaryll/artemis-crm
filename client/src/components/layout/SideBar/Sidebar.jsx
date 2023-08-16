import React, { useState } from 'react';
import styles from './SideBar.module.scss';
import {
  useClerk,
  UserButton,
  useAuth,
  useUser,
  SignOutButton
} from '@clerk/clerk-react';

import SignIn from './SignIn';

import { NavLink } from 'react-router-dom';

export default function SideBar() {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

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

  return (
    <div className={styles.navContainer}>
      <div className={styles.navUpper}>
        <div className={styles.navHeading}>
          <div className={styles.navBrand}>
            <img src='/icons/deer.png' className={styles.logoImage} />
            <h2 className={styles.logoText}>Artemis</h2>
          </div>
        </div>
        <div className={styles.navMenu}>
          {menuItems.map(({ index, text, icon, link }) => (
            <NavLink key={index} to={link} className={styles.navMenuLink}>
              <div className={styles.menuItem}>
                <img src={icon} alt='' srcSet='' />
                <p>{text}</p>
              </div>
            </NavLink>
          ))}
        </div>
        {user === null && (
          <div>
            <SignIn />
          </div>
        )}
      </div>
      {isLoaded && user !== null && (
        <div className={styles.footer}>
          <UserButton />
          <div className={styles.footerUserInfo}>
            <p className={styles.fullNameText}>{user.fullName}</p>
            <p className={styles.emailText}>
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
          {/* <SignOutButton /> */}
          <div className={styles.footerButton}>
            <button className={styles.signoutButton} onClick={() => signOut()}>
              <i className='bi bi-box-arrow-right'></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
