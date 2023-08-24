import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';

import styles from './ContactCard.module.scss';

export default function ContactCard(props) {
    const { image, name, contactInfo } = props;
    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.contact.contactResults);
    // create a context for toggling the form(edit form/in-depth form)
    // send the action to redux along with the contact id so that
    // redux can pass the contact id to the form
    return(
        <section className={styles.ContactCard}>
            <div className={styles.contactFrame}>
            <h2 className={styles.contactInit}>{name[0].toUpperCase() + name.split(" ")[1][0].toUpperCase()}</h2>
                <section className={styles.cardHero}>
                    <p className={styles.contactName}>{name}</p>
                    {contactInfo.title !== "" ? <p className={styles.contactTitle}>{contactInfo.title}</p>: ""}
                    {contactInfo.location !== "" ? <p className={styles.contactLocation}>{contactInfo.location}</p>: ""}
                </section>
                <div className={styles.cardDetails}>
                    <div className={styles.contactInfo}>
                        {contactInfo.phone !== "" ? <p className={styles.contactPhone}>{contactInfo.phone}</p>: ""}
                        {contactInfo.email !== "" ? <p className={styles.contactEmail}>{contactInfo.email}</p>: ""}
                        {contactInfo.linkedin !== "" ? 
                            <button type="button" onClick={() => window.open(contactInfo.linkedin)} className={styles.contactLinkedin}>
                            <i className="fa-brands fa-linkedin"></i>
                            </button>
                            : ""} 
                        {contactInfo.otherSocial !== "" ? 
                            <button type="button" onClick={() => window.open(contactInfo.otherSocial)} className={styles.contactSocial}>
                            <i className="fa-solid fa-link"></i>
                            </button>
                            : ""}
                    </div>
                </div>
                <div className={styles.cardOpen}>
                        <button>
                            see more
                        </button>
                    </div>
            </div>
        </section>
    )
}