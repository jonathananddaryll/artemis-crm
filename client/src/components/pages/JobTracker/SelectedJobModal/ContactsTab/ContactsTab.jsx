import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession, useAuth } from '@clerk/clerk-react';

import Button from '../../../../layout/Button/Button';
import ContactCard from './ContactCard/ContactCard';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noContacts from '../../../../../assets/nocontacts.svg';
import styles from './ContactsTab.module.scss';

export default function ContactsTab({
  getContactsToLink,
  linkContact,
  jobId,
  linkedContacts,
  linkedContactsLoading,
  availableContacts,
  availableContactsLoading
}) {
  const dispatch = useDispatch();
  const { session } = useSession();
  const { userId } = useAuth();
  const [isLinking, setIsLinking] = useState(false);

  // // in contactspage, have a conditional so it doesnt re renders every time a user visit that page even if the contacts are previously loaded
  // useEffect(() => {
  //   const getContacts = async () => {
  //     const token = await session.getToken();
  //     getContactsToLink;
  //     dispatch(getContactsToLink({ user_id: userId, token: token }));
  //   };

  //   // if (contactsLoading) {
  //   getContacts();
  //   // }
  // }, []);

  // useEffect(() => {
  //   console.log('useeffect triggered');
  //   dispatch(getAllLinkedContactsWithJobId(jobId));
  // }, []);

  // Gets contacts available to link
  const showUserContacts = async () => {
    setIsLinking(true);

    const token = await session.getToken();
    getContactsToLink;
    dispatch(getContactsToLink({ user_id: userId, token: token }));
  };

  // Handles the link contact action
  const linkContactHandler = async (contactId, contactUserId) => {
    const formData = {
      contactId: contactId,
      jobId: jobId,
      contactUserId: contactUserId,
      token: await session.getToken()
    };

    dispatch(linkContact(formData));
    console.log('ayooooooooo contact linked');
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
        {/* <Button
          type={'button'}
          value={'Create Contact'}
          color={'blue'}
          size={'small'}
        /> */}
      </div>
      <div className={styles.contactsContentContainer}>
        {isLinking && (
          <div>
            {!availableContactsLoading && availableContacts.length > 0 ? (
              <div>
                {/* <p>theres contacts</p> */}
                {availableContacts.map(contact => (
                  <div key={contact.id}>
                    <p>
                      {contact.first_name} {contact.last_name}
                    </p>
                    <button
                      onClick={() =>
                        linkContactHandler(contact.id, contact.user_id)
                      }
                    >
                      Link contact
                    </button>
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
        {!linkedContactsLoading ? (
          <>
            {linkedContacts.length > 0 ? (
              // If there are Linked Contacts
              <div className={styles.linkedContactsContainer}>
                <h4>LINKED CONTACTS</h4>
                <div className={styles.contactsFlex}>
                  {linkedContacts.map(contact => (
                    <ContactCard key={contact.id} contactInfo={contact} />
                    // <div key={contact.id}>
                    //   <p>
                    //     {contact.first_name} {contact.last_name}
                    //   </p>
                    // </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* No Linked Contacts and not linking */}
                {!isLinking && (
                  <NoDataPlaceholder
                    image={noContacts}
                    header={'NO LINKED CONTACTS'}
                    subHeader={'Here you can create and link contacts'}
                  />
                )}
              </>
            )}
          </>
        ) : (
          // Change this to a loader later
          <p>LINKED CONTACTS LOADING</p>
        )}
      </div>
    </div>
  );
}
