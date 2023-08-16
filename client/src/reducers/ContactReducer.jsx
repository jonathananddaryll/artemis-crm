import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// State for contact organizer:

// ASYNC thunks

// TODO: Async thunks for the client side contacts db
  // Create, Read, Delete are easy,
  // Update is the same, only I need a function that passes the whole new contact
  // object. Immer will abstract this for me if I do it in redux.

export const getUserContactsTable = createAsyncThunk(
    'contacts/getUserContactsTable',
    // received idAndToken object that has key:value pair user_id(clerk) and session token(clerk)
    // Returns all contacts associated with the user. Only for initial logon and any sort of 'refresh' button.
  async ( idAndToken, thunkAPI) => {
    try{
      const config = {
        method: 'GET',
        url: '/api/contacts',
        withCredentials: false,
        params: {
          user_id: idAndToken.user_id
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idAndToken.token}`
        }
      };
      const res = await axios.get(`/api/contacts/`, config);
      return res.data;
    }catch{
      // If error, do I need different handling for refresh or initialization? no, this should be handled in redux.
      return { msg: "server error" };
    }
  }
);

// DEPRECATING
// TODO: rewrite the backend api to not require the parameters from this async thunk, and then
// TODO: all you have to do is rewrite the new getUserContactsTable to say getContacts, and that's it.
// Search within all contacts for a user
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
  async( deleteRequest, thunkAPI ) => {
    try {
      const { user_id, id, token } = deleteRequest;
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
      return {
        msg: "delete failed",
        id: id,
      }
    }
  }
);

// UPDATE a users contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async( updateRequest, thunkAPI ) => {
    try{
      // with user_id, send two stringified arrays, one of the column names (str) and one
      // of the column value to set it to (also str)
      const { user_id, updateWhat, updateTo, token } = updateRequest;
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
      return {
        msg: "update failed",
        id: updateWhat,
        saved_form: updateTo
      };
    };
  },
);

// CREATE a contact for a user
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async( createRequest, thunkAPI ) => {
    try{
      const { user_id, contactRows, contactValues, token } = createRequest;
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
      return {
        msg: "create failed",
        saved_form: [contactRows, contactValues]
      }
    }
  }
)

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contactsCache: {},
    contactResults: [],
    newContactStaging: {},
    contactInFocus: {},
    contactsLoading: true,
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
      state.newContactStaging = action.payload;
    },
    clearNewContactStaging: (state, action) => {
      state.newContactStaging = {};
    },
    clearContactInFocus: (state, action) => {
      state.contactInFocus = {}
    },
    updateSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    searchContactsCache: (state, action) => {
      // using searchQuery, parse the search into it's type and string values
      // validate the search parameters and search the contactsCache for the 
      // contact matching those filters.
      // set contactResults equal to the results of the search
    }
  },
  extraReducers: builder => {
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.contactResults = action.payload;
      state.contactLoading = false;
      // This will be the destination for data coming from the current getUserContactsTable
      // thunk.
      // 1) set contactsCache equal to the payload.
      // 2) change a state to track that initial loading set was received?
    });
    builder.addCase(getContacts.pending, (state, action) => {
      // loading or searching animation
      state.contactLoading = true;
    });
    builder.addCase(getContacts.rejected, (state, action) => {
      // if state tracking initial load says already successful, return 
      // a msg that refresh was unsuccessful
      // Otherwise return error based on backend response (no contacts,
      // no user by that name, etc) and send to toastify
    })
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      // find the contact in the contactsCache, and delete it.
      // set contact in focus to empty, and display toastify msg that delete was successful.
    });
    builder.addCase(deleteContact.pending, (state, action) => {
      // While it's pending deleted, load toastify message ("delete pending")
    });
    builder.addCase(deleteContact.rejected, (state, action) => {
      // display toastify (`delete failed, ${error}`) etc etc
    })
    builder.addCase(updateContact.fulfilled, (state, action) => {
      // Once confirmed updated, set state entry to updated entry.
      // If update fails, call getContacts and refresh the state with a clean start.
    });
    builder.addCase(updateContact.pending, (state, action) => {
      // While updating, make sure components render with updated info.
    });
    builder.addCase(updateContact.rejected, (state, action) => {
      // display toastify (`update was unsuccessful, ${error}`)
      // do not reset the form or reload the component, just let the user
      // do that if they want to. Keep the newContactStaging value in handy
    });
    builder.addCase(createContact.fulfilled, (state, action) => {
      // add newContactStaging to contactsCache
      // display toastify msg (`creation successful`)
      // toggle 'edit mode' off
    });
    builder.addCase(createContact.pending, (state, action) => {
      // display loading animation?
    });
    builder.addCase(createContact.rejected, (state, action) => {
      // display toastify msg (`creation unsuccessful`)
      // let use reset or leave the page
    })
  }
});

export default contactSlice.reducer;
export const {
  updateContactInFocus,
  setNewContactStaging,
  updateSearchQuery,
} = contactSlice.actions;