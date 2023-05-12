const express = require('express');
const router = express.Router();
const sql = require('../../config/db');

// Going to change this to SELECT * FROM JOBS WHERE boardId is the current selectedBoard and userId is the current loggedIn user id
router.get('/', async (req, res) => {
  console.log('jobs api hits');
  try {
    const jobs = await sql`SELECT * FROM JOB`;

    if (!jobs) {
      return res.status(400).json({ msg: 'No jobs found' });
    }

    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add authentication and input validation later
// router.post('/', async (req, res) => {
//   const newJob =
// })

module.exports = router;
