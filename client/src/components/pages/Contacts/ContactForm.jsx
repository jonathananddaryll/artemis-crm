import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth, useSession } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  deleteContact,
  updateContact,
  createContact,
  updateContactInFocus,
  updateContactSelected
} from '../../../reducers/ContactReducer';
import Button from '../../layout/Button/Button';

import styles from './ContactForm.module.scss';

import timeSince from '../../../helpers/convertDate';

export default function ContactForm({ newContactStaging }) {
  // All-purpose contact form, is used for create, update, delete and read for all fields except
  // for the immutables (created timestamp, id, etc)

  const { session } = useSession();
  const { userId } = useAuth();
  const dispatch = useDispatch();

  // The contact the user is currently dealing with is the contactInFocus(new or existing)
  const contactInFocus = useSelector(state => state.contact.contactInFocus);
  // If a new contact, automatically set to edit mode on initialization
  const formEditOnLoad = newContactStaging ? true : false;
  // Edit mode is initialized to true or false based on newContactStaging
  const [isEditing, setIsEditing] = useState(formEditOnLoad);
  // updatedColumns is a weak optimization for telling which fields have been changed.
  const [updatedColumns, setUpdatedColumns] = useState([]);
  // The local copy of the contact information
  const [contactForm, setContactForm] = useState({
    first_name: null,
    last_name: null,
    company: null,
    current_job_title: null,
    city: null,
    phone: null,
    email: null,
    linkedin: null,
    twitter: null,
    instagram: null,
    other_social: null,
    personal_site: null,
    linked_job_opening: null
  });

  // This can be used for new contacts or for updating existing ones, so there are
  // two logic branches. Different branch calls a different async thunk and uses
  // different headers and parameters.
  async function submitUpdate(e) {
    e.preventDefault();
    const updatedValues = [];
    // only the fields that have been changed will be added to the query.
    // can't tell the difference between multiple edits resulting in the original
    // string, but it's an easy optimization.
    if (updatedColumns.length > 0) {
      updatedColumns.map(element => updatedValues.push(contactForm[element]));
      if (newContactStaging) {
        const filledFields = {};
        for (
          let eachField = 0;
          eachField < updatedColumns.length;
          eachField++
        ) {
          filledFields[updatedColumns[eachField]] = updatedValues[eachField];
        }
        const createForm = {
          ...filledFields,
          token: await session.getToken()
        };
        dispatch(createContact(createForm));
      } else {
        const updateForm = {
          user_id: userId,
          updateWhat: updatedColumns,
          updateTo: updatedValues,
          token: await session.getToken(),
          id: contactForm.id
        };
        dispatch(updateContact(updateForm));
        const newVersion = { ...contactInFocus, ...contactForm };
        dispatch(updateContactInFocus(newVersion));
      }
      setIsEditing(false);
    }
  }

  // Keeps the form in the loop with redux state
  function onChangeHandler(e) {
    const { name, value, type, checked } = e.target;
    setContactForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (!updatedColumns.includes(name)) {
      setUpdatedColumns(prevColumns => [...prevColumns, name]);
    }
  }

  // If the user clicks out or intends to cancel the whole thing
  function exitForm(event) {
    if (
      event.target.className.includes('wrapper') ||
      event.target.className.includes('closeButton')
    ) {
      if (!updatedColumns.length) {
        dispatch(updateContactInFocus({}));
        setIsEditing(false);
        dispatch(updateContactSelected());
      } else {
        // show the prompt, let the prompt send the same actions if user decides to
        // "You have unsaved changes, etc etc"
        dispatch(updateContactInFocus({}));
        setIsEditing(false);
        dispatch(updateContactSelected());
      }
    }
  }

  // Since it could be a new contact or an existing, again there are two logic branches
  // for deleting the contact currently accessed in the form
  const deleteContactStart = async () => {
    if (!contactForm.id) {
      // it's a new contact, just clear the form
      dispatch(updateContactInFocus({}));
      setContactForm(contactInFocus);
    } else {
      // it's a real contact, delete it
      const formData = {
        id: contactForm.id,
        token: await session.getToken()
      };
      dispatch(deleteContact(formData));
    }
  };

  // Depending on whether or not the contact is a new one or an existing one, make sure
  // This is for when the user is looking at an existing contact.
  useEffect(() => {
    setContactForm(contactInFocus);
  }, [newContactStaging]);

  // for modal backdrop motionframer
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const modal = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: { delay: 0.1 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.wrapper}
        variants={backdrop}
        initial='hidden'
        animate='visible'
        onClick={e => exitForm(e)}
      >
        <motion.div
          className={styles.modal}
          variants={modal}
          initial='hidden'
          animate='visible'
        >
          <div className={styles.formHeader}>
            <p className={styles.headerText}>Contact Form</p>

            {/* <button className={styles.closeButton} onClick={e => exitForm(e)}>
              <i className='bi bi-x-lg'></i>
            </button> */}
          </div>

          <div
            // name='contactForm'
            className={styles.formContainer}
            variants={modal}
            initial='hidden'
            animate='visible'
          >
            {/* <div className={styles.manage}> */}
            {/* <button
          className={isEditing ? styles.notEditable : styles.editable}
          type='button'
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className={isEditing ? styles.editsMade : styles.editsSaved}
          type='button'
          onClick={submitUpdate}
        >
          Save
        </button>
        <button
          className={
            !contactForm.id ? styles.createInProgress : styles.deleteButton
          }
          type='button'
          onClick={deleteContactStart}
        >
          Delete
        </button> */}
            {/* </div> */}
            <form name='contactForm'>
              {contactForm.date_created && (
                <p className={styles.dateCreatedText}>
                  Added {timeSince(contactForm.date_created)}
                </p>
              )}
              <div className={styles.formFlex}>
                <div className={`${styles.formGroup} ${styles.flex2}`}>
                  <label className={styles.formLabels}>First Name</label>
                  <input
                    type='text'
                    name='first_name'
                    value={contactForm.first_name ?? ''}
                    placeholder='first name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    required
                    readOnly={!isEditing}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.flex2}`}>
                  <label className={styles.formLabels}>Last Name </label>
                  <input
                    type='text'
                    name='last_name'
                    value={contactForm.last_name ?? ''}
                    placeholder='last name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    required
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className={styles.formFlex}>
                <div className={`${styles.formGroup} ${styles.flex3}`}>
                  <label className={styles.formLabels}>Company </label>
                  <input
                    type='text'
                    name='company'
                    value={contactForm.company ?? ''}
                    placeholder='company'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.flex3}`}>
                  <label className={styles.formLabels}>
                    Current Job Title{' '}
                  </label>
                  <input
                    type='text'
                    name='current_job_title'
                    value={contactForm.current_job_title ?? ''}
                    placeholder='title'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.flex3}`}>
                  <label className={styles.formLabels}>City </label>
                  <input
                    type='text'
                    name='city'
                    value={contactForm.city ?? ''}
                    placeholder='city'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className={styles.formFlex}>
                <div className={`${styles.formGroup} ${styles.flex3}`}>
                  <label className={styles.formLabels}>Phone </label>
                  <input
                    type='tel'
                    name='phone'
                    value={contactForm.phone ?? ''}
                    placeholder='Add contact phone'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.flex3}`}>
                  <label className={styles.formLabels}>Email </label>
                  <input
                    type='email'
                    name='email'
                    value={contactForm.email ?? ''}
                    placeholder='Add contact email'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    readOnly={!isEditing}
                  />
                </div>
                <div
                  className={`${styles.formGroup} ${styles.formGroupSelect} ${styles.flex3}`}
                >
                  <div className={styles.checkGroup}>
                    <input
                      type='checkbox'
                      name='is_priority'
                      checked={contactForm.is_priority}
                      onChange={e => onChangeHandler(e)}
                      className={styles.checksInput}
                      readOnly={!isEditing}
                    />
                    <label className={styles.formLabels}>Make a priority</label>
                  </div>
                </div>
              </div>

              <div className={styles.socials}>
                <div className={styles.formGroup2}>
                  <label className={styles.socialLabel}>
                    <ion-icon name='logo-linkedin'></ion-icon>
                  </label>
                  <input
                    type='url'
                    name='linkedin'
                    value={contactForm.linkedin ?? ''}
                    placeholder='linkedin handle'
                    onChange={e => onChangeHandler(e)}
                    className={styles.socialsInput}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={styles.formGroup2}>
                  <label className={styles.socialLabel}>
                    <ion-icon name='logo-twitter'></ion-icon>{' '}
                  </label>
                  <input
                    type='url'
                    name='twitter'
                    value={contactForm.twitter ?? ''}
                    placeholder='twitter handle'
                    onChange={e => onChangeHandler(e)}
                    className={styles.socialsInput}
                    readOnly={!isEditing}
                  />
                </div>

                <div className={styles.formGroup2}>
                  <label className={styles.socialLabel}>
                    <ion-icon name='logo-instagram'></ion-icon>{' '}
                  </label>
                  <input
                    type='url'
                    name='instagram'
                    value={contactForm.instagram ?? ''}
                    placeholder='instagram handle'
                    onChange={e => onChangeHandler(e)}
                    className={styles.socialsInput}
                    readOnly={!isEditing}
                  />
                </div>

                <div className={styles.formGroup2}>
                  <label className={styles.socialLabel}>
                    <ion-icon name='link-outline'></ion-icon>
                  </label>
                  <input
                    type='url'
                    name='other_social'
                    value={contactForm.other_social ?? ''}
                    placeholder='other social media'
                    onChange={e => onChangeHandler(e)}
                    className={styles.socialsInput}
                    readOnly={!isEditing}
                  />
                </div>
                <div className={styles.formGroup2}>
                  <label className={styles.socialLabel}>
                    <ion-icon name='link-outline'></ion-icon>
                  </label>
                  <input
                    type='url'
                    name='personal_site'
                    value={contactForm.personal_site ?? ''}
                    placeholder='personal website'
                    onChange={e => onChangeHandler(e)}
                    className={styles.socialsInput}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              {/* 
        // connect your contact to a job from inside contacts organizer
        <div className={styles.connectedJob}>
          <label className={styles.formLabels}>
            related job
            <input
              type='text'
              name='linked_job_opening'
              value={contactForm.linked_job_opening ?? ''}
              placeholder='Add contact name'
              onChange={e => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
              />
            </label>
            </div> */}
              <div className={styles.manage}>
                <button
                  className={isEditing ? styles.notEditable : styles.editable}
                  type='button'
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className={isEditing ? styles.editsMade : styles.editsSaved}
                  type='button'
                  onClick={submitUpdate}
                >
                  Save
                </button>
                <button
                  className={
                    !contactForm.id
                      ? styles.createInProgress
                      : styles.deleteButton
                  }
                  type='button'
                  onClick={deleteContactStart}
                >
                  Delete
                </button>
              </div>
              {/* <div className={styles.manage}>
                <Button
                  type={'button'}
                  value={'Edit'}
                  color={'green'}
                  onClick={() => setIsEditing(true)}
                />

                <Button
                  type={'button'}
                  value={'Save'}
                  color={'blue'}
                  onClick={submitUpdate}
                />

                <Button
                  type={'button'}
                  value={'Delete'}
                  color={'red'}
                  onClick={deleteContactStart}
                />
              </div> */}
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
