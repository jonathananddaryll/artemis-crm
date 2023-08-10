import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getContacts } from '../../../reducers/ContactReducer';
import { useAuth } from '@clerk/clerk-react';

import Dropdown from './Dropdown';
import ContactCard from './ContactCard';
import styles from './ContactsPage.module.css';

export default function ContactsPage() {

    const { userId, getToken } = useAuth();

    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.contact.contactResults);

    const [ searchType, setSearchType ] = useState("name");
    const [ searchParams, setSearchParams ] = useState({
        user_id: userId,
        first: "",
        last: "",
        type: "init",
        strValue: "",
        token: {}
    });

    async function searchSubmit(e) {
        const validated = validateSearchParams(searchParams);
        if(!validated){
            console.log('please enter text to search with')
        }else{
            const token = await getToken()
            validated.token = token;
            dispatch(updateSearchQuery(validated))
            dispatch(getContacts(validated));
        }
      }
    const addContact = () => {
        
    }

    const priorityContacts = () => {
        
    }

    const contactHistory = () => {
        
    }
    const validateSearchParams = (searchObj) => {
        let validated = {
            "first": "",
            "last": "",
            "type": "",
            "strValue": "",
            "token": {}
        }
        if(searchObj.strValue === ""){
            return false
        }
        if(searchObj.type !== "name"){
            return searchObj
        }else{
            let stringTrimmed = searchObj.strValue.trim();
            if(stringTrimmed.split("").includes(" ")){
                if(stringTrimmed.split("").length > 2){
                    validated.first = stringTrimmed.split(" ")[0];
                    validated.last = stringTrimmed.split(validated.first)[1];
                    return validated
                }else{
                    validated.first = stringTrimmed.split(" ")[0];
                    validated.last = stringTrimmed.split(" ")[1];
                    return validated
                }
            }else{
                validated.strValue = stringTrimmed;
                return validated
            }
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
            searchParams.token = token
            dispatch(getContacts(searchParams))
        }
        grabSessionToken()
        .catch(console.error)
    }, [dispatch]);
    return (
        <div className={styles.pageWrapper}>
            <nav className={styles.menuContainer}>
                <ul className={styles.menu}>
                    <li className={styles.menuLinks}><a onClick={() => {addContact()}}>add+</a></li>
                    <li className={styles.menuLinks}><a onClick={() => {priorityContacts()}}>priority</a></li>
                    <li className={styles.menuLinks}><a onClick={() => {contactHistory()}}>history</a></li>
                </ul>
            </nav>
            <section className={styles.searchBar}>
                <input onChange={ (e) => updateSearchString(e) } type="text" inputMode="search" name="searchBar"  className={styles.contactSearchInput} value={searchParams.strValue} placeholder={searchType}/>
                <a onClick={searchSubmit}><i className={"fa-solid fa-magnifying-glass " + styles.searchIcon}></i></a>
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
                            name={"Jonny Mnemonic"}
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
                            key={element.email}
                        />                  )
                })}
            </section>
            
        </div>
    );
}