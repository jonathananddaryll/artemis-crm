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

    const addContact = () => {
        
    }

    useEffect(() => {
        dispatch(getContacts(userId, searchQuery));
    }, [dispatch]);
    return (
        <div className={styles.pageWrapper}>
            <nav className={styles.menuContainer}>
                <ul className={styles.menu}>
                    <li className={styles.menuLinks}><a onclick="addContact()"><i class="fa-solid fa-person-circle-plus"></i></a></li>
                    <li className={styles.menuLinks}><a onclick="priorityContacts()"><i class="fa-regular fa-star"></i></a></li>
                    <li className={styles.menuLinks}><a onclick="contactHistory()"><i class="fa-solid fa-comments"></i></a></li>
                </ul>
            </nav>
            <section className={styles.searchBar}>
                <input type="text" inputMode="search" name="searchBar" className={styles.contactSearchInput} placeholder="search"/>
                <div className={styles.dropdownOptions}>
                    <a href=""><i></i></a>
                    <section>
                        <ul>
                            <li>

                            </li>
                            <li>

                            </li>
                            <li>
                                
                            </li>
                        </ul>
                    </section>
                </div>
            </section>
            <section className={styles.searchResultsContainer}>
                {/* {contactResults.notEmpty? contactResults.forEach(element => {
                    <section className={styles.contactCard}>
                        <title className={styles.contactFirstName}></title>
                        <span></span>
                    </section>
                }):''}; */}

            </section>
            
        </div>
    );
}