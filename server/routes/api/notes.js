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

const { decodeToken } = require('../../middlewares/decodeToken');

// @route     GET api/notes/job/:job_id
// @desc      get all notes for the job with job_id
// @access    public ----> GOTTA MAKE THIS PRIVATE LATER
router.get('/job/:job_id', async (req, res) => {
  console.log('get all notes with jobId');
  const jobId = req.params.job_id;
  const query = format(
    'SELECT * FROM note WHERE job_id = %s ORDER BY date_created DESC',
    jobId
  );
  console.log(query);
  const client = new Client(config);
  client.connect();

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

// @route     POST api/notes
// @desc      Add a new note
// @access    Private
router.post('/', myRequestHeaders, validateRequest, async (req, res) => {
  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();
  const { text, jobId, selectedboard_user_id } = req.body;

  console.log('create new note api triggered!');

  // Decode the token
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  // if the user doesnt own the board throw error
  if (selectedboard_user_id !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board/job' });
  } else {
    console.log('it got all the way here befire the query');
    const query = format(
      `INSERT INTO note (text, job_id) VALUES(%L, %s) RETURNING *; INSERT INTO timeline (job_id, update_type, description) VALUES(%s, %L, %L) RETURNING *`,
      text,
      jobId,
      jobId,
      'New note created',
      'You added a new note'
    );

    try {
      client.query(query, (err, response) => {
        if (err) {
          console.error(err);
          res.status(500).json({ msg: 'query error' });
        }

        // For Note
        // response[0].rows[0];

        // For Timeline
        // response[1].rows[0];

        console.log(response);

        // return both response for note and timeline
        res.status(200).json(response);
        client.end();
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
});

module.exports = router;
