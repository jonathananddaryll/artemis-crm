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
  const linkContactHandler = async (contactId, contactUserId) => {
    const formData = {
      contactId: contactId,
      jobId: selectedJob.id,
      contactUserId: contactUserId,
      token: await session.getToken()
    };

    dispatch(linkContact(formData));

    // reset isLinking
    setShowAvailableContacts(false);
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
            <div className={styles.socialmedias}>
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
                  <i class='fa-brands fa-x-twitter'></i>
                </a>
              )}

              {(twitter !== null || '') && (
                <a
                  className={styles.socialsIcon}
                  href={twitter}
                  target='_blank'
                >
                  <i class='fa-brands fa-instagram'></i>
                </a>
              )}

              {(personal_site !== null || '') && (
                <a
                  className={styles.socialsIcon}
                  href={personal_site}
                  target='_blank'
                >
                  <i class='fa-regular fa-window-maximize'></i>
                </a>
              )}

              {(other_social !== null || '') && (
                <a
                  className={styles.socialsIcon}
                  href={other_social}
                  target='_blank'
                >
                  <i class='fa-solid fa-hashtag'></i>
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
              onClick={() => linkContactHandler(id, user_id)}
            />
          ) : (
            <Button
              type={'button'}
              size={'xsmall'}
              value={'Unlink Contact'}
              color={'red'}
              disabled={showAvailableContacts === true}
              onClick={() => unlinkContactHandler(id, contact_id, user_id)}
            />
          )}
        </div>
      </div>
      <p className={styles.contactInitialsBackdrop}>
        {first_name[0]}
        {last_name[0]}
      </p>
    </div>

    // <div className={styles.container}>
    //   <div className={styles.flex}>
    //     <div className={styles.initialsBox}>
    //       <div className={styles.initials}>
    //         <p className={styles.initialsText}>
    //           {first_name[0]} {last_name[0]}
    //         </p>
    //       </div>
    //     </div>
    //     <div className={styles.infoBox}>
    //       <div className={styles.infoMain}>
    //         <p className={styles.nameText}>
    //           {first_name} {last_name}
    //         </p>
    //         <p className={styles.companyText}>{current_job_title}</p>
    //         <p className={styles.companyText}>{company}</p>
    //       </div>
    //       <div className={styles.infoContacts}>
    //         {phone !== null && (
    //           <p className={styles.contactText}>
    //             <i className='bi bi-telephone'></i> {phone}
    //           </p>
    //         )}
    //         {email !== null && (
    //           <p className={styles.contactText}>
    //             <i className='bi bi-envelope'></i> {email}
    //           </p>
    //         )}
    //       </div>

    //       <div className={styles.infoSocials}>
    //         {linkedin !== null && (
    //           <a href={linkedin} target='_blank'>
    //             <i className='bi bi-linkedin'></i>
    //           </a>
    //         )}
    //         {twitter !== null && (
    //           <a href={twitter} target='_blank'>
    //             <i className='bi bi-twitter'></i>
    //           </a>
    //         )}
    //         {instagram !== null && (
    //           <a href={instagram} target='_blank'>
    //             <i className='bi bi-instagram'></i>
    //           </a>
    //         )}
    //         {other_social !== null && (
    //           <a href={other_social} target='_blank'>
    //             <i className='bi bi-browser-chrome'></i>
    //           </a>
    //         )}
    //         {personal_site !== null && (
    //           <a href={personal_site} target='_blank'>
    //             <i className='bi bi-code-square'></i>
    //           </a>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div className={styles.buttonContainer}>
    //     {isLinkingContact ? (
    //       <Button
    //         type={'button'}
    //         size={'small'}
    //         value={'Link Contact'}
    //         color={'green'}
    //         onClick={() => linkContactHandler(id, user_id)}
    //       />
    //     ) : (
    //       <Button
    //         type={'button'}
    //         size={'small'}
    //         value={'Unlink Contact'}
    //         color={'red'}
    //         disabled={showAvailableContacts === true}
    //         onClick={() => unlinkContactHandler(id, contact_id, user_id)}
    //       />
    //     )}
    //   </div>
    // </div>
  );
}

// {isLinkingContact ? (
//   <button onClick={() => linkContactHandler(id, user_id)}>Link</button>
// ) : (
//   <button onClick={() => unlinkContactHandler(id, contact_id, user_id)}>
//     Unlink
//   </button>
// )}
