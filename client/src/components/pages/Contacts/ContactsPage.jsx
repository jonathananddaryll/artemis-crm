import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getContactsWithUserId } from '../../../reducers/ContactReducer';
import styles from './ContactsPage.module.css';

export default function ContactsPage() {

    return (
        <div className={styles.page_wrapper}></div>
    );
}