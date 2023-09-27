import React from 'react';
import styles from './TapBar.module.scss/';

export default function TapBar() {
  return (
    <div className={styles.tabBarContainer}>
      <div className={styles.navItems}>
        <div className={styles.navItem}>
          <i class='bi bi-person'></i>
        </div>
        <div className={styles.navItem}>
          <i class='bi bi-person'></i>
        </div>
        <div className={styles.navItem}>
          <i class='bi bi-person'></i>
        </div>
        <div className={styles.navItem}>
          <i class='bi bi-person'></i>
        </div>
      </div>
    </div>
  );
}
