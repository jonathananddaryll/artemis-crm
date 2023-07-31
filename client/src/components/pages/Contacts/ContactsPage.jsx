import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllContacts } from '../../../reducers/ContactReducer';
import { useAuth } from '@clerk/clerk-react';

import styles from './ContactsPage.module.css';

export default function ContactsPage() {

    const { userId } = useAuth();

    const dispatch = useDispatch();

    const contactResults = useSelector((state) => state.contactResults);

    const searchQuery = useSelector((state) => state.searchQuery);



    return (
        <div className={styles.page_wrapper}>
            
        </div>
    );
}