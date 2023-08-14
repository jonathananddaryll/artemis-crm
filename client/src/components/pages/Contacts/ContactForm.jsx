import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { 
    deleteContact, 
    updateContact, 
    updateContactInFocus,
    setNewContactStaging 
    } from '../../../reducers/ContactReducer';

import { useAuth } from '@clerk/clerk-react';

import Dropdown from './Dropdown';
import styles from './ContactForm.module.css';

export default function ContactForm() {

    const { userId, getToken } = useAuth();

    const dispatch = useDispatch();

    const newContactStaging = useSelector((state) => state.contact.newContactStaging);
    const contactInFocus = useSelector((state) => state.contact.contactInFocus);

    // first_name
    // last_name
    // company
    // location
    // current_job_title
    // phone
    // email
    // linkedin
    // twitter
    // instagram
    // other_social
    // personal_site
    // linked_job_opening
    // timestamp

    return (
        <form>
            
        </form>
    )
}