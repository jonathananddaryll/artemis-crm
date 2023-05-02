import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadJobsFromSelectedBoard } from '../../../reducers/JobReducer';

import KanbanBoard from './KanbanBoard';

export default function JobTrackerPage() {
  // Delete this later

  const jobs = useSelector(state => state.jobs.jobs);
  const dispatch = useDispatch();
  return (
    // <div>
    //   <p>JobTrackerPage</p>
    //   <button onClick={() => dispatch(loadJobsFromSelectedBoard())}>
    //     Load jobs
    //   </button>
    // </div>
    <div>
      <KanbanBoard />
    </div>
  );
}
