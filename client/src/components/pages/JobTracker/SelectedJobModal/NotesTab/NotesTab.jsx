import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';

import styles from './NotesTab.module.css';

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
  const [noteText, setNoteText] = useState('');
  const [noteId, setNoteId] = useState(0);

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

    if (!isUpdate) {
      dispatch(createNote(formData));
    } else {
      console.log('ayoooo this is an update');
      formData.noteId = noteId;

      console.log(formData);
      dispatch(updateNote(formData));

      // set noteId back to 0
      setNoteId(0);
    }

    // Clears the noteText then close it
    setNoteText('');
    // hide the form after creating a note
    setNoteFormToggle(false);
  }

  const [isUpdate, setIsUpdate] = useState(false);

  // const onUpdateSubmitHandler = () => {
  //   console.log('thissss is notes update onsubmit');
  // };

  // Fill the textarea with the text from note that's being updated
  const onEditHandler = note => {
    setNoteText(note.text);
    setNoteId(note.id);
    setIsUpdate(true);
    setNoteFormToggle(true);
  };

  // Canceling the edit/create form
  const onCancelFormHandler = note => {
    setNoteText('');
    setIsUpdate(false);
    setNoteFormToggle(false);
  };

  // Delete Note
  async function handleDeleteNote(noteId) {
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
      {!noteFormToggle && (
        <div className={styles.header}>
          <button
            className={styles.newNoteButton}
            onClick={() => setNoteFormToggle(true)}
          >
            Create New Note
          </button>
        </div>
      )}
      {noteFormToggle && (
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
                  <button onClick={() => onEditHandler(note)}>Edit</button>
                  <button onClick={() => handleDeleteNote(note.id)}>
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
