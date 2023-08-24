import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { 
    deleteContact, 
    updateContact, 
    updateContactInFocus,
    setNewContactStaging 
    } from '../../../reducers/ContactReducer';

import { useAuth } from '@clerk/clerk-react';

import Dropdown from './Dropdown';
import styles from './ContactForm.module.scss';

export default function ContactForm() {

    const { userId, getToken } = useAuth();

    const dispatch = useDispatch();

    const newContactStaging = useSelector((state) => state.contact.newContactStaging);
    const contactInFocus = useSelector((state) => state.contact.contactInFocus);

    const [ contactForm, setContactForm ] = useState({});
    const [ isEditing, setIsEditing ] = useState(false);
    const [ updatedColumns, setUpdatedColumns ] = useState([])

    async function submitUpdate(e){
        e.preventDefault();
        let updatedValues = []
        updatedColumns.map(element => updatedValues.push(contactForm[element]))
        const updateForm = {
            user_id: userId,
            updateWhat: updatedColumns,
            updateTo: updatedValues,
            token: await getToken(),
        };
        // user_id, updateWhat, updateTo, token

        dispatch(updateContact(updateForm))
        // have redux wait for a successful response to:
        // - set updatedColumns to []
        // - set contactInFocus to contactForm
        // - set isEditing to true
    }

    function onChangeHandler(e) {
        if(!updatedColumns.includes(e.target.name)){
            setUpdatedColumns(oldArray => {
                return [...oldArray, e.target.name]
            })
        }
        setContactForm(oldForm => {
            return {
                ...oldForm,
                [e.target.name]: e.target.value
            }
        })
    }

    useEffect(() => {
        // When editing is turned on, make sure the form is set to redux state values for the contact
        // If editing is turned off, don't know if it's after a submit, so pull from redux state values still.
        // Call the updateContactInFocus hook when a successful UPDATE response object from api/contacts is 
        // received.

        setContactForm(oldForm => contactInFocus);
    }, [isEditing])
    return (
        <div className={styles.wrapper}>
            <form className={styles.formContainer}>
            <label className={styles.formLabels}>first name<input 
                    type="text"
                    name="first_name"
                    value={contactForm.first_name}
                    placeholder='Add contact first name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>last name<input 
                    type="text"
                    name="last_name"
                    value={contactInFocus.last_name}
                    placeholder='Add contact last name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>location<input 
                    type="text"
                    name="location"
                    value={contactInFocus.location}
                    placeholder='Add contact location'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>current job title<input 
                    type="text"
                    name="current_job_title"
                    value={contactInFocus.current_job_title}
                    placeholder='Add contact title'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>company<input 
                    type="text"
                    name="company"
                    value={contactInFocus.company}
                    placeholder='Add contact company'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>phone<input 
                    type="text"
                    name="phone"
                    value={contactInFocus.phone}
                    placeholder='Add contact phone'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>email<input 
                    type="text"
                    name="email"
                    value={contactInFocus.email}
                    placeholder='Add contact email'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>linkedin<input 
                    type="text"
                    name="linkedin"
                    value={contactInFocus.linkedin}
                    placeholder='Add contact linkedin'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>twitter<input 
                    type="text"
                    name="twitter"
                    value={contactInFocus.twitter}
                    placeholder='Add contact name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>instagram<input 
                    type="text"
                    name="instagram"
                    value={contactInFocus.instagram}
                    placeholder='Add contact name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>other social<input 
                    type="text"
                    name="other_social"
                    value={contactInFocus.other_social}
                    placeholder='Add contact name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>personal site<input 
                    type="text"
                    name="personal_site"
                    value={contactInFocus.personal_site}
                    placeholder='Add contact name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <label className={styles.formLabels}>related job<input 
                    type="text"
                    name="linked_job_opening"
                    value={contactInFocus.linked_job_opening}
                    placeholder='Add contact name'
                    onChange={e => onChangeHandler(e)}
                    className={styles.formInput}
                    ></input>
            </label>
            <p>{contactInFocus.timestamp}</p>
            <button type="button" onClick={() => setIsEditing(!isEditing)}>Edit</button>
            <button type="submit">Save</button>
            <button type="button">Delete</button>
        </form>
        </div>
    )
}