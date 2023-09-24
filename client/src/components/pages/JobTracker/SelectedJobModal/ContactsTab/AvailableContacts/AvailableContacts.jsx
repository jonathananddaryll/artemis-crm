import React from 'react';
import styles from './AvailableContacts.module.scss';
import ContactCard from '../ContactCard/ContactCard';

export default function AvailableContacts({
  availableContactsLoading,
  availableContacts,
  setIsLinking,
  linkContactHandler
}) {
  return (
    <div className={styles.container}>
      {!availableContactsLoading && availableContacts.length > 0 ? (
        <div>
          {availableContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contactInfo={contact}
              showButton={true}
              linkContactHandler={linkContactHandler}
            />
          ))}
          {/* <div key={contact.id}>
              <p>
                {contact.first_name} {contact.last_name}
              </p>
              <button
                onClick={() => linkContactHandler(contact.id, contact.user_id)}
              >
                Link contact
              </button>
            </div> */}
          {/* ))} */}
        </div>
      ) : (
        <div>
          <p>No Available Contacts to Link</p>
        </div>
      )}
      <button onClick={() => setIsLinking(false)}>Cancel</button>
    </div>
  );
}
