import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';

import styles from './NotesTab.module.css';
import { deleteNote } from '../../../../../reducers/SelectedJobReducer';

export default function NotesTab({
  createNote,
  selectedBoard_userId,
  jobId,
  notes,
  notesLoading,
  deleteJob
}) {
  const [newNoteFormToggle, setNewNoteFormToggle] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const dispatch = useDispatch();
  const { session } = useSession();

  // Submit handler
  async function onSubmitHandler(e) {
    e.preventDefault();

    const formData = {
      text: newNoteText,
      selectedboard_user_id: selectedBoard_userId,
      jobId: jobId,
      token: await session.getToken()
    };

    // Clears the newNoteText then close it
    setNewNoteText('');

    dispatch(createNote(formData));

    // hide the form after creating a note
    setNewNoteFormToggle(false);
  }

  // Delete Note
  async function handleDeleteJob(noteId) {
    const formData = {
      jobId: jobId,
      selectedboard_user_id: selectedBoard_userId,
      noteId: noteId,
      token: await session.getToken()
    };

    dispatch(deleteNote(formData));

    // APPLY THIS LATER
    // change selectedJob to null and modal off
    // dispatch(changeSelectedJob([false, null]));
  }

  return (
    <div className={styles.notesTabContainer}>
      {!newNoteFormToggle && (
        <div className={styles.header}>
          <button
            className={styles.newNoteButton}
            onClick={() => setNewNoteFormToggle(true)}
          >
            Create New Note
          </button>
        </div>
      )}
      {newNoteFormToggle && (
        <div className={styles.newNoteContainer}>
          <p>Add note</p>
          <form onSubmit={e => onSubmitHandler(e)}>
            <div className={styles.formGroup}>
              <textarea
                className={styles.textarea}
                name='newNoteText'
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
              ></textarea>
              <button onClick={() => setNewNoteFormToggle(false)}>
                Cancel
              </button>
              <input type='submit' value='Save Note' />
            </div>
          </form>
        </div>
      )}
      {/* NOTES BLOCKS TO ADD LATER ON */}
      {notesLoading ? (
        <p>notes loading</p>
      ) : (
        <>
          {notes.map(note => (
            <div className={styles.notesBox}>
              <div className={styles.notesText}>
                <p>{note.text}</p>
              </div>
              <div className={styles.notesFooter}>
                <div className={styles.notesInfo}>
                  <p>{note.date_created}</p>
                </div>
                <div className={styles.notesActionsItems}>
                  <button>Edit</button>
                  <button onClick={() => handleDeleteJob(note.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* <div className={styles.notesBox}>
        <div className={styles.notesText}>
          <p>note box this will be dynamic later</p>
        </div>
        <div className={styles.notesFooter}>
          <div className={styles.notesInfo}>
            <p>9 hours ago</p>
          </div>
          <div className={styles.notesActionsItems}>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </div>
      </div>
      <div className={styles.notesBox}>
        <div className={styles.notesText}>
          <p>
            Vestibulum mattis ullamcorper velit sed ullamcorper morbi. A diam
            sollicitudin tempor id eu nisl nunc mi. Purus faucibus ornare
            suspendisse sed nisi lacus sed viverra tellus. Blandit libero
            volutpat sed cras. Scelerisque fermentum dui faucibus in. Vestibulum
            sed arcu non odio euismod. Sem integer vitae justo eget magna.
            Feugiat nisl pretium fusce id. Lobortis mattis aliquam faucibus
            purus. Felis imperdiet proin fermentum leo vel orci. Mi eget mauris
            pharetra et ultrices neque ornare aenean. Imperdiet proin fermentum
            leo vel orci. Risus nullam eget felis eget nunc. Leo integer
            malesuada nunc vel.
          </p>
        </div>
        <div className={styles.notesFooter}>
          <p>9 hours ago</p>
          <div className={styles.notesActionsItems}>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </div>
      </div> */}
    </div>
  );
}
