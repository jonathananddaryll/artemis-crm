import React from 'react';
import styles from './ContactCard.module.scss/';

export default function ContactCard({ contactInfo }) {
  const {
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
          <p className={styles.companyText}>
            {company} - {current_job_title}
          </p>
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
    </div>
  );
}
