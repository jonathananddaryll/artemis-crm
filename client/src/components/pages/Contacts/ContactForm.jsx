import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  deleteContact,
  updateContact,
  updateContactInFocus,
  updateContactSelected,
  setNewContactStaging,
} from "../../../reducers/ContactReducer";

import { useAuth } from "@clerk/clerk-react";

import Dropdown from "./Dropdown";
import styles from "./ContactForm.module.scss";

export default function ContactForm() {
  const { userId, getToken } = useAuth();
  const dispatch = useDispatch();

  const newContactStaging = useSelector(
    (state) => state.contact.newContactStaging
  );
  const contactInFocus = useSelector(
    (state) => state.contact.contactInFocus
  );

  // When disallowing edits on a form, I need to tell the difference between a new contact,
  // and updating an already existing contact, as the form needs to be changed.
  // There needs to be two versions of style for the inputs: one is with editing allowed, one without.
  // toggling isEditing should determine whether the form is editable or not.
  // However, what about what a new form is doing?

  const [contactForm, setContactForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedColumns, setUpdatedColumns] = useState([]);

  async function submitUpdate(e) {
    e.preventDefault();
    let updatedValues = [];
    // only the fields that have been changed will be added to the query.
    // can't tell the difference between multiple edits resulting in the original
    // string, but it's an easy optimization.
    updatedColumns.map((element) => updatedValues.push(contactForm[element]));
    const updateForm = {
      user_id: userId,
      updateWhat: updatedColumns,
      updateTo: updatedValues,
      token: await getToken(),
    };

    dispatch(updateContact(updateForm));
    setIsEditing(false);
    // show an updating/in progress toastify msg
  }

  function onChangeHandler(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // track which inputs have had changes made to them to avoid unnecessary work
    if (!updatedColumns.includes(name)) {
      setUpdatedColumns((oldArray) => {
        return [...oldArray, name];
      });
    }

    setContactForm((oldForm) => {
      return {
        ...oldForm,
        [name]: value,
      };
    });
  }

  function exitForm() {
    // show user the prompt if the form has changes (check updatedColumns)
    // otherwise reset contactInFocus, reset isEditing, reset contactSelected?
    if (!updatedColumns.length) {
      dispatch(updateContactInFocus({}));
      setIsEditing(false);
      dispatch(updateContactSelected());
    } else {
      // show the prompt, let the prompt send the same actions if user decides to
      // dispatch(updateContactInFocus({}))
      // setIsEditing(false)
      // dispatch(updateContactSelected())
    }
  }

  async function deleteContact() {
    // show user the prompt to confirm delete, then let it handle the calls to
    // const token = await getToken();
    // dispatch(deleteContact({
    //     user_id: userId,
    //     id: contactInFocus.id,
    //     token: token
    // }))
  }

  useEffect(() => {
    // When editing is turned on, make sure the form is set to redux state values for the contact
    // If editing is turned off, don't know if it's after a submit, so pull from redux state values still.
    // Call the updateContactInFocus hook when a successful UPDATE response object from api/contacts is
    // received. If I did this incorrectly I'll have issues with the new values not showing in the form
    // after submitting an update, and maybe even the same thing with new contacts as well.

    setContactForm((oldForm) => contactInFocus);
  }, [isEditing]);
  return (
    <div className={styles.wrapper} onClick={() => exitForm()}>
      <form name="contactForm" className={styles.formContainer}>
        <section className={styles.title}>
          <label className={styles.formLabels}>
            first name
            <input
              type="text"
              name="first_name"
              value={contactForm.first_name}
              placeholder="first name"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              required
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            last name
            <input
              type="text"
              name="last_name"
              value={contactInFocus.last_name}
              placeholder="last name"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              required
              readOnly={!isEditing}
            ></input>
          </label>
        </section>
        <section className={styles.about}>
          <label className={styles.formLabels}>
            company
            <input
              type="text"
              name="company"
              value={contactInFocus.company}
              placeholder="company"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            current job title
            <input
              type="text"
              name="current_job_title"
              value={contactInFocus.current_job_title}
              placeholder="title"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            location
            <input
              type="text"
              name="location"
              value={contactInFocus.location}
              placeholder="location"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            priority
            <input
              type="checkbox"
              name="is_priority"
              ischecked={contactInFocus.linked_job_opening}
              onChange={(e) => onChangeHandler(e)}
              className={styles.checksInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <p>Added on {contactInFocus.timestamp}</p>
        </section>
        <section className={styles.directContact}>
          <label className={styles.formLabels}>
            phone
            <input
              type="text"
              name="phone"
              value={contactInFocus.phone}
              placeholder="Add contact phone"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            email
            <input
              type="text"
              name="email"
              value={contactInFocus.email}
              placeholder="Add contact email"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
        </section>
        <section className={styles.social}>
          <label className={styles.formLabels}>
            linkedin
            <input
              type="text"
              name="linkedin"
              value={contactInFocus.linkedin}
              placeholder="Add contact linkedin"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            twitter
            <input
              type="text"
              name="twitter"
              value={contactInFocus.twitter}
              placeholder="Add contact name"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            instagram
            <input
              type="text"
              name="instagram"
              value={contactInFocus.instagram}
              placeholder="Add contact name"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            other social
            <input
              type="text"
              name="other_social"
              value={contactInFocus.other_social}
              placeholder="Add contact name"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <label className={styles.formLabels}>
            personal site
            <input
              type="text"
              name="personal_site"
              value={contactInFocus.personal_site}
              placeholder="Add contact name"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
        </section>
        <section className={styles.connectedJob}>
          <label className={styles.formLabels}>
            related job
            <input
              type="text"
              name="linked_job_opening"
              value={contactInFocus.linked_job_opening}
              placeholder="Add contact name"
              onChange={(e) => onChangeHandler(e)}
              className={styles.formInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <Link />
        </section>
        <section className={styles.manage}>
          <button
            className={newContactStaging ? styles.notEditable : styles.editable}
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className={isEditing ? styles.editsMade : styles.editsSaved}
            type="submit"
            onClick={() => submitUpdate()}
          >
            Save
          </button>
          <button
            className={
              !contactInFocus.id ? styles.createInProgress : styles.deleteButton
            }
            type="button"
            onClick={() => deleteContact()}
          >
            Delete
          </button>
        </section>
      </form>
    </div>
  );
}
