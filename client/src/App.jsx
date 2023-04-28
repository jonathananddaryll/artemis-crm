import { useState } from 'react';
import './App.css';

import { useSelector } from 'react-redux';

function App() {
  const jobs = useSelector(state => state.jobs.jobs);
  console.log(jobs);
  return (
    <>
      <p>app</p>
    </>
  );
}

export default App;
