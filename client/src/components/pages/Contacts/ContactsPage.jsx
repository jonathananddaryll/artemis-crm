import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getContactsSearch,
  getUserContactsTable,
  getContactsPriority,
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
  const searchResults = useSelector((state) => state.contact.contactResults);
  const isSelected = useSelector((state) => state.contact.contactSelected);

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
      console.log("please enter text to search with");
    } else {
      dispatch(updateSearchQuery(validated));
      dispatch(getContactsSearch(validated));
    }
  }

  const addContact = () => {
    // first, set contactInFocus object values to ""
    dispatch(setNewContactStaging(true));
    dispatch(
      updateContactInFocus({
        first_name: "",
        last_name: "",
        company: "",
        current_job_title: "",
        location: "",
        phone: "",
        email: "",
        linkedin: "",
        twitter: "",
        instagram: "",
        other_social: "",
        personal_site: "",
        linked_job_opening: "",
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
    // TODO: maybe also need custom html for <no results found> because an empty page looks bad.
    dispatch(getContactHistory(userId, token));
  }

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
            items={["name", "company", "location"]}
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
                  image={""}
                  name={element.first_name + " " + element.last_name}
                  contactInfo={{
                    ...element,
                  }}
                  key={element.id}
                />
              );
            })}
        </section>
        {!!isSelected && <ContactForm />}
      </div>
    </div>
  );
}
