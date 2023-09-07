import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SearchArray from "../helpers/searchArray";
import axios from "axios";

// State for contact organizer:

// ASYNC thunks

// TODO: Async thunks for the client side contacts db
// Create, Read, Delete are easy,
// Update is the same, only I need a function that passes the whole new contact
// object. Immer will abstract this for me if I do it in redux.

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
        Authorization: `Bearer ${idAndToken.token}`,
      },
    };
    try {
      const res = await axios.get(`/api/contacts/`, config);
      return res.data;
    } catch (error) {
      console.log(error);
      // If error, do I need different handling for refresh or initialization? no, this should be handled in redux.
      return { msg: "server error" };
    }
  }
);

// DEPRECATING
// TODO: rewrite the backend api to not require the parameters from this async thunk, and then
// TODO: all you have to do is rewrite the new getUserContactsTable to say getContacts, and that's it.
// Search within all contacts for a user
// export const getContactsSearch = createAsyncThunk(
//   'contacts/getContactsSearch',
//   async ( searchQuery, thunkAPI ) => {
//     try {
//         // Send user_id from clerk, along with first, last in req.body
//         const params = {
//           user_id: searchQuery.user_id,
//           type: searchQuery.type
//         }
//         if(params.type === 'name'){
//           params.first = searchQuery.first;
//           params.last = searchQuery.last;
//         }else if(params.type === 'init'){

//         }else{
//           params.strValue = searchQuery.strValue;
//         }
//         const config = {
//           method: 'GET',
//           url: '/api/contacts/search',
//           withCredentials: false,
//           params: {
//             ...params
//           },
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${searchQuery.token}`
//           }
//         }
//         const res = state.
//         console.log(res)
//         return res.data;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// );

// DELETE a users contact
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (deleteRequest, thunkAPI) => {
    const config = {
      data: {deleteRequest},
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${deleteRequest.token}`,
      }
    }
    try {
      const res = await axios.delete("/api/contacts/", config);
      // response object should include the row that was deleted, used to
      // confirm that the delete occurred in the backend.
      return res.data;
    } catch (err) {
      return {
        msg: "delete failed",
        id: id,
      };
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
      console.log(user_id, updateWhat, updateTo, token)
      const config = {
        withCredentials: false,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      }
      const body = {
        user_id: user_id,
        updateWhat: updateWhat,
        updateTo: updateTo,
        id: id
      }
      const res = await axios.patch("/api/contacts/", body, config);
      // Response object should include the row that was successfully updated, so
      // to confirm contactsCache is synced.
      return res.data;
    } catch (err) {
      return {
        msg: "update failed",
        id: updateWhat,
        saved_form: updateTo,
      };
    }
  }
);

// CREATE a contact for a user
export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (createRequest, thunkAPI) => {
    const { user_id, contactRows, contactValues, token } = createRequest;
    const config = {
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }
    const body = {
      user_id: user_id,
      contactRows: contactRows,
      contactValues: contactValues,
    }
    try {
      const res = await axios.post("/api/contacts/", body, config);
      return res.data;
    } catch (err) {
      return {
        msg: "create failed",
        saved_form: [contactRows, contactValues],
      };
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
      // action.payload is not needed, request is already in searchQuery
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
      // if there is anything else to do for first load, do it
      state.contactsLoading = false;
    });
    builder.addCase(getUserContactsTable.pending, (state, action) => {
      // loading or searching animation
      state.contactsLoading = true;
    });
    builder.addCase(getUserContactsTable.rejected, (state, action) => {
      // return payload is { msg: "error" }
      // if state tracking setup cache says it was already set up once, return
      // a msg that refresh was unsuccessful
      // Otherwise return error based on backend response (no contacts,
      // no user by that name, etc) and send to toastify
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      // since contactsCache is an array, I need the index of the contact,
      // then I delete it using slice.
      // i.e.
      // action.payload is the
      // state.contactInFocus = state.contactInFocus.splice(startingIndex, 1(for 1 element removing))
      // toastify msg for successful DELETE
      console.log(action.payload)
    });
    builder.addCase(deleteContact.pending, (state, action) => {
      // While it's pending deleted, load toastify message ("delete pending")
    });
    builder.addCase(deleteContact.rejected, (state, action) => {
      // display toastify (`delete failed, ${error}`) etc etc
      // Delete failed, leave the state as is, but maybe log this somewhere
      // for us to notice.
    });
    builder.addCase(updateContact.fulfilled, (state, action) => {
      // Once confirmed updated, set state entry to updated entry.
      // If update fails, call getContacts and refresh the state with a clean start.
      // have redux wait for a successful response to:
      state.contactInFocus = action.payload;
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
