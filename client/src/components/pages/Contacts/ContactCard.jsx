import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts } from '../../../reducers/ContactReducer';
import { useAuth } from '@clerk/clerk-react';

import styles from './ContactCard.module.css';

export default function ContactCard(props) {
    const { image, name, contactInfo } = props;
    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.contact.contactResults);
    // create a context for toggling the form(edit form/in-depth form)
    // send the action to redux along with the contact id so that
    // redux can pass the contact id to the form
    return(
        <section className={styles.ContactCard}>
            <img src="" alt={image} className={styles.contactImage}/>
            <title className={styles.contactName}>{name}</title>
            <div className={styles.contactInfo}>
                <span className={styles.contactPhone}>{contactInfo.phone}</span> 
                <span className={styles.contactEmail}>{contactInfo.email}</span>
                <span className={styles.contactLocation}>{contactInfo.location}</span>
                <span className={styles.contactTitle}>{contactInfo.title}</span>
                <span className={styles.contactLinkedin}>{contactInfo.linkedin}</span>
                <span className={styles.contactSocial}>{contactInfo.otherSocial}</span>
                <div className={styles.contactOpen}>
                    <button>
                        
                    </button>
                </div>
            </div>
        </section>
    )
}