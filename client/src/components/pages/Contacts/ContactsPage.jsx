import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getContactsSearch,
  getUserContactsTable,
  getContactsPriority,
  getRecentContacts,
  updateSearchQuery,
  updateContactInFocus,
  updateContactSelected
  // setNewContactStaging
} from '../../../reducers/ContactReducer';
import { useAuth } from '@clerk/clerk-react';

import Dropdown from './Dropdown';
import ContactCard from './ContactCard';
import ContactForm from './ContactForm';
import styles from './ContactsPage.module.scss';

// TODO: update .map(element => {
//   return <></> etc etc
// })
// to .map(contact)

// TODO: move searchQuery out of redux into contactsPage
// TODO: fix search type company

export default function ContactsPage() {
  // A Contacts organizer. Main features are:

  // - the top menu for +adding a contact, priority contacts, and recent contacts
  // - search bar with dropdown menu for options
  // - clickable / expanding 'business card' search results.
  // - Add/Edit/Remove functions
  // - Search for a job to link to this contact
  // - Quick jump to the board to add a task to the job after a phone call?

  const { userId, getToken } = useAuth();

  const dispatch = useDispatch();
  // redux store updates when a user has asked to search with a string/filter
  const searchResults = useSelector(state => state.contact.searchResults);
  // redux store updates when a user is changing which contact they look at
  const contactSelected = useSelector(state => state.contact.contactSelected);
  const contactsLoaded = useSelector(state => state.contact.contactsLoaded);
  // const contactInFocus = useSelector((state) => state.contact.contactInFocus);

  // name, company, city - Which are you searching for?
  const [searchType, setSearchType] = useState('name');
  const [searchParams, setSearchParams] = useState({
    type: 'name',
    strValue: ''
  });

  const [newContactStaging, setNewContactStaging] = useState(false);

  // Controlled component function for the search input element
  function updateSearchString(e) {
    setSearchParams(oldParams => {
      return {
        ...oldParams,
        strValue: e.target.value
      };
    });
  }

  // Client side input validation/sanitizer
  const validateSearchParams = searchObj => {
    const validated = {
      type: searchObj.type,
      strValue: ''
    };
    if (searchObj.strValue === '') {
      console.log('you didnt type anything valid');
      return false;
    } else {
      const stringTrimmed = searchObj.strValue.trim();
      validated.strValue = stringTrimmed;
      return validated;
    }
  };

  // Initiate the contacts search for the string value in the search input box
  function searchSubmit(e) {
    const validated = validateSearchParams(searchParams);
    if (!validated) {
      console.log('please enter valid text to search with');
    } else {
      dispatch(updateSearchQuery(validated));
      dispatch(getContactsSearch());
    }
  }

  // Add a new contact using a form
  const addContact = () => {
    // first, set contactInFocus object values to ""
    setNewContactStaging(true);
    dispatch(
      updateContactInFocus({
        first_name: null,
        last_name: null,
        company: null,
        current_job_title: null,
        city: null,
        phone: null,
        email: null,
        linkedin: null,
        twitter: null,
        instagram: null,
        other_social: null,
        personal_site: null,
        linked_job_opening: null
      })
    );
    // then toggle the form visibility
    dispatch(updateContactSelected());
  };

  // Top menu button - Filter out any contacts that don't have is_priority === true
  const priorityContacts = () => {
    // place in search results only the contacts with priority === true
    dispatch(getContactsPriority());
    // TODO: custom html for <no results found>
  };

  // Recents
  async function contactHistory() {
    // place in search results only the contacts with recent communications
    // this could be from events table where sort top 10 recent events with
    // an event type of '{tbd}', pull the contact for that linked job on the event
    const token = await getToken();
    // TODO: the query for getContactHistory has not been built yet.
    // TODO: maybe also need custom html page for <no results found> because just empty results looks bad.
    dispatch(getRecentContacts(userId, token));
  }

  // On first load, grab all the users contacts at once and keep a copy locally(session)
  useEffect(() => {
    if (!contactsLoaded) {
      const grabSessionToken = async () => {
        const token = await getToken();
        dispatch(getUserContactsTable({ user_id: userId, token: token }));
      };
      grabSessionToken();
    }
  }, [dispatch]);
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contactsContainer}>
        <nav className={styles.menuContainer}>
          <section className={styles.searchBar}>
            <input
              onChange={e => updateSearchString(e)}
              type='text'
              inputMode='search'
              name='searchBar'
              className={styles.contactSearchInput}
              value={searchParams.strValue}
              placeholder={searchType}
            />
            <button className={styles.searchButton} onClick={searchSubmit}>
              <i
                className={'fa-solid fa-magnifying-glass ' + styles.searchIcon}
              ></i>
            </button>
            <Dropdown
              items={['name', 'company', 'city']}
              header={'options'}
              setSearchType={setSearchType}
            />
          </section>
          <ul className={styles.menu}>
            <li className={styles.menuLinks}>
              <button
                onClick={() => {
                  addContact();
                }}
              >
                add+
              </button>
            </li>
            <li className={styles.menuLinks}>
              <button
                onClick={() => {
                  priorityContacts();
                }}
              >
                priority
              </button>
            </li>
            <li className={styles.menuLinks}>
              <button
                onClick={() => {
                  contactHistory();
                }}
              >
                history
              </button>
            </li>
          </ul>
        </nav>
        <section className={styles.searchResultsContainer}>
          {!!searchResults && (
            <div className={styles.flexContainer}>
              {searchResults.map(contact => (
                <ContactCard contactInfo={contact} key={contact.id} />
              ))}
              <div className={styles.flexFiller}></div>
            </div>
          )}
        </section>
        {!!contactSelected && (
          <ContactForm newContactStaging={newContactStaging} />
        )}
      </div>
    </div>
  );
}
