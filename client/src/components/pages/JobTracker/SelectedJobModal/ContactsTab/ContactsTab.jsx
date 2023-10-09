import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession, useAuth } from '@clerk/clerk-react';
import { getContactsToLink } from '../../../../../reducers/SelectedJobReducer';
import Button from '../../../../layout/Button/Button';
import AvailableContacts from './AvailableContacts/AvailableContacts';
import LinkedContacts from './LinkedContacts/LinkedContacts';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noContacts from '../../../../../assets/nocontacts.svg';
import styles from './ContactsTab.module.scss';

export default function ContactsTab() {
  const {
    linkedContacts,
    availableContacts,
    availableContactsLoading,
    linkedContactsLoading
  } = useSelector(state => ({
    ...state.selectedJob
  }));
  const dispatch = useDispatch();
  const { session } = useSession();
  const { userId } = useAuth();
  const [showAvailableContacts, setShowAvailableContacts] = useState(false);

  // Gets contacts available to link
  const showUserContacts = async () => {
    setShowAvailableContacts(true);

    const token = await session.getToken();
    getContactsToLink;
    dispatch(getContactsToLink({ user_id: userId, token: token }));
  };

  return (
    <div className={styles.contactsTabContainer}>
      <div className={styles.buttonsContainer}>
        {!showAvailableContacts && (
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
        {showAvailableContacts && (
          <AvailableContacts
            availableContactsLoading={availableContactsLoading}
            availableContacts={availableContacts}
            setShowAvailableContacts={setShowAvailableContacts}
          />
        )}

        {!linkedContactsLoading && linkedContacts.length > 0 ? (
          <LinkedContacts
            linkedContacts={linkedContacts}
            showAvailableContacts={showAvailableContacts}
          />
        ) : (
          <>
            {!showAvailableContacts && (
              <NoDataPlaceholder
                image={noContacts}
                header={'NO LINKED CONTACTS'}
                subHeader={'Here you can create and link contacts'}
              />
            )}
          </>
        )}

        {/* {!showAvailableContacts &&
          linkedContacts.length === 0 &&
          !linkedContactsLoading && (
            <NoDataPlaceholder
              image={noContacts}
              header={'NO LINKED CONTACTS'}
              subHeader={'Here you can create and link contacts'}
            />
          )} */}
      </div>
    </div>
  );
}
