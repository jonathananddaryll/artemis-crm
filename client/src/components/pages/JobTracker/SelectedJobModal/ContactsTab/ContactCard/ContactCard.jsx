import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import {
  linkContact,
  unlinkContact
} from '../../../../../../reducers/SelectedJobReducer';
import styles from './ContactCard.module.scss/';

export default function ContactCard({
  contactInfo,
  isLinkingContact,
  setIsLinking
}) {
  const { selectedJob } = useSelector(state => ({
    ...state.board
  }));
  const dispatch = useDispatch();
  const { session } = useSession();
  const {
    id,
    contact_id,
    user_id,
    first_name,
    last_name,
    company,
    city,
    current_job_title,
    phone,
    email,
    linkedin,
    twitter,
    instagram,
    other_social,
    personal_site
  } = contactInfo;

  // Handles the link contact action
  const linkContactHandler = async (contactId, contactUserId) => {
    const formData = {
      contactId: contactId,
      jobId: selectedJob.id,
      contactUserId: contactUserId,
      token: await session.getToken()
    };

    dispatch(linkContact(formData));

    // reset isLinking
    setIsLinking(false);
  };

  // Handles the unlink contact action
  const unlinkContactHandler = async (jcId, contactId, contactUserId) => {
    const formData = {
      id: jcId,
      contactId: contactId,
      jobId: selectedJob.id,
      contactUserId: contactUserId,
      token: await session.getToken()
    };

    dispatch(unlinkContact(formData));
  };

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <div className={styles.initialsBox}>
          <div className={styles.initials}>
            <p className={styles.initialsText}>
              {first_name[0]} {last_name[0]}
            </p>
          </div>
        </div>
        <div className={styles.infoBox}>
          <p className={styles.nameText}>
            {first_name} {last_name}
          </p>
          <p className={styles.companyText}>{current_job_title}</p>
          <p className={styles.companyText}>{company}</p>
          {phone !== null && (
            <p className={styles.contactText}>
              <i className='bi bi-telephone'></i> {phone}
            </p>
          )}
          {email !== null && (
            <p className={styles.contactText}>
              <i className='bi bi-envelope'></i> {email}
            </p>
          )}
          <div className={styles.socialsBox}>
            {linkedin !== null && <i className='bi bi-linkedin'></i>}
            {twitter !== null && <i className='bi bi-twitter-x'></i>}
            {instagram !== null && <i className='bi bi-instagram'></i>}
            {other_social !== null && <i className='bi bi-browser-chrome'></i>}
            {personal_site !== null && <i className='bi bi-code-square'></i>}
          </div>
        </div>
      </div>
      {isLinkingContact ? (
        <button onClick={() => linkContactHandler(id, user_id)}>Link</button>
      ) : (
        <button onClick={() => unlinkContactHandler(id, contact_id, user_id)}>
          Unlink
        </button>
      )}
    </div>
  );
}
