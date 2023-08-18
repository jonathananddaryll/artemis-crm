import React, { useState } from 'react';
import styles from './ContactsTab.module.scss';
import Button from '../../../../layout/Button/Button';

export default function ContactsTab() {
  return (
    <div className={styles.contactsTabContainer}>
      <div className={styles.buttonsContainer}>
        <Button value={'Create Contact'} color={'blue'} />
        <Button value={'Link Contact'} color={'blue'} />
      </div>
      <div className={styles.contactsContentContainer}>
        <p>no linked contacts.. make this pretty later</p>
      </div>
    </div>
  );
}
