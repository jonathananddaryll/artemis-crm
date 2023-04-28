import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './components/pages/Home/HomePage';
import JobTrackerPage from './components/pages/JobTracker/JobTrackerPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/jobtracker' element={<JobTrackerPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
