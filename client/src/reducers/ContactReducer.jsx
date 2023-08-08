import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// State for contact organizer:

// add a new contact:
    // - input form data ( searchQuery )
    // - new contact created ( true/false )
    // - 

// delete a contact:
    // - deleting / awaiting results
    // - 

// update a contact:

// search for contacts:



// fake data for testing
const fakeContacts = [
    {
      id: 1,
      user_id: 1,
      first_name: 'Apollo',
      last_name: 'Delos',
      company: 'Olympus Studioss',
      location: 'Mount Olympus',
      current_job_title: 'Project Manager',
      phone: '(302)302-3022',
      email: 'apollo@twelveolympians.pantheon',
      linkedin: 'https://www.linkedin.com/in/apollotheoracle',
      twitter: 'https://twitter.com/apollotheoracle',
      instagram: 'https://instagram.com/apollotheoracle',
      other_social: 'https://olympus.social/gods/apollo',
      personal_site: 'https://www.averterofevil.org',
      fk_linked_job: 1,
      timestamp: '2023-05-30 00:00:01',
    },
    {
      id: 2,
      user_id: 2,
      first_name: 'Python',
      last_name: 'Parnassus',
      company: 'Hera Be Dragonz',
      location: 'Mount Parnassus',
      current_job_title: 'Security Manager',
      phone: '(808)880-0808',
      email: 'python@hera.hr.com',
      linkedin: 'https://www.linkedin.com/in/cthonic',
      twitter: 'https://twitter.com/cthonic',
      instagram: 'https://instagram.com/cthonic',
      other_social: 'https://hades.social/goddess/hera/minions/python',
      personal_site: 'https://www.learntocode.org',
      fk_linked_job: 1,
      timestamp: '2023-03-21 10:50:05',
    },
    {
      id: 3,
      user_id: 1,
      first_name: 'Hecate',
      last_name: 'Trivia',
      company: 'Mother of Angels, LLC',
      location: 'Sicily',
      current_job_title: 'Shadow Warrior',
      phone: '(012)345-6789',
      email: 'hecate@darkside.moon',
      linkedin: 'https://www.linkedin.com/in/heqet',
      twitter: 'https://twitter.com/heqet',
      instagram: 'https://instagram.com/heqet',
      other_social: 'https://olympus.social/gods/heqet',
      personal_site: '',
      fk_linked_job: 1,
      timestamp: '2023-01-09 16:30:49',
    },
]

// ASYNC thunks

// READ all contacts for a user
export const getContacts = createAsyncThunk(
  'contacts/getContacts',
  async ( searchQuery, thunkAPI ) => {
    try {
        // Send user_id from clerk, along with first, last in req.body
        const params = {
          user_id: searchQuery.user_id,
          type: searchQuery.type
        }
        if(params.type === 'name'){
          params.first = searchQuery.first;
          params.last = searchQuery.last;
        }else if(params.type === 'init'){
          
        }else{
          params.strValue = searchQuery.strValue;
        }
        const config = {
          method: 'GET',
          url: '/api/contacts',
          withCredentials: false,
          params: {
            ...params
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${searchQuery.token}`
          }
        }
        const res = await axios.get(`/api/contacts/`, config)
        console.log(res)
        return res.data;
    } catch (err) {
      console.log(err);
    }
  }
);

// DELETE a users contact
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async( user_id, id, token ) => {
    try {
      // send the user_id along with the contact id to delete.
      const res = await axios.delete({
        method: 'DELETE',
        url: '/api/contacts/',
        withCredentials: false,
        body: {
          user_id: user_id,
          id: id
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    } catch(err){
      console.log(err);
    }
  }
)

// UPDATE a users contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async( user_id, updateWhat, updateTo, token ) => {
    try{
      // with user_id, send two stringified arrays, one of the column names (str) and one
      // of the column value to set it to (also str)
      const res = await axios.patch({
        method: 'UPDATE',
        url: '/api/contacts/',
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: {
          user_id: user_id,
          updateWhat: updateWhat,
          updateTo: updateTo,
        }
      });
      return res.data;
    }catch(err){
      console.log(err);
    }
  }
)

// CREATE a contact for a user
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async( user_id, contactRows, contactValues, token) => {
    try{
      const res = await axios.create({
        method: 'CREATE',
        url: '/api/contacts/',
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: {
          user_id,
          contactRows,
          contactValues
        }
      });
      return res.data;
    }catch(err){
      console.log(err);
    }
  }
)

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contactResults: {},
    newContactStaging: {},
    contactInFocus: {},
    contactLoading: true,
    searchQuery: {
      user_id: "",
      first: "",
      last: "",
      type: "name",
      strValue: "",
    },
  },
  reducers: {
    updateContactInFocus: (state, action) => {
      if(action.payload.empty){
        state.contactInFocus = {};
        state.contactLoading = true;
      }else{
        state.contactInFocus = action.payload;
        state.contactLoading = false;
      }
    },
    setNewContactStaging: (state, action) => {
      newContactStaging = action.payload;
    },
    updateSearchQuery: (state, action) => {
      searchQuery = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.contacts.contactResults = action.payload;
      state.contacts.contactLoading = false;
      // sort results, highlights, anything
    });
    builder.addCase(getContacts.pending, (state, action) => {
      // loading or searching animation
      state.contactLoading = true;
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      // Once it's confirmed deleted, be sure the contact doesn't exist in the
      // state, and that the UI element is gone.
    });
    builder.addCase(deleteContact.pending, (state, action) => {
      // While it's pending deleted, remove the UI element and entry from local state.
      // If delete fails, call getContacts and refresh the state with a clean start.
      // Alert user of a problem (provide error)
    });
    builder.addCase(updateContact.fulfilled, (state, action) => {
      // Once confirmed updated, set state entry to updated entry.
      // If update fails, call getContacts and refresh the state with a clean start.
    });
    builder.addCase(updateContact.pending, (state, action) => {
      // While updating, make sure components render with updated info.
    });
  }
});

export default contactSlice.reducer;
export const {
  updateContactInFocus,
  setNewContactStaging,
  updateSearchQuery,
} = contactSlice.actions;