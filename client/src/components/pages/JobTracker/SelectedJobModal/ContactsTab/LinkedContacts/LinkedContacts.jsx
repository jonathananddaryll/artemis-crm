import React from 'react';
import ContactCard from '../ContactCard/ContactCard';
import styles from './LinkedContacts.module.scss';

export default function LinkedContacts({
  linkedContacts,
  showAvailableContacts
}) {
  return (
    // If there are Linked Contacts
    <div className={styles.linkedContactsContainer}>
      <p className={styles.headerText}>Linked Contacts</p>
      <div className={styles.contactsFlex}>
        {linkedContacts.map(contact => (
          <ContactCard
            key={contact.id}
            contactInfo={contact}
            isLinkingContact={false}
            showAvailableContacts={showAvailableContacts}
          />
        ))}
      </div>
    </div>
  );
}
