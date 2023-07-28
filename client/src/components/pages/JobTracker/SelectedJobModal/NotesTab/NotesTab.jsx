import React, { useState } from 'react';
import styles from './NotesTab.module.css';

export default function NotesTab() {
  const [newNoteFormToggle, setNewNoteFormToggle] = useState(false);
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
          <form>
            <div className={styles.formGroup}>
              <textarea className={styles.textarea}></textarea>
              <button onClick={() => setNewNoteFormToggle(false)}>
                Cancel
              </button>
              <button>Save</button>
            </div>
          </form>
        </div>
      )}
      {/* NOTES BLOCKS TO ADD LATER ON */}
      <div className={styles.notesBox}>
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
      </div>
    </div>
  );
}
