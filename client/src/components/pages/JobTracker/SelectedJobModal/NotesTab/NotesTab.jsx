import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from '@clerk/clerk-react';
import Button from '../../../../layout/Button/Button';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';

import styles from './NotesTab.module.scss';
import ConfirmationPopUp from '../../../../layout/ConfirmationPopUp/ConfirmationPopUp';
import timeSince from '../../../../../helpers/convertDate';

import noNotes from '../../../../../assets/nonotes.svg';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

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
  // const [confirmationToggle, setConfirmationToggle] = useState(false);

  const [selectedNote, setSelectedNote] = useState({
    isActive: false,
    noteId: null
  });

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

    // Resets the selectedNoteId and toggles off the confirmation pop up
    setSelectedNote({ isActive: false, noteId: null });
  }

  const toolbarOption = [
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: 1 }, { header: 2 }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }]
  ];

  const module = {
    toolbar: toolbarOption
  };

  return (
    <div className={styles.notesTabContainer}>
      {!noteFormToggle ? (
        <div className={styles.buttonsContainer}>
          <Button
            type={'button'}
            value={'Create New Note'}
            color={'blue'}
            size={'small'}
            onClick={() => setNoteFormToggle(true)}
          />
        </div>
      ) : (
        <div className={styles.newNoteContainer}>
          <ReactQuill
            modules={module}
            value={noteText}
            theme='snow'
            name='noteText'
            onChange={setNoteText}
          />
          <div className={styles.formButtonsContainer}>
            <form onSubmit={e => onSubmitHandler(e)}>
              <Button
                type={'button'}
                value={'Cancel'}
                color={'white'}
                size={'small'}
                onClick={() => onCancelFormHandler(false)}
              />
              {!isUpdate ? (
                <Button
                  type={'submit'}
                  value={'Save Note'}
                  color={'blue'}
                  size={'small'}
                />
              ) : (
                <Button
                  type={'submit'}
                  value={'Update Note'}
                  color={'blue'}
                  size={'small'}
                />
              )}
            </form>
          </div>
        </div>
      )}
      {/* NOTES BLOCKS TO ADD LATER ON */}
      {notesLoading ? (
        <p>notes loading</p>
      ) : (
        <div className={styles.notesContentContainer}>
          {notes.length === 0 && !noteFormToggle ? (
            <NoDataPlaceholder
              image={noNotes}
              header={'NO NOTES'}
              subHeader={'Here you can write notes'}
            />
          ) : (
            <div className={styles.noteslist}>
              {notes.map(note => (
                <div key={note.id} className={styles.notesBox}>
                  <ReactQuill
                    value={note.text}
                    readOnly={true}
                    theme={'bubble'}
                  />
                  <div className={styles.notesFooter}>
                    <p className={styles.dateText}>
                      Created {timeSince(note.date_created)}
                    </p>

                    <div className={styles.notesActionsButtons}>
                      <Button
                        type={'button'}
                        value={'Edit'}
                        color={'blue'}
                        size={'xsmall'}
                        onClick={() => onEditHandler(note)}
                      />
                      <Button
                        type={'button'}
                        value={'Delete'}
                        color={'red'}
                        size={'xsmall'}
                        // onClick={() => handleDeleteNote(note.id)}
                        onClick={() =>
                          setSelectedNote({
                            isActive: true,
                            noteId: note.id
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {selectedNote.isActive === true && (
        <ConfirmationPopUp
          popUpText={'Are you sure you want to delete this note?'}
          setSelectedNote={setSelectedNote}
          noteId={selectedNote.noteId}
          handleDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
}
