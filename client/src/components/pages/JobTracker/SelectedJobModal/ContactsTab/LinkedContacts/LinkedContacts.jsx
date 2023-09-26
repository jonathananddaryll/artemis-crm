import React from 'react';
import ContactCard from '../ContactCard/ContactCard';
import styles from './LinkedContacts.module.scss';

export default function LinkedContacts({ linkedContacts }) {
  return (
    // If there are Linked Contacts
    <div className={styles.linkedContactsContainer}>
      <h4>LINKED CONTACTS</h4>
      <div className={styles.contactsFlex}>
        {linkedContacts.map(contact => (
          <ContactCard
            key={contact.id}
            contactInfo={contact}
            isLinkingContact={false}
          />
        ))}
      </div>
    </div>
  );
}
