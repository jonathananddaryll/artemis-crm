import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession, useAuth } from '@clerk/clerk-react';

import { getContactsToLink } from '../../../../../reducers/SelectedJobReducer';

import Button from '../../../../layout/Button/Button';
import AvailableContacts from './AvailableContacts/AvailableContacts';
import LinkedContacts from './LinkedContacts/LinkedContacts';

import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noContacts from '../../../../../assets/nocontacts.svg';
import styles from './ContactsTab.module.scss';

export default function ContactsTab({ jobId }) {
  const { linkedContacts, availableContacts, availableContactsLoading } =
    useSelector(state => ({
      ...state.selectedJob
    }));
  const dispatch = useDispatch();
  const { session } = useSession();
  const { userId } = useAuth();
  const [isLinking, setIsLinking] = useState(false);

  // Maybe have a backup like this runs if the initial run from SelectedJobModal useEffect doesnt load all the contacts
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
          <AvailableContacts
            availableContactsLoading={availableContactsLoading}
            availableContacts={availableContacts}
            setIsLinking={setIsLinking}
          />
        )}

        {linkedContacts.length > 0 && (
          <LinkedContacts linkedContacts={linkedContacts} />
        )}

        {!isLinking && linkedContacts.length === 0 && (
          <NoDataPlaceholder
            image={noContacts}
            header={'NO LINKED CONTACTS'}
            subHeader={'Here you can create and link contacts'}
          />
        )}
      </div>
    </div>
  );
}
