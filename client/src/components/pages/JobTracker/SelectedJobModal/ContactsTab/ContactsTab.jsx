import React, { useState } from 'react';
import styles from './ContactsTab.module.css';

export default function ContactsTab() {
  return (
    <div className={styles.contactsTabContainer}>
      <div className={styles.buttonsContainer}>
        <button className={styles.createContactButton}>Create Contact</button>
        <button className={styles.linkContactButton}>Link Contact</button>
      </div>
      <div className={styles.contactsContentContainer}>
        <p>no linked contacts.. make this pretty later</p>
      </div>
    </div>
  );
}
