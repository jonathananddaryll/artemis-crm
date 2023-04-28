import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadJobsFromSelectedBoard } from '../../../reducers/JobReducer';

const JobTrackerPage = () => {
  const jobs = useSelector(state => state.jobs.jobs);
  const dispatch = useDispatch();

  console.log(jobs);
  return (
    <div>
      <p>JobTrackerPage</p>
      <button onClick={() => dispatch(loadJobsFromSelectedBoard())}>
        Load jobs
      </button>
    </div>
  );
};

export default JobTrackerPage;
