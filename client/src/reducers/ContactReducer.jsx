import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// State structure of a contact organizer:

// 1) Current contact in focus(either displayed front and center, or in an overlay/modal)
// 2) All contacts belonging to user
// 3) Search filters/tags? for queries

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
      linked_job_opening: 'https://www.averterofevil.org/jobs/mortal/engineering/uxdesigner',
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
      linked_job_opening: 'https://www.learntocode.org/jobs/engineering/engineerintesting',
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
      linked_job_opening: 'https://crossroads.time/jobs/immortal/engineering/pixelwizard',
      timestamp: '2023-01-09 16:30:49',
    },
]

// READ all contacts for a user
export const getContactsWithUserId = createAsyncThunk(
  'contacts/getAllContacts',
  async ( user_id, first, last, thunkAPI ) => {
    try {
        // Send user_id from clerk, along with first, last in req.body
        // Call to cross origin backend
        const res = await axios.get({
          method: 'GET',
          url: '/api/contacts/',
          withCredentials: false,
          params: {
            user_id,
            first,
            last
          }
        });
        return res.data;
    } catch (err) {
      console.log(err);
    }
  }
);

// DELETE a users contact
export const deleteContactWithUserId = createAsyncThunk(
  'contacts/deleteContact',
  async( user_id, id ) => {
    try {
      console.log(user_id, id)
      // const res = await axios.delete('api/contacts/');
      const res = await axios.delete({
        method: 'DELETE',
        url: '/api/contacts/',
        withCredentials: false,
        params: {
          user_id,
          id
        }
      });
      // return res.data;
    } catch(err){
      console.log(err);
    }
  }
)

// UPDATE a users contact
export const updateContactWithUserId = createAsyncThunk(
  'contacts/updateContact',
  async( user_id, updateRows, updateValues ) => {
    try{
      console.log(user_id, updateRows, updateValues)
      // const res = await axios.patch('api/contacts/');
      const res = await axios.patch({
        method: 'UPDATE',
        url: '/api/contacts/',
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          
        },
        params: {
          user_id,
          first,
          last
        }
      });
      // return res.data;
    }catch(err){
      console.log(err);
    }
  }
)

// CREATE a contact for a user
export const createNewContactWithUserId = createAsyncThunk(
  'contacts/createContact',
  async( user_id, contactRows, contactValues) => {
    try{
      console.log(user_id, contactRows, contactValues)
      // const res = await axios.post('api/contacts/');
      // return res.data;
    }catch(err){
      console.log(err);
    }
  }
)

const initialState = {
    contacts: [],
    selectedContact: null,
    loading: false
}

const contactSlice = createSlice({
  name: 'contact',
  initialState,

  extraReducers: builder => {
    // call the action here and then action.payload is whatever the returned value from the action (res.data).
    // .fulfilled is if the action is successful, basically
    builder.addCase(getContactsWithUserId.fulfilled, (state, action) => {
      state.contacts = action.payload;
      state.loading = false;
      // delete this later. it's just to check if this triggers
      console.log('getContactsWithUserId is triggered');
    }); 
  }
});

// export const {} = contactSlice.actions; for non async/db related reducers 
// i.e. reducers: { <reducerName>: (store, {payload}) => {} };
export default contactSlice.reducer;