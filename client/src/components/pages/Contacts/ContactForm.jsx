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

  const { newContactStaging, contactInFocus } = useSelector(
    (state) => state.contact
  );

  // When disallowing edits on a form, I need to tell the difference between a new contact,
  // and updating an already existing contact, as the form needs to be changed.
  // There needs to be two versions of style for the inputs: one is with editing allowed, one without.
  // toggling isEditing should determine whether the form is editable or not.
  // However, what about what a new form is doing?

  const [isEditing, setIsEditing] = useState(newContactStaging ? true: false);
  const [updatedColumns, setUpdatedColumns] = useState([]);
  const [contactForm, setContactForm] = useState(contactInFocus);

  async function submitUpdate(e) {
    let updatedValues = [];
    // only the fields that have been changed will be added to the query.
    // can't tell the difference between multiple edits resulting in the original
    // string, but it's an easy optimization.
    if (updatedColumns.length > 0) {
      updatedColumns.map((element) => updatedValues.push(contactForm[element]));
      const updateForm = {
        user_id: userId,
        updateWhat: updatedColumns,
        updateTo: updatedValues,
        token: await getToken(),
        id: contactForm.id,
      };
      dispatch(updateContact(updateForm));
      // toggle the form visibility
      setIsEditing(false);
      // show an updating/in progress toastify msg
    } else {
      // show toastify msg that form has no updates to make? Do nothing?
    }
  }

  function onChangeHandler(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setContactForm({
      ...contactForm,
      [name]: value,
    })
    // track which inputs have had changes made to them to avoid unnecessary work
    if (!updatedColumns.includes(name)) {
      setUpdatedColumns((oldArray) => {
        return [...oldArray, name];
      });
    }
  }

  function exitForm(event) {
    if(event.target.className.includes("wrapper")){
      if (!updatedColumns.length) {
        dispatch(updateContactInFocus({}));
        setIsEditing(false);
        dispatch(updateContactSelected());
      } else {
        // show the prompt, let the prompt send the same actions if user decides to
        // "You have unsaved changes, etc etc"
        dispatch(updateContactInFocus({}))
        setIsEditing(false)
        dispatch(updateContactSelected())
      }
    }
  }

  async function deleteContact() {
    // show user the prompt to confirm delete, then let it handle the calls to
    // Toggle Confirm form visibility first, then call this function from there
    const token = await getToken();
    dispatch(deleteContact({
        user_id: userId,
        id: contactForm.id,
        token: token
    }))
  }

  useEffect(() => {
    console.log("rerender of form ")
  }, [contactInFocus])
  return (
    <div className={styles.wrapper} onClick={e => exitForm(e)}>
      <form name="contactForm" className={styles.formContainer}>
        <section className={styles.title}>
          <label className={styles.formLabels}>
            first name
            <input
              type="text"
              name="first_name"
              value={contactForm.first_name ?? ""}
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
              value={contactForm.last_name ?? ""}
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
              value={contactForm.company ?? ""}
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
              value={contactForm.current_job_title ?? ""}
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
              value={contactForm.location ?? ""}
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
              ischecked={contactForm.linked_job_opening ?? ""}
              onChange={(e) => onChangeHandler(e)}
              className={styles.checksInput}
              readOnly={!isEditing}
            ></input>
          </label>
          <p>Added on {contactForm.date_created}</p>
        </section>
        <section className={styles.directContact}>
          <label className={styles.formLabels}>
            phone
            <input
              type="text"
              name="phone"
              value={contactForm.phone ?? ""}
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
              value={contactForm.email ?? ""}
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
              value={contactForm.linkedin ?? ""}
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
              value={contactForm.twitter ?? ""}
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
              value={contactForm.instagram ?? ""}
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
              value={contactForm.other_social ?? ""}
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
              value={contactForm.personal_site ?? ""}
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
              value={contactForm.linked_job_opening ?? ""}
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
            type="button"
            onClick={() => submitUpdate()}
          >
            Save
          </button>
          <button
            className={
              !contactForm.id ? styles.createInProgress : styles.deleteButton
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
