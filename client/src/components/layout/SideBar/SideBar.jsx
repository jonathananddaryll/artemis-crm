import React, { useState, useEffect } from 'react';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useClerk, UserButton, useAuth, useUser } from '@clerk/clerk-react';
import DemoSignIn from '../DemoSignIn/DemoSignIn';
import styles from './SideBar.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

export default function SideBar() {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeItem, setActiveItem] = useState(0);
  const [initialX, setInitialX] = useState(activeItem);

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
      text: 'Boards',
      icon: 'clipboard-outline',
      link: '/boards'
    },
    {
      index: 2,
      text: 'Contacts',
      icon: 'call-outline',
      link: '/contacts'
    },
    {
      index: 3,
      text: 'Documents',
      icon: 'document-outline',
      link: '/documents'
    },
    {
      index: 4,
      text: 'Reminders',
      icon: 'notifications-outline',
      link: '/reminders'
    },
    {
      index: 5,
      text: 'Settings',
      icon: 'settings-outline',
      link: '/settings'
    }
  ];

  useEffect(() => {
    const curr = location.pathname.split('/')[1];

    const setActiveLink = () => {
      if (curr === 'boards') setActiveItem(1);
      if (curr === 'contacts') setActiveItem(2);
      if (curr === 'documents') setActiveItem(3);
      if (curr === 'reminders') setActiveItem(4);
      if (curr === 'settings') setActiveItem(5);
    };

    setActiveLink();
  }, []);

  const navigate = useNavigate();

  const signOutHandler = () => {
    signOut();
    navigate('/');
  };

  return (
    <>
      {location.pathname !== '/' && (
        <AnimatePresence mode='wait'>
          <div className={styles.navContainer}>
            <div className={styles.navHeading}>
              <div className={styles.navBrand}>
                <img src='/icons/deer.png' className={styles.logoImage} />
                <h2 className={styles.logoText}>Artemis</h2>
              </div>
            </div>
            <ul className={styles.navMenu}>
              {menuItems.map(({ index, text, icon, link }) => (
                <li
                  key={index}
                  className={`${styles.menuItem} ${styles.menuItemDesktop} ${
                    activeItem === index && styles.activeDesktop
                  } ${activeItem === index && styles.active}`}
                >
                  <NavLink
                    className={styles.navMenuLink}
                    key={index}
                    to={link}
                    onClick={() => setActiveItem(index)}
                  >
                    <span className={styles.menuIcon}>
                      <ion-icon name={icon}></ion-icon>
                    </span>
                    <span className={styles.menuText}>{text}</span>
                  </NavLink>
                  {/* <div className={styles.indicatora}></div> */}

                  {activeItem === index ? (
                    <motion.div
                      className={styles.indicatora}
                      layoutId='indicators'
                    ></motion.div>
                  ) : null}
                </li>
              ))}
            </ul>
            {/* // Demo Sign in Button put this in landing page later */}
            {user === null && <DemoSignIn />}

            {isLoaded && user !== null && (
              <div className={styles.footer}>
                {user.emailAddresses[0].emailAddress !==
                  'artemisdemoacc@gmail.com' && <UserButton />}
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
        </AnimatePresence>
      )}
    </>
  );
}
