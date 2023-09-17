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
  const { userId, getToken } = useAuth();

  const dispatch = useDispatch();
  const { searchResults, contactSelected, contactsCache, contactInFocus } = useSelector((state) => state.contact);

  const [searchType, setSearchType] = useState("name");
  const [searchParams, setSearchParams] = useState({
    type: "name",
    strValue: "",
  });

  function updateSearchString(e) {
    setSearchParams((oldParams) => {
      return {
        ...oldParams,
        strValue: e.target.value,
      };
    });
  }

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

  function searchSubmit(e) {
    const validated = validateSearchParams(searchParams);
    if (!validated) {
      console.log("please enter valid text to search with");
    } else {
      dispatch(updateSearchQuery(validated));
      dispatch(getContactsSearch());
    }
  }

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

  const priorityContacts = () => {
    // place in search results only the contacts with priority === true
    dispatch(getContactsPriority());
    // TODO: custom html for <no results found>
  };

  async function contactHistory() {
    // place in search results only the contacts with recent communications
    // this could be from events table where sort top 10 recent events with
    // an event type of '{tbd}', pull the contact for that linked job on the event
    const token = await getToken();
    // TODO: the query for getContactHistory has not been built yet.
    // TODO: maybe also need custom html page for <no results found> because just empty results looks bad.
    dispatch(getRecentContacts(userId, token));
  }

  useEffect(() => {
    const grabSessionToken = async () => {
      const token = await getToken();
      dispatch(getUserContactsTable({ user_id: userId, token: token }));
    };
    grabSessionToken().catch(console.error);
  }, [dispatch]);
  useEffect(() => {
    
  }, [contactsCache, searchResults, contactInFocus])
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
                <ContactCard
                  image={""} // an open end here for profile pictures?
                  name={element.first_name + " " + element.last_name}
                  contactInfo={element}
                  key={element.id}
                />
              );
            })}
        </section>
        {!!contactSelected && <ContactForm />}
      </div>
    </div>
  );
}
