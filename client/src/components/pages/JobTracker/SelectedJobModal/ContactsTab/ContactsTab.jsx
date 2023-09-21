import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession, useAuth } from '@clerk/clerk-react';

import Button from '../../../../layout/Button/Button';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noContacts from '../../../../../assets/nocontacts.svg';
import styles from './ContactsTab.module.scss';

export default function ContactsTab({
  contactsCache,
  contactsLoading,
  getUserContactsTable
}) {
  const dispatch = useDispatch();
  const { session } = useSession();
  const { userId } = useAuth();
  const [isLinking, setIsLinking] = useState(false);

  // in contactspage, have a conditional so it doesnt re renders every time a user visit that page even if the contacts are previously loaded
  // useEffect(() => {
  //   const getContacts = async () => {
  //     const token = await session.getToken();
  //     getUserContactsTable;
  //     dispatch(getUserContactsTable({ user_id: userId, token: token }));
  //   };

  //   if (contactsLoading) {
  //     getContacts();
  //   }
  // }, []);

  // Gets contacts
  const showUserContacts = async () => {
    setIsLinking(true);
    if (contactsLoading) {
      const token = await session.getToken();
      getUserContactsTable;
      dispatch(getUserContactsTable({ user_id: userId, token: token }));
    }
  };

  return (
    <div className={styles.contactsTabContainer}>
      <div className={styles.buttonsContainer}>
        {!isLinking && (
          <Button
            type={'button'}
            value={'Link Contact'}
            color={'white'}
            size={'small'}
            onClick={() => showUserContacts()}
          />
        )}
        <Button
          type={'button'}
          value={'Create Contact'}
          color={'blue'}
          size={'small'}
        />
      </div>
      <div className={styles.contactsContentContainer}>
        {isLinking && (
          <div>
            {!contactsLoading && contactsCache.length > 0 ? (
              <div>
                <p>theres contacts</p>
                {contactsCache.map(contact => (
                  <div>
                    <p>
                      {contact.first_name} {contact.last_name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p>no contacts</p>
              </div>
            )}
            <button onClick={() => setIsLinking(false)}>Cancel</button>
          </div>
        )}
        {/* <NoDataPlaceholder
          image={noContacts}
          header={'NO LINKED CONTACTS'}
          subHeader={'Here you can create and link contacts'}
        /> */}
      </div>
    </div>
  );
}
