import React, { useState, useEffect } from "react";

import { useDispatch } from "react-redux";

import {
  updateContactInFocus,
  updateContactSelected,
} from "../../../reducers/ContactReducer";

import styles from "./ContactCard.module.scss";

export default function ContactCard(props) {
  // Each individual contactCard component is given it's unique contact data via props, not
  // from redux calls. Each business card has 'quicklinks' on it users can click for easy
  // access, and expands to a full form by clicking on 'see more'. The form allows users
  // to edit and delete contacts.

  const { contactInfo } = props;
  const name = contactInfo.first_name + " " + contactInfo.last_name;

  const dispatch = useDispatch();

  // When the user wants to see more, pass this contact info through dispatch to update redux
  // state variable for the form that's about to open up, then toggle redux state to indicate
  // a contact has been selected.
  function openCard() {
    dispatch(updateContactInFocus(contactInfo));
    dispatch(updateContactSelected());
  }

  return (
    <section className={styles.ContactCard}>
      <div className={styles.contactFrame}>
        <h2 className={styles.contactInit}>
          {name[0].toUpperCase() + name.split(" ")[1][0].toUpperCase()}
        </h2>
        <section className={styles.cardHero}>
          <p className={styles.contactName}>{name}</p>
          {contactInfo.title !== null || "" ? (
            <p className={styles.contactTitle}>{contactInfo.title}</p>
          ) : (
            ""
          )}
          {contactInfo.location !== null || "" ? (
            <p className={styles.contactLocation}>{contactInfo.location}</p>
          ) : (
            ""
          )}
        </section>
        <div className={styles.cardDetails}>
          <div className={styles.contactInfo}>
            {contactInfo.phone !== null || "" ? (
              <p className={styles.contactPhone}>{contactInfo.phone}</p>
            ) : (
              ""
            )}
            {contactInfo.email !== null || "" ? (
              <p className={styles.contactEmail}>{contactInfo.email}</p>
            ) : (
              ""
            )}
            {contactInfo.linkedin !== null || "" ? (
              <button
                type="button"
                onClick={() => window.open(contactInfo.linkedin)}
                className={styles.contactLinkedin}
              >
                <i className="fa-brands fa-linkedin"></i>
              </button>
            ) : (
              ""
            )}
            {contactInfo.other_social !== null || "" ? (
              <button
                type="button"
                onClick={() => window.open(contactInfo.other_social)}
                className={styles.contactSocial}
              >
                <i className="fa-solid fa-link"></i>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={styles.cardOpen}>
          <button onClick={() => openCard()}>see more</button>
        </div>
      </div>
    </section>
  );
}
