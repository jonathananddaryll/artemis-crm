import React from 'react';
import Button from '../../../../layout/Button/Button';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noContacts from '../../../../../assets/nocontacts.svg';
import styles from './ContactsTab.module.scss';

export default function ContactsTab() {
  return (
    <div className={styles.contactsTabContainer}>
      <div className={styles.buttonsContainer}>
        <Button
          type={'button'}
          value={'Link Contact'}
          color={'white'}
          size={'small'}
        />
        <Button
          type={'button'}
          value={'Create Contact'}
          color={'blue'}
          size={'small'}
        />
      </div>
      <div className={styles.contactsContentContainer}>
        <NoDataPlaceholder
          image={noContacts}
          header={'NO LINKED CONTACTS'}
          subHeader={'Here you can create and link contacts'}
        />
      </div>
    </div>
  );
}
