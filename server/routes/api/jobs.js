const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');

const {
  myRequestHeaders,
  validateRequest,
  jobInputValidator
} = require('../../middlewares/validators');

const { decodeToken } = require('../../middlewares/decodeToken');

// @route     POST api/jobs
// @desc      Add a new job
// @access    Private
// [check('title', 'Title of the board is required').not().isEmpty()],
router.post('/', jobInputValidator, validateRequest, async (req, res) => {
  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();

  const {
    company,
    job_title,
    status,
    job_url,
    board_id,
    location,
    selectedboard_user_id
  } = req.body;

  // Decode the token
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  // if the user doesnt own the board throw error
  if (selectedboard_user_id !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board' });
  } else {
    const query = format(
      'INSERT INTO job (job_title, company, location, status, job_url, board_id) VALUES(%L, %L, %L, %L, %L, %s) RETURNING * ',
      job_title,
      company,
      location,
      status,
      job_url,
      board_id
    );

    // This is mainly for the input validation and header validation
    // Returns errors to use for Alert components later
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

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
});

// @route     GET api/jobs/board/:board_id
// @desc      Gets all the job with board_id
// @access    Public -- make it private later
router.get('/board/:board_id', async (req, res) => {
  //check the board_id and check if it belongs to the current loggedin user and then if it does, go fetch it

  // Maybe have userId with through body instead of params. ---> have a check if the boardId belongs to the userId
  const boardId = req.params.board_id;
  const userId = req.params.user_id;
  // const query = format('SELECT * FROM job WHERE board_id = %s', boardId);
  // const query = format(
  //   'SELECT *, false as got_task FROM job LEFT JOIN task ON task.job_id = job.id WHERE board_id = %s',
  //   boardId
  // );
  // const query = format(
  //   `SELECT j.*, CASE WHEN EXISTS (SELECT * FROM task WHERE task.job_id = j.id AND task.is_done = FALSE) THEN true ELSE false END AS got_tasks FROM job j LEFT JOIN (SELECT DISTINCT job_id from task) t ON j.id = t.job_id WHERE board_id = %s ORDER BY date_created DESC`,
  //   boardId
  // );

  // CHECK IF I NEED THE SELECT is_done there.. is is_done good? it's working even without anything there. should i take it out?
  // GOING TO HAVE TO CHANGE THIS QUERY AND ADD IF DATE IS LATER THAN THE CURRENT DATE SHOW IT.
  const query = format(
    `SELECT j.*, TO_CHAR(j.date_created, 'Month dd, yyyy') date_added,
    (SELECT count(*)::int from task t WHERE t.job_id = j.id AND is_done = false) incomplete_task_count,
    (SELECT count(*)::int from note n WHERE n.job_id = j.id) total_note_count,
    (SELECT count(*)::int from task t WHERE t.job_id = j.id AND ((t.category like %L) OR (t.category like %L)) AND t.start_date > NOW() AND t.is_done = false) pending_interview_count FROM job j WHERE board_id = %s ORDER BY j.date_created DESC`,
    '%e Interview%',
    '%Screen%',
    boardId
  );

  // console.log(query);
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

// @route     POST api/jobs/:job_id/status
// @desc      update status
// @access    Private
router.patch(
  '/:job_id/status',
  myRequestHeaders,
  validateRequest,
  async (req, res) => {
    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();

    const {
      newStatus,
      boardId,
      selectedBoard_userId,
      update_type,
      description
    } = req.body;
    const jobId = req.params.job_id;

    const decodedToken = decodeToken(req.headers.authorization);
    const userId = decodedToken.userId;

    // Checks if the loggedIn user owns the board
    if (selectedBoard_userId !== userId) {
      return res
        .status(405)
        .json({ msg: 'Error: The user does not own the board' });
    } else {
      const query = format(
        `UPDATE job SET status = %L WHERE id = %s and board_id = %s RETURNING *; INSERT INTO timeline (job_id, update_type, description) VALUES(%s, %L, %L)`,
        newStatus,
        jobId,
        boardId,
        jobId,
        update_type,
        description
      );

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          // return the updated job
          res.status(200).json(response[0].rows[0]);
          client.end();
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  }
);

// @route     POST api/jobs/:job_id/jobinfo
// @desc      update jobinfo
// @access    Private
router.patch(
  '/:job_id/jobinfo',
  jobInputValidator,
  validateRequest,
  async (req, res) => {
    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();

    const {
      company,
      job_title,
      location,
      rate_of_pay,
      job_url,
      description,
      selectedBoard_userId
    } = req.body;

    const jobId = req.params.job_id;

    const decodedToken = decodeToken(req.headers.authorization);
    const userId = decodedToken.userId;

    // Checks if the loggedIn user owns the board
    if (selectedBoard_userId !== userId) {
      return res
        .status(405)
        .json({ msg: 'Error: The user does not own the board' });
    } else {
      const query = format(
        `UPDATE job SET company = %L, job_title = %L, location = %L, rate_of_pay = %L, job_url = %L, description = %L  WHERE id = %s RETURNING *;`,
        company,
        job_title,
        location,
        rate_of_pay,
        job_url,
        description,
        jobId
      );

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          // return the updated job
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

// @route     DELETE /api/jobs/:id
// @desc      delete a job
// @access    Private
router.delete('/:id', myRequestHeaders, validateRequest, async (req, res) => {
  const client = new Client(config);
  client.connect();

  const { selectedBoard_userId, selectedBoard_id } = req.body;
  const id = req.params.id;
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  // Checks if the loggedIn user owns the board
  if (userId === undefined || selectedBoard_userId !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board and the job' });
  } else {
    const query = format(
      `DELETE FROM job WHERE id = %s and board_id = %s RETURNING *`,
      id,
      selectedBoard_id
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
});

module.exports = router;
