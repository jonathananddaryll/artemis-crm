import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';

import styles from './NotesTab.module.css';
import ConfirmationPopUp from '../../../../layout/ConfirmationPopup/ConfirmationPopup';

export default function NotesTab({
  createNote,
  selectedBoard_userId,
  jobId,
  notes,
  notesLoading,
  deleteNote,
  updateNote
}) {
  const [noteFormToggle, setNoteFormToggle] = useState(false);
  const [confirmationToggle, setConfirmationToggle] = useState(false);

  const [noteText, setNoteText] = useState('');
  // This is just to keeptrack of the selected noteId for Updating purposes
  const [noteId, setNoteId] = useState(0);

  // Just a toggler between update or create functionality for the Note Form
  const [isUpdate, setIsUpdate] = useState(false);

  const dispatch = useDispatch();
  const { session } = useSession();

  // Submit handler
  async function onSubmitHandler(e) {
    e.preventDefault();

    const formData = {
      text: noteText,
      selectedboard_user_id: selectedBoard_userId,
      jobId: jobId,
      token: await session.getToken()
    };

    // Dispatches create or update depends on the isUpdate toggler
    if (!isUpdate) {
      dispatch(createNote(formData));
    } else {
      // Adds noteId to the formData for updateNote
      formData.noteId = noteId;

      dispatch(updateNote(formData));

      // Sets noteId back to 0
      setNoteId(0);
    }

    // Clears the noteText then close it
    setNoteText('');

    // hide the form after creating a note
    setNoteFormToggle(false);
  }

  // Fills the textarea with the text from note that's being updated
  const onEditHandler = note => {
    setNoteText(note.text);
    setNoteId(note.id);
    setIsUpdate(true);
    setNoteFormToggle(true);
  };

  // Cancels the edit/create form
  const onCancelFormHandler = () => {
    setNoteText('');
    setIsUpdate(false);
    setNoteFormToggle(false);
  };

  // Deletes Note
  async function handleDeleteNote(noteId) {
    const formData = {
      jobId: jobId,
      selectedboard_user_id: selectedBoard_userId,
      noteId: noteId,
      token: await session.getToken()
    };

    dispatch(deleteNote(formData));

    // APPLY THIS LATER FOR CONFIRMATION DELETE MODAL POPUP
    // change selectedJob to null and modal off
    // dispatch(changeSelectedJob([false, null]));
  }

  return (
    <div className={styles.notesTabContainer}>
      {!noteFormToggle ? (
        <div className={styles.buttonsContainer}>
          <button
            className={styles.newNoteButton}
            onClick={() => setNoteFormToggle(true)}
          >
            Create New Note
          </button>
        </div>
      ) : (
        <div className={styles.newNoteContainer}>
          <p>Add note</p>
          <form onSubmit={e => onSubmitHandler(e)}>
            <div className={styles.formGroup}>
              <textarea
                className={styles.textarea}
                name='noteText'
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add your notes about the company's history, culture, and any relevant information here..."
              ></textarea>
              <button onClick={() => onCancelFormHandler()}>Cancel</button>

              {!isUpdate ? (
                <input type='submit' value='Save Note' />
              ) : (
                <input type='submit' value='Update Note' />
              )}
            </div>
          </form>
        </div>
      )}
      {/* NOTES BLOCKS TO ADD LATER ON */}
      {notesLoading ? (
        <p>notes loading</p>
      ) : (
        <div className={styles.notesContentContainer}>
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
                  <button onClick={() => onEditHandler(note)}>Edit</button>
                  <button onClick={() => handleDeleteNote(note.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
