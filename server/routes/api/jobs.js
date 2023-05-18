const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const format = require('pg-format');

// // Going to change this to SELECT * FROM JOBS WHERE boardId is the current selectedBoard and userId is the current loggedIn user id
// router.get('/', async (req, res) => {
//   console.log('jobs api hits');
//   try {
//     const jobs = await sql`SELECT * FROM JOB`;
//     // const query = format('SELECT * FROM JOB');
//     // const jobs = await sql`${query}`;

//     if (!jobs) {
//       return res.status(400).json({ msg: 'No jobs found' });
//     }

//     res.json(jobs);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// Going to change this to SELECT * FROM JOBS WHERE boardId is the current selectedBoard and userId is the current loggedIn user id
router.get('/board/:board_id', async (req, res) => {
  //check the board_id and check if it belongs to the current loggedin user and then if it does, go fetch it
  console.log('jobs api hits');
  const boardId = req.params.board_id;
  try {
    const jobs = await sql`SELECT * FROM JOB WHERE board_id = ${boardId}`;
    // const query = format('SELECT * FROM JOB');
    // const jobs = await sql`${query}`;

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
