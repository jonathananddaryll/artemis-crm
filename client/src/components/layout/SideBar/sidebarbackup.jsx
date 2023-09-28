import React, { useState, useEffect } from 'react';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useClerk, UserButton, useAuth, useUser } from '@clerk/clerk-react';
import DemoSignIn from '../DemoSignIn/DemoSignIn';
import styles from './SideBar.module.scss';

export default function SideBar() {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeItem, setActiveItem] = useState(0);

  const location = useLocation();

  // const menuItems = [
  //   { index: 1, text: 'Contacts', icon: '/icons/phone.svg', link: '/contacts' },
  //   {
  //     index: 2,
  //     text: 'Documents',
  //     icon: '/icons/file.svg',
  //     link: '/documents'
  //   },
  //   { index: 3, text: 'Boards', icon: '/icons/table.svg', link: '/boards' },
  //   { index: 4, text: 'Settings', icon: '/icons/settings.svg', link: '/boards' }
  // ];

  const menuItems = [
    {
      index: 1,
      text: 'Contacts',
      icon: '<ion-icon name="settings"></ion-icon>',
      link: '/contacts'
    },
    {
      index: 2,
      text: 'Documents',
      icon: '<ion-icon name="settings"></ion-icon>',
      link: '/documents'
    },
    {
      index: 3,
      text: 'Boards',
      icon: '<ion-icon name="settings"></ion-icon>',
      link: '/boards'
    },
    {
      index: 4,
      text: 'Settings',
      icon: '<ion-icon name="settings"></ion-icon>',
      link: '/boards'
    }
  ];

  const navigate = useNavigate();

  const signOutHandler = () => {
    signOut();
    navigate('/');
  };

  return (
    <>
      {location.pathname !== '/' && (
        <div className={styles.navContainer}>
          <div className={styles.navHeading}>
            <div className={styles.navBrand}>
              <img src='/icons/deer.png' className={styles.logoImage} />
              <h2 className={styles.logoText}>Artemis</h2>
            </div>
          </div>
          <div className={styles.navMenu}>
            {menuItems.map(({ index, text, icon, link }) => (
              <NavLink
                className={`${styles.navMenuLink} ${
                  activeItem === index ? styles.activee : styles.notactivee
                }`}
                key={index}
                to={link}
                onClick={() => setActiveItem(index)}
              >
                <div
                  className={`${styles.menuItem} ${
                    activeItem === index
                      ? styles.menuActive
                      : styles.menuNotActive
                  }`}
                >
                  <img src={icon} alt={text} srcSet='' />
                  <p>{text}</p>
                </div>
              </NavLink>
            ))}
          </div>
          {/* // Demo Sign in Button put this in landing page later */}
          {user === null && <DemoSignIn />}

          {isLoaded && user !== null && (
            <div className={styles.footer}>
              <UserButton />
              <div className={styles.footerUserInfo}>
                <p className={styles.fullNameText}>{user.fullName}</p>
                <p className={styles.emailText}>
                  {user.emailAddresses[0].emailAddress}
                </p>
              </div>
              <div className={styles.footerButton}>
                <button
                  className={styles.signoutButton}
                  onClick={() => signOutHandler()}
                >
                  <i className='bi bi-box-arrow-right'></i>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
