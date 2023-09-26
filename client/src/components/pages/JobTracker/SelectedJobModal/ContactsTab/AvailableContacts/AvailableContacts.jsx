import React from 'react';
import styles from './AvailableContacts.module.scss';
import ContactCard from '../ContactCard/ContactCard';

export default function AvailableContacts({
  availableContactsLoading,
  availableContacts,
  setIsLinking
}) {
  return (
    <div className={styles.container}>
      {!availableContactsLoading && availableContacts.length > 0 ? (
        <div className={styles.contactsFlex}>
          {availableContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contactInfo={contact}
              isLinkingContact={true}
              setIsLinking={setIsLinking}
            />
          ))}
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
