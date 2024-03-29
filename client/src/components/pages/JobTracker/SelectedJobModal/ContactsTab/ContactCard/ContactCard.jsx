import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import {
  linkContact,
  unlinkContact
} from '../../../../../../reducers/SelectedJobReducer';
import Button from '../../../../../layout/Button/Button';
import styles from './ContactCard.module.scss/';

export default function ContactCard({
  contactInfo,
  isLinkingContact,
  setShowAvailableContacts,
  showAvailableContacts
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
  const linkContactHandler = async (
    contactId,
    contactUserId,
    firstName,
    lastName
  ) => {
    const formData = {
      contactId: contactId,
      jobId: selectedJob.id,
      contactUserId: contactUserId,
      token: await session.getToken(),
      timelineDescription: `Linked ${
        firstName.charAt(0).toUpperCase() + firstName.slice(1)
      } ${lastName.charAt(0).toUpperCase() + lastName.slice(1)} to this job`
    };

    dispatch(linkContact(formData));

    // reset isLinking
    setShowAvailableContacts(false);
  };

  // Handles the unlink contact action
  const unlinkContactHandler = async (
    jcId,
    contactId,
    contactUserId,
    firstName,
    lastName
  ) => {
    const formData = {
      id: jcId,
      contactId: contactId,
      jobId: selectedJob.id,
      contactUserId: contactUserId,
      token: await session.getToken(),
      timelineDescription: `Unlinked ${
        firstName.charAt(0).toUpperCase() + firstName.slice(1)
      } ${lastName.charAt(0).toUpperCase() + lastName.slice(1)} to this job`
    };

    dispatch(unlinkContact(formData));
  };

  return (
    <div className={styles.contactCard}>
      <div className={styles.contactFrame}>
        <section className={styles.cardHero}>
          <p className={styles.nameText}>
            {first_name} {last_name}
          </p>
          {(current_job_title !== null || '') && (
            <p className={styles.titleText}>{current_job_title}</p>
          )}
          {(city !== null || '') && (
            <p className={styles.locationText}>{city}</p>
          )}
        </section>
        <section className={styles.cardDetails}>
          <div className={styles.contactInfo}>
            <div className={styles.infoText}>
              {(phone !== null || '') && (
                <a className={styles.phoneText} href={`tel:${phone}`}>
                  {phone}
                </a>
              )}
              {(email !== null || '') && (
                <a className={styles.emailText} href={`mailto:${email}`}>
                  {email}
                </a>
              )}
            </div>
            <div className={styles.socialMedias}>
              {(linkedin !== null || '') && (
                <a
                  className={styles.socialsIcon}
                  href={linkedin}
                  target='_blank'
                >
                  <i className='fa-brands fa-linkedin'></i>
                </a>
              )}
              {(instagram !== null || '') && (
                <a
                  className={styles.socialsIcon}
                  href={instagram}
                  target='_blank'
                >
                  <i className='fa-brands fa-instagram'></i>
                </a>
              )}
              {(twitter !== null || '') && (
                <a
                  className={styles.socialsIcon}
                  href={twitter}
                  target='_blank'
                >
                  <i className='fa-brands fa-x-twitter'></i>
                </a>
              )}
              {(personal_site !== null || '') && (
                <a
                  className={styles.socialsIcon}
                  href={personal_site}
                  target='_blank'
                >
                  <i className='fa-regular fa-window-maximize'></i>
                </a>
              )}
              {(other_social !== null || '') && (
                <a
                  className={styles.socialsIcon}
                  href={other_social}
                  target='_blank'
                >
                  <i className='fa-solid fa-hashtag'></i>
                </a>
              )}
            </div>
          </div>
        </section>
        <div className={styles.buttonContainer}>
          {isLinkingContact ? (
            <Button
              type={'button'}
              size={'xsmall'}
              value={'Link Contact'}
              color={'green'}
              onClick={() =>
                linkContactHandler(id, user_id, first_name, last_name)
              }
            />
          ) : (
            <Button
              type={'button'}
              size={'xsmall'}
              value={'Unlink Contact'}
              color={'red'}
              disabled={showAvailableContacts === true}
              onClick={() =>
                unlinkContactHandler(
                  id,
                  contact_id,
                  user_id,
                  first_name,
                  last_name
                )
              }
            />
          )}
        </div>
      </div>
      <p className={styles.contactInitialsBackdrop}>
        {first_name[0]}
        {last_name[0]}
      </p>
    </div>
  );
}
