import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useAuth, useSession } from "@clerk/clerk-react";

import {
  deleteContact,
  updateContact,
  createContact,
  updateContactInFocus,
  updateContactSelected,
  setNewContactStaging,
} from "../../../reducers/ContactReducer";

import Dropdown from "./Dropdown";
import styles from "./ContactForm.module.scss";

export default function ContactForm() {

  const { session } = useSession();
  const { userId } = useAuth();
  const dispatch = useDispatch();

  const { newContactStaging, contactInFocus } = useSelector(
    (state) => state.contact
  );

  const formEditOnLoad = newContactStaging ? true : false;

  const [isEditing, setIsEditing] = useState(formEditOnLoad);
  const [updatedColumns, setUpdatedColumns] = useState([]);
  const [contactForm, setContactForm] = useState(contactInFocus);

  async function submitUpdate(e) {
    e.preventDefault();
    let updatedValues = [];
    // only the fields that have been changed will be added to the query.
    // can't tell the difference between multiple edits resulting in the original
    // string, but it's an easy optimization.
    if (updatedColumns.length > 0) {
      updatedColumns.map((element) => updatedValues.push(contactForm[element]));
      if (newContactStaging) {
        const createForm = {
          user_id: userId,
          names: updatedColumns,
          values: updatedValues,
          token: await session.getToken(),
        };
        console.log(createForm)
        dispatch(createContact(createForm));
        dispatch(updateContactInFocus(createForm))
      } else {
        const updateForm = {
          user_id: userId,
          updateWhat: updatedColumns,
          updateTo: updatedValues,
          token: await session.getToken(),
          id: contactForm.id,
        };
        dispatch(updateContact(updateForm));
      }
      setIsEditing(false);
    }
  }

  function onChangeHandler(e) {
    const { name, value, type, checked } = e.target;
    setContactForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (!updatedColumns.includes(name)) {
      setUpdatedColumns((prevColumns) => [...prevColumns, name]);
    }
  }

  function exitForm(event) {
    if (event.target.className.includes("wrapper")) {
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

  const deleteContactStart = async () => {
    if (!contactForm.id) {
      // it's a new contact, just clear the form
      dispatch(updateContactInFocus({}));
      setContactForm(contactInFocus);
    } else {
      // it's a real contact, delete it
      const formData = {
        user_id: userId,
        id: contactForm.id,
        token: await session.getToken(),
      };
      dispatch(deleteContact(formData));
    }
  };

  useEffect(() => {}, [contactInFocus, isEditing]);
  return (
    <div className={styles.wrapper} onClick={(e) => exitForm(e)}>
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
            city
            <input
              type="text"
              name="city"
              value={contactForm.city ?? ""}
              placeholder="city"
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
            className={isEditing ? styles.notEditable : styles.editable}
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className={isEditing ? styles.editsMade : styles.editsSaved}
            type="button"
            onClick={submitUpdate}
          >
            Save
          </button>
          <button
            className={
              !contactForm.id ? styles.createInProgress : styles.deleteButton
            }
            type="button"
            onClick={deleteContactStart}
          >
            Delete
          </button>
        </section>
      </form>
    </div>
  );
}
