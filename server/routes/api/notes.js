const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');
const {
  myRequestHeaders,
  noteInputValidator,
  validateRequest
} = require('../../middlewares/validators');

const { decodeToken } = require('../../middlewares/decodeToken');

// @route     GET api/notes/job/:job_id
// @desc      get all notes for the job with job_id
// @access    public ----> GOTTA MAKE THIS PRIVATE LATER
router.get('/job/:job_id', async (req, res) => {
  const jobId = req.params.job_id;
  const query = format(
    `SELECT *, TO_CHAR(date_created, 'HH12:MIPM MM/DD/YYYY') datecreated FROM note WHERE job_id = %s ORDER BY date_created DESC`,
    jobId
  );
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
router.post('/', noteInputValidator, validateRequest, async (req, res) => {
  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();
  const { text, jobId, selectedboard_user_id } = req.body;

  // Decode the token
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  // if the user doesnt own the board throw error
  if (selectedboard_user_id !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board/job' });
  } else {
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

// @route     PATCH api/notes/:id
// @desc      updates a note
// @access    Private
router.patch('/:id', noteInputValidator, validateRequest, async (req, res) => {
  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();
  const { text, jobId, selectedboard_user_id } = req.body;
  const noteId = req.params.id;

  // Decode the token
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  // if the user doesnt own the board throw error
  if (selectedboard_user_id !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board/job' });
  } else {
    const query = format(
      `UPDATE note SET text = %L WHERE id = %s and job_id = %s RETURNING *`,
      text,
      noteId,
      jobId
    );

    try {
      client.query(query, (err, response) => {
        if (err) {
          console.error(err);
          res.status(500).json({ msg: 'query error' });
        }

        console.log(response.rows[0]);
        res.status(200).json(response.rows[0]);
        client.end();
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
});

// @route     DELETE /api/notes/:id
// @desc      delete a note
// @access    Private
router.delete('/:id', myRequestHeaders, validateRequest, async (req, res) => {
  const client = new Client(config);
  client.connect();

  const { selectedboard_user_id, jobId } = req.body.formData;
  const id = req.params.id; //noteid

  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  // Checks if the loggedIn user owns the board
  if (userId === undefined || selectedboard_user_id !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board and the job' });
  } else {
    // Add a user authentication later authenticate that the boardid belongs to the authenticated logged in user. maybe do a join?? so I can check if the userId is the same as the authenticated userId
    const query = format(
      `DELETE FROM note WHERE id = %s and job_id = %s RETURNING *; INSERT INTO timeline (job_id, update_type, description) VALUES(%s, %L, %L) RETURNING * `,
      id,
      jobId,
      jobId,
      'Note deleted',
      'You deleted a note'
    );

    try {
      client.query(query, (err, response) => {
        if (err) {
          console.error(err);
          res.status(500).json({ msg: 'query error' });
        }

        // For deleted note
        // response.rows[0];
        // Timeline
        // response.rows[1];
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
