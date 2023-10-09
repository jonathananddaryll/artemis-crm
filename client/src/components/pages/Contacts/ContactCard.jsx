import React from 'react';

import { useDispatch } from 'react-redux';

import {
  updateContactInFocus,
  updateContactSelected
} from '../../../reducers/ContactReducer';

import styles from './ContactCard.module.scss';

export default function ContactCard(props) {
  // Each individual contactCard component is given it's unique contact data via props, not
  // from redux calls. Each business card has 'quicklinks' on it users can click for easy
  // access, and expands to a full form by clicking on 'see more'. The form allows users
  // to edit and delete contacts.

  const { contactInfo } = props;

  const name = contactInfo?.first_name + ' ' + contactInfo?.last_name;

  const dispatch = useDispatch();

  // When the user wants to see more, pass this contact info through dispatch to update redux
  // state variable for the form that's about to open up, then toggle redux state to indicate
  // a contact has been selected.
  function openCard() {
    dispatch(updateContactInFocus(contactInfo));
    dispatch(updateContactSelected());
  }

  return (
    <section className={styles.contactCard}>
      <h6 className={styles.contactInitialsLink}>
        {name[0].toUpperCase() + name.split(' ')[1][0].toUpperCase()}
      </h6>
      <div className={styles.contactFrame}>
        <section className={styles.cardHero} onClick={() => openCard()}>
          <p className={styles.contactName}>
            {name.length > 30 ? name.slice(0, 30) : name}
          </p>
          {contactInfo?.current_job_title && (
            <p className={styles.contactTitle}>
              {contactInfo.current_job_title}
            </p>
          )}
          {contactInfo?.city && (
            <p className={styles.contactLocation}>{contactInfo.city}</p>
          )}
        </section>
        <section className={styles.cardDetails} onClick={() => openCard()}>
          <div className={styles.contactInfo}>
            <div className={styles.infoText}>
              {contactInfo?.phone && (
                <a
                  className={styles.contactPhone}
                  href={`tel:${contactInfo.phone}`}
                >
                  {contactInfo.phone}
                </a>
              )}
              {contactInfo?.email && (
                <a
                  className={styles.contactEmail}
                  href={`mailto:${contactInfo.email}`}
                >
                  {contactInfo.email.length > 26
                    ? contactInfo.email.slice(0, 26) + '...'
                    : contactInfo.email}
                </a>
              )}
            </div>
            <div className={styles.socialMedias}>
              {(contactInfo.linkedin !== null || '') && (
                <button
                  type='button'
                  onClick={() => window.open(contactInfo.linkedin)}
                  className={styles.contactSocial}
                >
                  <i className='fa-brands fa-linkedin'></i>
                </button>
              )}
              {(contactInfo.instagram !== null || '') && (
                <button
                  type='button'
                  onClick={() => window.open(contactInfo.instagram)}
                  className={styles.contactSocial}
                >
                  <i className='fa-brands fa-instagram'></i>
                </button>
              )}
              {(contactInfo.twitter !== null || '') && (
                <button
                  type='button'
                  onClick={() => window.open(contactInfo.twitter)}
                  className={styles.contactSocial}
                >
                  <i className='fa-brands fa-x-twitter'></i>
                </button>
              )}
              {(contactInfo.personal_site !== null || '') && (
                <button
                  type='button'
                  onClick={() => window.open(contactInfo.personal_site)}
                  className={styles.contactSocial}
                >
                  <i className='fa-regular fa-window-maximize'></i>
                </button>
              )}
              {(contactInfo.other_social !== null || '') && (
                <button
                  type='button'
                  onClick={() => window.open(contactInfo.other_social)}
                  className={styles.contactSocial}
                >
                  <i className='fa-solid fa-link'></i>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
