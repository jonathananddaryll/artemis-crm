const express = require('express');
const router = express.Router();
const sql = require('../../config/db');

router.get('/', async (req, res) => {
  try {
    const jobs = await sql`SELECT * FROM JOBS`;

    if (!jobs) {
      return res.status(400).json({ msg: 'No jobs found' });
    }

    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
