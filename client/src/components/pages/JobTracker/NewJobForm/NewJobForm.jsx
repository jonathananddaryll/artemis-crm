import React from 'react';
import styles from './NewJobForm.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { handleToggleForm } from '../../../../reducers/BoardReducer';

export default function NewJobForm() {
  const { selectedBoardStatusCols } = useSelector(state => ({
    ...state.board
  }));
  const dispatch = useDispatch();
  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
        <button onClick={() => dispatch(handleToggleForm([false, null]))}>
          CANCEL NEW JOB FORM
        </button>
      </div>
    </div>
  );
}
