import React from 'react';
import styles from './AvailableContacts.module.scss';
import ContactCard from '../ContactCard/ContactCard';
import Loader from '../../../../../layout/Loader/Loader';
import Button from '../../../../../layout/Button/Button';
import loadingInfinity from '../../../../../../assets/loadingInfinity.gif';

export default function AvailableContacts({
  availableContactsLoading,
  availableContacts,
  setIsLinking
}) {
  return (
    <div className={styles.container}>
      {availableContactsLoading ? (
        // <p>available contacts are loading</p>
        <Loader
          text={'Available Contacts are loading'}
          img={loadingInfinity}
          altText={'loading_available_contacts'}
          imageStyle={1}
          textStyle={2}
        />
      ) : (
        <>
          {availableContacts.length > 0 ? (
            <div className={styles.availableContactsContainer}>
              <p className={styles.headerText}>Available Contacts To Link</p>
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
            </div>
          ) : (
            <div>
              <p>No Available Contacts to Link</p>
            </div>
          )}
          <div className={styles.buttonContainer}>
            <Button
              type={'button'}
              size={'large'}
              value={'Cancel'}
              color={'white'}
              onClick={() => setIsLinking(false)}
            />

            {/* <button onClick={() => setIsLinking(false)}>Cancel</button> */}
          </div>
        </>
      )}
    </div>
  );
}
