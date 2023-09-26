import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import findIndex from '../helpers/findIndex';

// Get All Timeline with jobId
export const getAllTimelines = createAsyncThunk(
  'timeline/getAllTimeslineWithJobId',
  async (job_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/timelines/job/${job_id}`);
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Creates a new Note
export const createNote = createAsyncThunk(
  'note/createNote',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.post('/api/notes', formData, config);
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Updates a note
export const updateNote = createAsyncThunk(
  'note/updateNote',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/notes/${formData.noteId}`,
        formData,
        config
      );
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Get All Notes with jobId
export const getAllNotes = createAsyncThunk(
  'note/getAllNotesWithJobId',
  async (job_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/notes/job/${job_id}`);
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Deletes a note
export const deleteNote = createAsyncThunk(
  'note/deleteNote',
  async (formData, thunkAPI) => {
    const headers = {
      Authorization: `Bearer ${formData.token}`
    };

    try {
      const res = await axios.delete(`/api/notes/${formData.noteId}`, {
        data: { formData },
        headers
      });

      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Get All Tasks with jobId
export const getAllTasks = createAsyncThunk(
  'task/getAllTasksWithJobId',
  async (job_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/tasks/job/${job_id}`);
      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Creates a new Task
export const createTask = createAsyncThunk(
  'task/createTask',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.post('/api/tasks', formData, config);
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/tasks/${formData.taskId}/info`,
        formData,
        config
      );
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Updates a task status
export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.patch(
        `/api/tasks/${formData.taskId}/status`,
        formData,
        config
      );
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// Deletes a task
export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (formData, thunkAPI) => {
    const headers = {
      Authorization: `Bearer ${formData.token}`
    };

    try {
      const res = await axios.delete(`/api/tasks/${formData.taskId}`, {
        data: { formData },
        headers
      });

      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

// Get All LinkedContact with jobId
export const getAllLinkedContactsWithJobId = createAsyncThunk(
  'contact/getAllLinkedContactsWithJobId',
  async (job_id, thunkAPI) => {
    try {
      const res = await axios.get(`/api/jobcontact/job/${job_id}`);

      return res.data;
    } catch (err) {
      // have a better error catch later
      console.log(err);
    }
  }
);

export const getContactsToLink = createAsyncThunk(
  'contact/getContactsToLink',
  async (idAndToken, thunkAPI) => {
    const config = {
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

// Create new contact link
export const linkContact = createAsyncThunk(
  'contact/linkContact',
  async (formData, thunkAPI) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${formData.token}`
      }
    };

    try {
      const res = await axios.post('/api/jobcontact', formData, config);
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

// (Delete) Unlink contacts
export const unlinkContact = createAsyncThunk(
  'contact/unlinkContact',
  async (formData, thunkAPI) => {
    const { id, jobId, contactId, token } = formData;
    const headers = {
      Authorization: `Bearer ${token}`
    };

    console.log(formData);

    try {
      const res = await axios.delete(
        `/api/jobcontact/${id}/job/${jobId}/contact/${contactId}`,
        {
          data: formData,
          headers
        }
      );
      return res.data;
    } catch (err) {
      // If there's errors
      const errors = err.response.data.errors;
      return thunkAPI.rejectWithValue(errors);
    }
  }
);

async (formData, thunkAPI) => {
  const headers = {
    Authorization: `Bearer ${formData.token}`
  };

  try {
    const res = await axios.delete(`/api/notes/${formData.noteId}`, {
      data: { formData },
      headers
    });

    return res.data;
  } catch (err) {
    // have a better error catch later
    console.log(err);
  }
};
const selectedJobSlice = createSlice({
  name: 'selectedJob',
  initialState: {
    timelinesLoading: true,
    notesLoading: true,
    tasksLoading: true,
    availableContactsLoading: true,
    timelines: [],
    notes: [],
    tasks: [],
    completedTasks: [],
    interviews: [],
    completedInterviews: [],
    linkedContacts: [],
    availableContacts: []
  },
  reducers: {
    resetSelectedJobItems: (state, action) => {
      state.timelinesLoading = true;
      state.notesLoading = true;
      state.tasksLoading = true;
      state.linkedContactsLoading = true;
      state.availableContactsLoading = true;
      state.timelines = [];
      state.notes = [];
      state.tasks = [];
      state.interviews = [];
      state.completedInterviews = [];
      state.completedTasks = [];
      state.linkedContacts = [];
      state.availableContacts = [];
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllTimelines.fulfilled, (state, action) => {
      state.timelines = action.payload;
      state.timelinesLoading = false;
    });

    builder.addCase(getAllNotes.fulfilled, (state, action) => {
      state.notes = action.payload;
      state.notesLoading = false;
    });

    builder.addCase(createNote.pending, () => {
      toast.loading('Creating New Note', {
        toastId: 'creatingNote'
      });
    });

    builder.addCase(createNote.fulfilled, (state, action) => {
      state.notes = [action.payload[0].rows[0], ...state.notes];
      state.timelines = [action.payload[1].rows[0], ...state.timelines];

      toast.dismiss('creatingNote');
      toast.success('Successfully Created New Note');
    });

    // Display errors in createNote with toastify
    builder.addCase(createNote.rejected, (state, action) => {
      toast.dismiss('creatingNote');
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(updateNote.pending, () => {
      toast.loading('Updating Note', {
        toastId: 'updatingNote'
      });
    });

    builder.addCase(updateNote.fulfilled, (state, action) => {
      // Find the index of the updated note then change it to the updated note
      const index = findIndex(state.notes, action.payload.id);
      state.notes[index] = action.payload;

      toast.dismiss('updatingNote');
      toast.success('Successfully Updated Note');
    });

    // Display errors in updateNote with toastify
    builder.addCase(updateNote.rejected, (state, action) => {
      toast.dismiss('updatingNote');
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(deleteNote.pending, () => {
      toast.loading('Deleting Note', {
        toastId: 'deletingNote'
      });
    });

    builder.addCase(deleteNote.fulfilled, (state, action) => {
      // Filter notes without the deleted note
      state.notes = state.notes.filter(
        note => note.id !== action.payload[0].rows[0].id
      );
      state.timelines = [action.payload[1].rows[0], ...state.timelines];

      toast.dismiss('deletingNote');
      toast.success('Successfully Deleted Note');
    });

    // @TODO: CREATE A BETTER REJECTED MESSAGE
    builder.addCase(deleteNote.rejected, () => {
      toast.dismiss('deletingNote');
      toast.error('Delete Failed');
    });

    builder.addCase(getAllTasks.fulfilled, (state, action) => {
      const tasks = action.payload;
      state.tasks = tasks.filter(task => task.is_done === false);
      state.completedTasks = tasks.filter(task => task.is_done === true);
      state.tasksLoading = false;

      // Upcoming Interviews
      state.interviews = tasks.filter(
        task =>
          (task.category.includes('e Interview') ||
            task.category.includes('Screen')) &&
          task.is_done === false
      );

      // Completed Interviews
      state.completedInterviews = tasks.filter(
        task =>
          (task.category.includes('e Interview') ||
            task.category.includes('Screen')) &&
          task.is_done === true
      );
    });

    builder.addCase(createTask.pending, () => {
      toast.loading('Creating New Task', {
        toastId: 'creatingTask'
      });
    });

    builder.addCase(createTask.fulfilled, (state, action) => {
      const newAddedTask = action.payload[0].rows[0];
      newAddedTask.is_done === false
        ? (state.tasks = [newAddedTask, ...state.tasks])
        : (state.completedTasks = [newAddedTask, ...state.completedTasks]);
      state.timelines = [action.payload[1].rows[0], ...state.timelines];

      // Check if the new added task is interview or screen type
      if (
        newAddedTask.category.includes('e Interview') ||
        newAddedTask.category.includes('Screen')
      ) {
        state.interviews = [newAddedTask, ...state.interviews];
      }

      toast.dismiss('creatingTask');
      toast.success('Successfully Created New Task');
    });

    // Display errors in createTask with toastify
    builder.addCase(createTask.rejected, (state, action) => {
      toast.dismiss('creatingTask');
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(updateTask.pending, () => {
      toast.loading('Updating Task', {
        toastId: 'updatingTask'
      });
    });

    builder.addCase(updateTask.fulfilled, (state, action) => {
      const updatedTask = action.payload[0].rows[0];

      // Delete Old Task from state.tasks and state.completedTasks
      state.tasks = state.tasks.filter(task => task.id !== updatedTask.id);
      state.completedTasks = state.completedTasks.filter(
        task => task.id !== updatedTask.id
      );

      // Add updated task to tasks/completedTasks.
      // Did it this way instead of updating the current value in index
      // because user might change the status of the task.
      updatedTask.is_done === false
        ? (state.tasks = [updatedTask, ...state.tasks])
        : (state.completedTasks = [updatedTask, ...state.completedTasks]);

      state.timelines = [action.payload[1].rows[0], ...state.timelines];

      // Check if the new added task is interview or screen type
      if (
        updatedTask.category.includes('e Interview') ||
        updatedTask.category.includes('Screen')
      ) {
        // Deletes old task/interview
        state.interviews = state.interviews.filter(
          task => task.id !== updatedTask.id
        );
        state.completedInterviews = state.completedInterviews.filter(
          task => task.id !== updatedTask.id
        );

        // Add the updated task
        if (updatedTask.is_done === false) {
          state.interviews = [updatedTask, ...state.interviews];
        } else {
          state.completedInterviews = [
            updatedTask,
            ...state.completedInterviews
          ];
        }
      }

      toast.dismiss('updatingTask');
      toast.success('Successfully Updated Task');
    });

    // Display errors in updateTask with toastify
    builder.addCase(updateTask.rejected, (state, action) => {
      toast.dismiss('updatingTask');
      action.payload.forEach(error => toast.error(error, { autoClose: 4000 }));
    });

    builder.addCase(updateTaskStatus.pending, () => {
      toast.loading('Updating Task Status', {
        toastId: 'updatingTaskStatus'
      });
    });

    builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
      // Find the index of the updated task then change it to the updated task
      let updatedTask = action.payload;

      ///////////////// HAVE A REDUCER FROM BOARDERDUCER THAT ADDS 1 TO THE INCOMPLETE_TASK_COUNT WHEN A USER IS ADDING A TASK. DEDUCT 1 IF THE USER COMPLETED A TASK
      if (updatedTask.is_done === true) {
        // const filteredTasks = state.tasks.filter(
        //   task => task.id !== updatedTask.id
        // );
        state.tasks = state.tasks.filter(task => task.id !== updatedTask.id);
        state.completedTasks = [...state.completedTasks, updatedTask];

        // Updates the completedInterview
        if (
          updatedTask.category.includes('e Interview') ||
          updatedTask.category.includes('Screen')
        ) {
          // Take out the updated task
          // const filteredInterviews = state.interviews.filter(
          //   task => task.id !== updatedTask.id
          // );
          state.interviews = state.interviews.filter(
            task => task.id !== updatedTask.id
          );

          // Add updated task
          state.completedInterviews = [
            ...state.completedInterviews,
            updatedTask
          ];
        }

        toast.dismiss('updatingTaskStatus');
        toast.success('Good Job Completing a Task');
      } else {
        // const filteredTasks = state.completedTasks.filter(
        //   task => task.id !== updatedTask.id
        // );
        state.completedTasks = state.completedTasks.filter(
          task => task.id !== updatedTask.id
        );
        state.tasks = [...state.tasks, updatedTask];

        // Updates the interview
        if (
          updatedTask.category.includes('e Interview') ||
          updatedTask.category.includes('Screen')
        ) {
          // Take out the updated task
          // const filteredInterviews = state.completedInterviews.filter(
          //   task => task.id !== updatedTask.id
          // );
          state.completedInterviews = state.completedInterviews.filter(
            task => task.id !== updatedTask.id
          );

          // Add updated Task
          state.interviews = [...state.interviews, updatedTask];
        }

        toast.dismiss('updatingTaskStatus');
        toast.success('Dont Forget to Finish That Task');
      }
    });

    // @TODO: CREATE A BETTER REJECTED MESSAGE
    builder.addCase(updateTaskStatus.rejected, () => {
      toast.dismiss('updatingTaskStatus');
      toast.error('Update Failed');
    });

    builder.addCase(deleteTask.pending, () => {
      toast.loading('Deleting Task', {
        toastId: 'deletingTask'
      });
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      // Filter notes without the deleted note
      const deletedTask = action.payload[0].rows[0];

      if (deletedTask.is_done === false) {
        state.tasks = state.tasks.filter(task => task.id !== deletedTask.id);

        // Remove the deleted task in the interviews if the task is an interview type
        if (
          deletedTask.category.includes('e Interview') ||
          deletedTask.category.includes('Screen')
        ) {
          state.interviews = state.interviews.filter(
            task => task.id !== deletedTask.id
          );
        }
      } else {
        state.completedTasks = state.completedTasks.filter(
          task => task.id !== deletedTask.id
        );

        // Remove the deleted task in the completedinterviews if the task is an interview type
        if (
          deletedTask.category.includes('e Interview') ||
          deletedTask.category.includes('Screen')
        ) {
          state.completedInterviews = state.completedInterviews.filter(
            task => task.id !== deletedTask.id
          );
        }
      }

      state.timelines = [action.payload[1].rows[0], ...state.timelines];

      toast.dismiss('deletingTask');
      toast.success('Successfully Deleted Task');
    });

    // @TODO: CREATE A BETTER REJECTED MESSAGE
    builder.addCase(deleteTask.rejected, () => {
      toast.dismiss('deletingTask');
      toast.error('Delete Failed');
    });

    builder.addCase(
      getAllLinkedContactsWithJobId.fulfilled,
      (state, action) => {
        state.linkedContacts = action.payload;
        state.linkedContactsLoading = false;
      }
    );

    builder.addCase(linkContact.pending, (state, action) => {
      toast.loading('Linking Contact', {
        toastId: 'linkingContact'
      });
    });

    builder.addCase(linkContact.fulfilled, (state, action) => {
      const index = findIndex(
        state.availableContacts,
        action.payload.contact_id
      );

      // Get the contact that just successfully linked from availableContacts
      // and change id and contact_id and then filter the availableContacts
      // without the newly linked contact
      let newLinkedContact = state.availableContacts.splice(index, 1)[0];
      console.log(state.availableContacts.splice(index, 1));
      console.log(state.availableContacts.splice(index, 1)[0]);

      newLinkedContact.id = action.payload.id;
      newLinkedContact.contact_id = action.payload.contact_id;
      state.linkedContacts = [newLinkedContact, ...state.linkedContacts];

      state.availableContacts = state.availableContacts.filter(
        contact => contact.id !== action.payload.contact_id
      );

      toast.dismiss('linkingContact');
      toast.success('Successfully Linked Contact to Job');
    });

    builder.addCase(getContactsToLink.fulfilled, (state, action) => {
      const filteredContacts = action.payload.filter(
        el => !state.linkedContacts.some(f => f.contact_id === el.id)
      );

      // console.log(filteredContacts);

      state.availableContacts = filteredContacts;
      state.availableContactsLoading = false;
    });
  }
});

export default selectedJobSlice.reducer;
export const { resetSelectedJobItems } = selectedJobSlice.actions;
