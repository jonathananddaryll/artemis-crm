import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getContactsSearch, getUserContactsTable, getContactsPriority, updateSearchQuery } from '../../../reducers/ContactReducer';
import { useAuth } from '@clerk/clerk-react';

import Dropdown from './Dropdown';
import ContactCard from './ContactCard';
import ContactForm from './ContactForm';
import styles from './ContactsPage.module.scss';

export default function ContactsPage() {

    const { userId, getToken } = useAuth();

    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.contact.contactResults);

    const [ searchType, setSearchType ] = useState("name");
    const [ searchParams, setSearchParams ] = useState({
        type: "name",
        strValue: "",
    });

    function searchSubmit(e) {
        const validated = validateSearchParams(searchParams);
        if(!validated){
            console.log('please enter text to search with')
        }else{
            dispatch(updateSearchQuery(validated))
            dispatch(getContactsSearch(validated));
        }
    }

    const addContact = () => {
        
    }

    const priorityContacts = () => {
        // place in search results only the contacts with priority === true
        dispatch(getContactsPriority())
    }

    const contactHistory = () => {
        // place in search results only the contacts with recent communications
        // this could be from events table where sort top 10 recent events with
        // an event type of '{tbd}', pull the contact for that linked job on the event
    }

    const validateSearchParams = (searchObj) => {
        let validated = {
            "type": searchObj.type,
            "strValue": "",
        }
        if(searchObj.strValue === ""){
            console.log('you didnt type anything valid')
            return false
        }else{
            let stringTrimmed = searchObj.strValue.trim();
            validated.strValue = stringTrimmed;
            return validated
        }
    }

    function updateSearchString(e) {
        setSearchParams(oldParams => {
            return {
                ...oldParams,
                strValue: e.target.value
            }
        });
    }

    useEffect(() => {
        const grabSessionToken = async () => {
            const token = await getToken()
            dispatch(getUserContactsTable( { user_id: userId, token: token } ))
        }
        grabSessionToken()
        .catch(console.error)
    }, [dispatch]);
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.contactsContainer}>
            <nav className={styles.menuContainer}>
                <ul className={styles.menu}>
                    <li className={styles.menuLinks}><a onClick={() => {addContact()}}>add+</a></li>
                    <li className={styles.menuLinks}><a onClick={() => {priorityContacts()}}>priority</a></li>
                    <li className={styles.menuLinks}><a onClick={() => {contactHistory()}}>history</a></li>
                </ul>
            </nav>
            <section className={styles.searchBar}>
                <input onChange={ (e) => updateSearchString(e) } type="text" inputMode="search" name="searchBar"  className={styles.contactSearchInput} value={searchParams.strValue} placeholder={searchType}/>
                <button className={styles.searchButton} onClick={searchSubmit}><i className={"fa-solid fa-magnifying-glass " + styles.searchIcon}></i></button>
                <Dropdown 
                    items={["name", "company", "location"]}
                    header={"options"}
                    setSearchType={setSearchType}
                />
            </section>
            <section className={styles.searchResultsContainer}>
                {searchResults && searchResults.map(element => {
                    return (
                        // a business card.
                        < ContactCard 
                            image={""}
                            name={element.first_name + " " + element.last_name}
                            contactInfo={
                                {
                                    phone: "888-708-7077",
                                    email: "joncodes@gmail.com",
                                    location: "Mallorca, Spain",
                                    title: "Software Engineer",
                                    linkedin: "https://linkedin.com/in/jonnymnemonic",
                                    otherSocial: "https://github.com/jonnymnemonic"
                                }
                            }
                            key={element.id}
                        />                  )
                })}
            </section>
            </div>
            
        </div>
    );
}