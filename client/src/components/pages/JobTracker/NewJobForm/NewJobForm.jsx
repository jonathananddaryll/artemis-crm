import React from 'react';
import styles from './NewJobForm.module.css';

import { useDispatch } from 'react-redux';
import {
  handleToggleForm,
  selectedBoardStatusCols
} from '../../../../reducers/BoardReducer';

export default function NewJobForm() {
  const dispatch = useDispatch();
  return (
    <div className={styles.wrapper}>
      <div>
        <button onClick={() => dispatch(handleToggleForm([false, null]))}>
          CANCEL NEW JOB FORM
        </button>
      </div>
    </div>
  );
}
