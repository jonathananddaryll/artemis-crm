import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts } from '../../../reducers/ContactReducer';
import { useAuth, useSession } from '@clerk/clerk-react';

import Dropdown from './Dropdown';
import styles from './ContactsPage.module.css';

export default function ContactsPage() {

    const { userId } = useAuth();
    const { session } = useSession();
    const dispatch = useDispatch();
    const contactResults = useSelector((state) => state.contactResults);
    const [ searchType, setSearchType ] = useState("name");
    const [ searchQuery, setSearchQuery ] = useState({
        first: "jon",
        last: "",
        type: searchType,
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


    // <i class="fa-solid fa-person-circle-plus"></i>
    // <i class="fa-regular fa-star"></i>
    // <i class="fa-solid fa-comments"></i>

    useEffect(() => {
        dispatch(getContacts(userId, searchQuery));
    }, [dispatch]);
    return (
        <div className={styles.pageWrapper}>
            <nav className={styles.menuContainer}>
                <ul className={styles.menu}>
                    <li className={styles.menuLinks}><a onclick="addContact()">add+</a></li>
                    <li className={styles.menuLinks}><a onclick="priorityContacts()">priority</a></li>
                    <li className={styles.menuLinks}><a onclick="contactHistory()">history</a></li>
                </ul>
            </nav>
            <section className={styles.searchBar}>
                <input type="text" inputMode="search" name="searchBar" className={styles.contactSearchInput} placeholder={searchType}/>
                <a><i className={"fa-solid fa-magnifying-glass " + styles.searchIcon}></i></a>
                <Dropdown 
                    items={["name", "company", "location"]}
                    header={"options"}
                    setSearchType={setSearchType}
                />
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
// onMouseEnter={() => setVisible()}
// onMouseLeave={() => setHidden()}>