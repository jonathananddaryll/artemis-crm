const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');
const {
  myRequestHeaders,
  validateRequest,
  taskInputValidator
} = require('../../middlewares/validators');

const { decodeToken } = require('../../middlewares/decodeToken');

// @route     GET api/tasks/job/:job_id
// @desc      get all tasks for the job with job_id
// @access    public ----> GOTTA MAKE THIS PRIVATE LATER
router.get('/job/:job_id', async (req, res) => {
  const jobId = req.params.job_id;
  // const query = format(
  //   `SELECT *, TO_CHAR(date_created, 'HH12:MIPM MM/DD/YYYY') datecreated FROM task WHERE job_id = %s ORDER BY date_created DESC`,
  //   jobId
  // );
  // const query = format(
  //   `SELECT * FROM task WHERE job_id = %s AND (category = 'Phone Screen' OR category = 'Technical Screen' OR category = 'Phone Interview' OR category ='On Site Interview') ORDER BY date_created DESC`,
  //   jobId,
  //   '%Interview%'
  // );
  const query = format(
    `SELECT * FROM task WHERE job_id = %s ORDER BY date_created DESC`,
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
router.post('/', taskInputValidator, validateRequest, async (req, res) => {
  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();
  const {
    title,
    category,
    start_date,
    note,
    is_done,
    date_completed,
    jobId,
    selectedboard_user_id
  } = req.body;

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
      `INSERT INTO task (title, category, note, is_done, date_completed, start_date, job_id) VALUES(%L, %L, %L, %L, %L, %L, %s) RETURNING *; INSERT INTO timeline (job_id, update_type, description) VALUES(%s, %L, %L) RETURNING *`,
      title,
      category,
      note,
      is_done,
      date_completed,
      start_date,
      jobId,
      jobId,
      'New task created',
      title
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

// @route     PATCH api/tasks/:id/info
// @desc      Updates a task
// @access    Private
router.patch(
  '/:id/info',
  taskInputValidator,
  validateRequest,
  async (req, res) => {
    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();
    const {
      title,
      category,
      start_date,
      note,
      is_done,
      date_completed,
      jobId,
      selectedboard_user_id
    } = req.body;

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
        `UPDATE task SET title = %L, category = %L, note = %L, is_done = %L, date_completed = %L, start_date = %L WHERE id = %s and job_id = %s RETURNING *; INSERT INTO timeline (job_id, update_type, description) VALUES(%s, %L, %L) RETURNING *`,
        title,
        category,
        note,
        is_done,
        date_completed,
        start_date,
        taskId,
        jobId,
        jobId,
        'Updated a task',
        title
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
  }
);

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
    const { status, jobId, selectedboard_user_id, date_completed } = req.body;
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
        `UPDATE task SET is_done = %L, date_completed = %L WHERE id = %s and job_id = %s RETURNING *`,
        status,
        date_completed,
        taskId,
        jobId
      );

      console.log(query);

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

// @route     DELETE /api/tasks/:id
// @desc      delete a task
// @access    Private
router.delete('/:id', myRequestHeaders, validateRequest, async (req, res) => {
  const client = new Client(config);
  client.connect();

  const { selectedboard_user_id, jobId, taskTitle } = req.body.formData;
  const id = req.params.id; // taskId

  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  // Checks if the loggedIn user owns the board
  if (userId === undefined || selectedboard_user_id !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board and the job' });
  } else {
    // Add a user authentication later authenticate that the boardid belongs to the authenticated logged in user. maybe do a join?? so I can check if the userId is the same as the authenticated userId
    // @TODO: CHANGE 'You deleted a task' to 'You deleted TASK CATEGORY'
    const query = format(
      `DELETE FROM task WHERE id = %s and job_id = %s RETURNING *; INSERT INTO timeline (job_id, update_type, description) VALUES(%s, %L, %L) RETURNING * `,
      id,
      jobId,
      jobId,
      'Task deleted',
      taskTitle
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
