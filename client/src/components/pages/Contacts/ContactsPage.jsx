import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts } from '../../../reducers/ContactReducer';
import { useAuth, useSession } from '@clerk/clerk-react';

import styles from './ContactsPage.module.css';

export default function ContactsPage() {

    const { userId } = useAuth();
    const { session } = useSession();
    const dispatch = useDispatch();
    const contactResults = useSelector((state) => state.contactResults);
    const { searchQuery, setSearchQuery } = useState({
        first: "",
        last: "",
        type: "empty",
        strValue: "",
        token: {}
    })

    async function onSubmitHandler(e) {
        e.preventDefault();
        const searchQuerySubmit = {
          first: searchQuery.first,
          last: searchQuery.last,
          type: searchQuery.type,
          strValue: searchQuery.strValue,
          token: await session.getToken()
        };
        dispatch(getContacts(user_id, searchQuerySubmit));
      }

    useEffect(() => {
        dispatch(getContacts(userId, searchQuery));
    }, [dispatch]);

    return (
        <div className={styles.page_wrapper}>
            
        </div>
    );
}