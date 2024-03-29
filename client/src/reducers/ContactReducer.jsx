import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

import SearchArray from '../helpers/searchArray';
import filterContacts from '../helpers/filterContacts';

// State for contact organizer:
// ASYNC thunks

// Return values: All thunks that change the db get a return copy of the item
// that was updated/created/deleted. This is returned to redux, to be used as confirmation
// that the action was successful and that the local client copy of the users
// contacts needs to be updated with the return value.

export const getUserContactsTable = createAsyncThunk(
  'contacts/getUserContactsTable',
  // received idAndToken object that has key:value pair user_id(clerk) and session
  // token(clerk) Returns all contacts associated with the user as [{}, {}]. Only for initial logon
  // and any sort of 'refresh' button if that gets built.
  async (idAndToken, thunkAPI) => {
    const config = {
      method: 'GET',
      url: '/api/contacts',
      withCredentials: false,
      params: {
        user_id: idAndToken.user_id
      },
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${idAndToken.token}`
      }
    };
    try {
      const res = await axios.get(`/api/contacts/`, config);
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// DELETE a users contact
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (deleteRequest, thunkAPI) => {
    const headers = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${deleteRequest.token}`
    };
    try {
      const res = await axios.delete(`/api/contacts/${deleteRequest.id}`, {
        headers
      });
      // response object should include the row that was deleted, used to
      // confirm that the delete occurred in the backend.
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// UPDATE a users contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (updateRequest, thunkAPI) => {
    try {
      // with user_id, send two arrays, one of the column names (str) and one
      // of the column value to set it to (also str)
      const { updateWhat, updateTo, token, id } = updateRequest;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        }
      };
      if (!updateWhat.length || !updateTo.length) {
        return [];
      } else {
        const body = {};
        for (let eachField = 0; eachField < updateWhat.length; eachField++) {
          if (updateTo[eachField] !== '' || null) {
            body[updateWhat[eachField]] = updateTo[eachField];
          }
        }
        const res = await axios.patch(`/api/contacts/${id}`, body, config);
        return res.data;
      }
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// CREATE a contact for a user
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (createRequest, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${createRequest.token}`
      }
    };
    try {
      const { token, ...body } = createRequest;
      const res = await axios.post('/api/contacts/', body, config);
      // returns a copy of the new record (with timestamp! important!)
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

export const getRecentContacts = createAsyncThunk(
  'contacts/getRecentContacts',
  // user_id, current time, notes with type === communications
  // filter out all notes by the associate job, removing any jobs that have no
  // contact linked.
  async (historyRequest, thunkAPI) => {
    const headers = {
      'Content-Type': 'application/json',
      authorization: `Bearer ${historyRequest.token}`
    };
    try {
      const res = await axios.post('api/contacts/recents/', {
        headers
      });
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    // Everything centers around the contactsCache and searchResults arrays
    // Whether it's CRUD functionality, or forms, searching the db, or
    // triggering toasts.
    contactsCache: [],
    searchResults: [],
    contactInFocus: {},
    contactSelected: false,
    contactsLoaded: false,
    searchFilters: [],
    printout: {}
  },
  reducers: {
    // pass in a new contact to look at
    updateContactInFocus: (state, action) => {
      if (action.payload === 'clear') {
        state.contactInFocus = {};
      } else {
        state.contactInFocus = action.payload;
      }
    },
    // toggle a value that triggers making the expanded contact page visible or not
    updateContactSelected: (state, action) => {
      if (!state.contactSelected) {
        state.contactSelected = true;
      } else {
        state.contactSelected = false;
      }
    },
    // Trigger a search on the contacts db using the current searchQuery in store
    // getContactsSearch: (state, action) => {
    //   let searchResults = SearchArray(
    //     action.payload.strValue,
    //     state.contactsCache,
    //     action.payload.type
    //   );
    //   let results = [];
    //   for (let result = 0; result < searchResults.length; result++) {
    //     results.push(state.contactsCache[searchResults[result]]);
    //   }
    //   state.searchResults = [...results];
    // },

    // SIMPLIFIED WAY of searching -> for name, it's for
    // firstName || lastName. Didn't have a chance to build for full name
    getContactsSearch: (state, action) => {
      const filteredContacts = filterContacts(
        action.payload.type,
        state.contactsCache,
        action.payload.keyword
      );

      state.searchResults = filteredContacts;
    },

    // reset the search filter and show all the cache contacts
    resetFilter: (state, action) => {
      state.searchResults = state.contactsCache;
    },

    // Filter out all the contacts that aren't is_priority === true
    getContactsPriority: (state, action) => {
      state.searchResults = state.contactsCache.filter(
        contact => contact.is_priority
      );
    }
  },
  extraReducers: builder => {
    builder.addCase(getUserContactsTable.fulfilled, (state, action) => {
      // prime the organizer with the entire users collection of contacts
      // with the return value from the async thunk
      state.contactsCache = action.payload;
      state.searchResults = action.payload;
      state.contactsLoaded = true;
      toast.dismiss('getUserContactsTable');
    });
    builder.addCase(getUserContactsTable.pending, (state, action) => {
      toast.loading('Loading Contacts...', {
        toastId: 'getUserContactsTable'
      });
    });
    builder.addCase(getUserContactsTable.rejected, (state, action) => {
      toast.update('getUserContactsTable', {
        render: 'Your contacts are temporarily unavailable, please try again',
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 2000
      });
      action.payload.forEach(error => toast.error(error, { autoClose: 2000 }));
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      // Remove that specific object from the array of contacts locally
      // matching it with the return value from the async thunk
      state.contactsCache = state.contactsCache.filter(
        contact => contact.id !== state.contactInFocus.id
      );
      // Also, if the user was clicking in some search results,
      // make sure the search results update, too.
      state.searchResults = state.searchResults.filter(
        contact => contact.id !== state.contactInFocus.id
      );
      state.contactSelected = false;
      toast.update('deleteContact', {
        render: 'Successfully Deleted a Contact',
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 2000
      });
    });
    builder.addCase(deleteContact.pending, (state, action) => {
      // While it's pending deleted, load toastify message ("delete pending")
      toast.loading('deleting...', {
        toastId: 'deleteContact'
      });
    });
    builder.addCase(deleteContact.rejected, (state, action) => {
      // display toastify (`delete failed, ${error}`) etc etc
      // Delete failed, leave the state as is, but maybe log this somewhere
      // for us to notice.
      toast.update('deleteContact', {
        render: 'There was a problem deleting this contact',
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 4000
      });
      action.payload.forEach(error => toast.error(error));
    });
    builder.addCase(updateContact.fulfilled, (state, action) => {
      // Find the contacts in the contactsCache and searchResults, then
      // update the values if they exist with the return value from
      // async thunk
      state.contactInFocus = action.payload;
      const contactsCacheIndex = SearchArray(
        `${action.payload.id}`,
        state.contactsCache,
        'id'
      );
      const searchResultsIndex = SearchArray(
        `${action.payload.id}`,
        state.searchResults,
        'id'
      );
      if (contactsCacheIndex === -1) {
        // weird error?
        toast('contact not found on client side copy');
      } else if (searchResultsIndex === -1) {
        state.contactsCache[contactsCacheIndex] = action.payload;
      } else {
        state.contactsCache[contactsCacheIndex] = action.payload;
        state.searchResults[searchResultsIndex] = action.payload;
      }
      state.contactSelected = false;
      toast.dismiss('updateContact');
    });
    builder.addCase(updateContact.pending, (state, action) => {
      // While updating, make sure components render with updated info.
      toast.loading('Updating Contact...', {
        toastId: 'updateContact'
      });
    });
    builder.addCase(updateContact.rejected, (state, action) => {
      toast.update('updateContact', {
        render: 'Update unsuccessful, please try again',
        isLoading: false
      });
      action.payload.forEach(error => toast.error(error));
    });
    builder.addCase(createContact.fulfilled, (state, action) => {
      // Reset the variable that says the user is in process of creating a contact
      // add the return value from async thunk to both arrays contactsCache/searchResults
      state.newContactStaging = false;
      state.contactsCache.push(action.payload);
      state.searchResults.push(action.payload);
      state.contactInFocus = action.payload;
      state.contactSelected = false;
      toast.dismiss('createContact');
    });
    builder.addCase(createContact.pending, (state, action) => {
      toast.loading('Creating New Contact...', {
        toastId: 'createContact'
      });
    });
    builder.addCase(createContact.rejected, (state, action) => {
      toast.update('createContact', {
        render: 'There was a problem adding to contacts, please try again',
        isLoading: false,
        autoClose: 4000
      });
      action.payload.forEach(error => toast.error(error));
    });
  }
});

export default contactSlice.reducer;
export const {
  updateContactInFocus,
  setNewContactStaging,
  getContactsSearch,
  getContactsPriority,
  updateContactSelected,
  resetFilter
} = contactSlice.actions;
