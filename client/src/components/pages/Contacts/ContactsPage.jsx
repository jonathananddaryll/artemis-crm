import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getContactsSearch,
  getUserContactsTable,
  getContactsPriority,
  getRecentContacts,
  updateSearchQuery,
  updateContactInFocus,
  updateContactSelected,
  setNewContactStaging,
} from "../../../reducers/ContactReducer";
import { useAuth } from "@clerk/clerk-react";

import Dropdown from "./Dropdown";
import ContactCard from "./ContactCard";
import ContactForm from "./ContactForm";
import styles from "./ContactsPage.module.scss";

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
  const searchResults = useSelector((state) => state.contact.searchResults);
  // redux store updates when a user is changing which contact they look at
  const contactSelected = useSelector((state) => state.contact.contactSelected);
  // const contactsCache = useSelector((state) => state.contact.contactsCache);
  // const contactInFocus = useSelector((state) => state.contact.contactInFocus);

  // name, company, city - Which are you searching for?
  const [searchType, setSearchType] = useState("name");
  const [searchParams, setSearchParams] = useState({
    type: "name",
    strValue: "",
  });

  // Controlled component function for the search input element
  function updateSearchString(e) {
    setSearchParams((oldParams) => {
      return {
        ...oldParams,
        strValue: e.target.value,
      };
    });
  }

  // Client side input validation/sanitizer
  const validateSearchParams = (searchObj) => {
    let validated = {
      type: searchObj.type,
      strValue: "",
    };
    if (searchObj.strValue === "") {
      console.log("you didnt type anything valid");
      return false;
    } else {
      let stringTrimmed = searchObj.strValue.trim();
      validated.strValue = stringTrimmed;
      return validated;
    }
  };

  // Initiate the contacts search for the string value in the search input box
  function searchSubmit(e) {
    const validated = validateSearchParams(searchParams);
    if (!validated) {
      console.log("please enter valid text to search with");
    } else {
      dispatch(updateSearchQuery(validated));
      dispatch(getContactsSearch());
    }
  }

  // Add a new contact using a form
  const addContact = () => {
    // first, set contactInFocus object values to ""
    dispatch(setNewContactStaging(true));
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
        linked_job_opening: null,
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
    const grabSessionToken = async () => {
      const token = await getToken();
      dispatch(getUserContactsTable({ user_id: userId, token: token }));
    };
    grabSessionToken().catch(console.error);
  }, [dispatch]);
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contactsContainer}>
        <nav className={styles.menuContainer}>
          <ul className={styles.menu}>
            <li className={styles.menuLinks}>
              <a
                onClick={() => {
                  addContact();
                }}
              >
                add+
              </a>
            </li>
            <li className={styles.menuLinks}>
              <a
                onClick={() => {
                  priorityContacts();
                }}
              >
                priority
              </a>
            </li>
            <li className={styles.menuLinks}>
              <a
                onClick={() => {
                  contactHistory();
                }}
              >
                history
              </a>
            </li>
          </ul>
        </nav>
        <section className={styles.searchBar}>
          <input
            onChange={(e) => updateSearchString(e)}
            type="text"
            inputMode="search"
            name="searchBar"
            className={styles.contactSearchInput}
            value={searchParams.strValue}
            placeholder={searchType}
          />
          <button className={styles.searchButton} onClick={searchSubmit}>
            <i
              className={"fa-solid fa-magnifying-glass " + styles.searchIcon}
            ></i>
          </button>
          <Dropdown
            items={["name", "company", "city"]}
            header={"options"}
            setSearchType={setSearchType}
          />
        </section>
        <section className={styles.searchResultsContainer}>
          {!!searchResults &&
            searchResults.map((element) => {
              return (
                // a business card.
                <ContactCard contactInfo={element} key={element.id} />
              );
            })}
        </section>
        {!!contactSelected && <ContactForm />}
      </div>
    </div>
  );
}
