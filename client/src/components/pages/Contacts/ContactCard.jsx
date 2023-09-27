import React, { useState, useEffect } from 'react';

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

  const name = contactInfo.first_name + ' ' + contactInfo.last_name;

  const dispatch = useDispatch();

  // When the user wants to see more, pass this contact info through dispatch to update redux
  // state variable for the form that's about to open up, then toggle redux state to indicate
  // a contact has been selected.
  function openCard() {
    dispatch(updateContactInFocus(contactInfo));
    dispatch(updateContactSelected());
  }

  return (
    <div className={styles.ContactCard}>
      <div className={styles.contactFrame}>
        <section className={styles.cardHero} onClick={() => openCard()}>
          <p className={styles.contactName}>{name}</p>
          {(contactInfo.current_job_title !== null || '') && (
            <p className={styles.contactTitle}>
              {contactInfo.current_job_title}
            </p>
          )}
          {(contactInfo.city !== null || '') && (
            <p className={styles.contactLocation}>{contactInfo.city}</p>
          )}
        </section>
        <section className={styles.cardDetails}>
          <div className={styles.contactInfo}>
            <div className={styles.infoText}>
              {(contactInfo.phone !== null || '') && (
                <a
                  className={styles.contactPhone}
                  href={`tel:${contactInfo.phone}`}
                >
                  {contactInfo.phone}
                </a>
              )}
              {(contactInfo.email !== null || '') && (
                <a
                  className={styles.contactEmail}
                  href={`mailto:${contactInfo.email}`}
                >
                  {contactInfo.email}
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
      <h2 className={styles.contactInitialsLink}>
        {contactInfo.first_name[0]}
        {contactInfo.last_name[0]}
      </h2>
    </div>
  );
}
