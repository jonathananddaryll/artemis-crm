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

// @route     GET api/tasks/job/:job_id
// @desc      get all tasks for the job with job_id
// @access    public ----> GOTTA MAKE THIS PRIVATE LATER
router.get('/job/:job_id', async (req, res) => {
  const jobId = req.params.job_id;
  const query = format(
    `SELECT *, TO_CHAR(date_created, 'HH12:MIPM MM/DD/YYYY') datecreated FROM task WHERE job_id = %s ORDER BY date_created DESC`,
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

// @route     POST api/tasks
// @desc      Add a new task
// @access    Private
router.post('/', myRequestHeaders, validateRequest, async (req, res) => {
  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();
  const { name, jobId, selectedboard_user_id } = req.body;

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
      `INSERT INTO task (task_name, job_id) VALUES(%L, %s) RETURNING *; INSERT INTO timeline (job_id, update_type, description) VALUES(%s, %L, %L) RETURNING *`,
      name,
      jobId,
      jobId,
      'New task created',
      name
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

// @route     PATCH api/tasks/:id/status
// @desc      updates a task
// @access    Private
router.patch(
  '/:id/status',
  myRequestHeaders,
  validateRequest,
  async (req, res) => {
    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();
    const { status, jobId, selectedboard_user_id } = req.body;
    const taskId = req.params.id;

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
        `UPDATE task SET is_done = %L WHERE id = %s and job_id = %s RETURNING *`,
        status,
        taskId,
        jobId
      );

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          res.status(200).json(response.rows[0]);
          client.end();
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  }
);

module.exports = router;
