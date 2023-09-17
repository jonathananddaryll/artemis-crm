import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

import SearchArray from "../helpers/searchArray";

// State for contact organizer:

// ASYNC thunks

export const getUserContactsTable = createAsyncThunk(
  "contacts/getUserContactsTable",
  // received idAndToken object that has key:value pair user_id(clerk) and session token(clerk)
  // Returns all contacts associated with the user. Only for initial logon and any sort of 'refresh' button.
  async (idAndToken, thunkAPI) => {
    const config = {
      method: "GET",
      url: "/api/contacts",
      withCredentials: false,
      params: {
        user_id: idAndToken.user_id,
      },
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${idAndToken.token}`,
      },
    };
    try {
      const res = await axios.get(`/api/contacts/`, config);
      return res.data;
    } catch (err) {
      // If error, do I need different handling for refresh or initialization? no, this should be handled in redux.
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// DELETE a users contact
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (deleteRequest, thunkAPI) => {
    const headers = {
      authorization: `Bearer ${deleteRequest.token}`,
    };
    try {
      const res = await axios.delete("/api/contacts/", {
        data: { deleteRequest },
        headers,
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
  "contacts/updateContact",
  async (updateRequest, thunkAPI) => {
    try {
      // with user_id, send two stringified arrays, one of the column names (str) and one
      // of the column value to set it to (also str)
      const { user_id, updateWhat, updateTo, token, id } = updateRequest;
      const config = {
        withCredentials: false,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const body = {
        user_id: user_id,
        updateWhat: updateWhat,
        updateTo: updateTo,
        id: id,
      };
      const res = await axios.patch("/api/contacts/", body, config);
      // Response object should include the row that was successfully updated, so
      // to confirm contactsCache is synced.
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// CREATE a contact for a user
export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (createRequest, thunkAPI) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${createRequest.token}`,
      },
    };
    try {
      const res = await axios.post("/api/contacts/", createRequest, config);
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

export const getRecentContacts = createAsyncThunk(
  "contacts/getRecentContacts",
  // user_id, current time, notes with type === communications
  // filter out all notes by the associate job, removing any jobs that have no
  // contact linked.
  async (historyRequest, thunkAPI) => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${historyRequest.token}`,
    };
    try {
      const res = await axios.post("api/contacts/recents", {
        headers,
        ...historyRequest,
      });
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contactsCache: [],
    searchResults: [],
    newContactStaging: false,
    contactInFocus: {},
    contactSelected: false,
    contactsLoading: true,
    searchQuery: {
      type: "name",
      strValue: "",
    },
    searchFilters: [],
    printout: {},
  },
  reducers: {
    updateContactInFocus: (state, action) => {
      if (action.payload === "clear") {
        state.contactInFocus = {};
        state.contactsLoading = false;
      } else {
        state.contactInFocus = action.payload;
        state.contactsLoading = false;
      }
    },
    updateContactSelected: (state, action) => {
      if (!state.contactSelected) {
        state.contactSelected = true;
      } else {
        state.contactSelected = false;
        // anything to wrap up the contactForm? If canceling, should there be a message?
        // if done, should there be a message?
        // should contactInFocus be set to empty again?
      }
    },
    setNewContactStaging: (state, action) => {
      state.newContactStaging = action.payload;
    },
    updateSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    getContactsSearch: (state, action) => {
      // action.payload is not needed if request is already in searchQuery
      // action.payload if only for updating UI with CRUD actions
      let searchResults = SearchArray(
        state.searchQuery.strValue,
        state.contactsCache,
        state.searchQuery.type
      );
      let results = [];
      for (let result = 0; result < searchResults.length; result++) {
        results.push(state.contactsCache[searchResults[result]]);
      }
      state.searchResults = [...results];
    },
    getContactsPriority: (state, action) => {
      state.searchResults = state.contactsCache.filter(
        (element) => element.is_priority
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserContactsTable.fulfilled, (state, action) => {
      state.contactsCache = action.payload;
      state.searchResults = action.payload;
      state.contactsLoading = false;
      toast.dismiss("getUserContactsTable");
    });
    builder.addCase(getUserContactsTable.pending, (state, action) => {
      state.contactsLoading = true;
      toast.loading("loading contacts...", {
        toastId: "getUserContactsTable",
      });
    });
    builder.addCase(getUserContactsTable.rejected, (state, action) => {
      toast.update("getUserContactsTable", {
        render: "Your contacts are temporarily unavailable, please try again",
        type: toast.TYPE.ERROR,
        isLoading: false,
      });
      action.payload.forEach((error) =>
        toast.error(error, { autoClose: 4000 })
      );
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contactsCache = state.contactsCache.filter(
        (element) => element.id !== state.contactInFocus.id
      );
      state.searchResults = state.searchResults.filter(
        (element) => element.id !== state.contactInFocus.id
      )
      state.contactSelected = false;
      toast.update("deleteContact", {
        render: "delete successful",
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 4000,
      });
    });
    builder.addCase(deleteContact.pending, (state, action) => {
      // While it's pending deleted, load toastify message ("delete pending")
      toast.loading("deleting...", {
        toastId: "deleteContact",
      });
    });
    builder.addCase(deleteContact.rejected, (state, action) => {
      // display toastify (`delete failed, ${error}`) etc etc
      // Delete failed, leave the state as is, but maybe log this somewhere
      // for us to notice.
      toast.update("deleteContact", {
        render: "there was a problem deleting this contact",
        type: toast.TYPE.ERROR,
        isLoading: false,
      });
      action.payload.forEach((error) =>
        toast.error(error, { autoClose: 4000 })
      );
    });
    builder.addCase(updateContact.fulfilled, (state, action) => {
      state.contactInFocus = JSON.stringify(action.payload[0]);
      const index = state.contactsCache.findIndex(contact => contact.id === state.contactInFocus.id);
      state.printout = index
      if (index !== -1) {
        state.contactsCache[index] = state.contactInFocus;
        const searchResultIndex = state.searchResults.findIndex((contact) => contact.id === state.contactInFocus.id);
        if(searchResultIndex !== -1){
          state.printout = "blah blah"
          state.searchResults[searchResultIndex] = state.contactInFocus;
        }
      }
      state.contactSelected = false;
      toast.dismiss("updateContact");
    });
    builder.addCase(updateContact.pending, (state, action) => {
      // While updating, make sure components render with updated info.
      toast.loading("updating contact...", {
        toastId: "updateContact",
      });
    });
    builder.addCase(updateContact.rejected, (state, action) => {
      toast.update("updateContact", {
        render: "update unsuccessful, please try again",
        isLoading: false,
      });
      action.payload.forEach((error) =>
        toast.error(error, { autoClose: 4000 })
      );
    });
    builder.addCase(createContact.fulfilled, (state, action) => {
      state.newContactStaging = false;
      state.contactsCache.push(contactInFocus);
      state.contactSelected = false;
      toast.dismiss("createContact");
    });
    builder.addCase(createContact.pending, (state, action) => {
      toast.loading("adding to contacts...", {
        toastId: "createContact",
      });
    });
    builder.addCase(createContact.rejected, (state, action) => {
      toast.update("createContact", {
        render: "there was a problem adding to contacts, please try again",
        isLoading: false,
      });
      action.payload.forEach((error) =>
        toast.error(error, { autoClose: 4000 })
      );
    });
  },
});

export default contactSlice.reducer;
export const {
  updateContactInFocus,
  setNewContactStaging,
  clearContactInFocus,
  getContactsSearch,
  getContactsPriority,
  updateSearchQuery,
  updateContactSelected,
} = contactSlice.actions;
