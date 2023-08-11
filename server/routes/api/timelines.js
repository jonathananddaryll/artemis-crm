const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const format = require('pg-format');
const { Client, config } = require('../../config/db');
// const clerk = require('@clerk/clerk-sdk-node');
const {
  myRequestHeaders,
  validateRequest
} = require('../../middlewares/validators');

// @route     GET api/timelines/job/:job_id
// @desc      get all timelines for the job with job_id
// @access    public ----> GOTTA MAKE THIS PRIVATE LATER
router.get('/job/:job_id', async (req, res) => {
  const jobId = req.params.job_id;
  const client = new Client(config);
  client.connect();

  const query = format(
    'SELECT * FROM timeline WHERE job_id = %s ORDER BY date_created DESC',
    jobId
  );

  try {
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: 'query error' });
      }

      res.status(200).json(response.rows);
      client.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
