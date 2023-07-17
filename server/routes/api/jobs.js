const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');

const {
  myRequestHeaders,
  validateRequest
} = require('../../middleware/validators');

const { decodeToken } = require('../../middleware/decodeToken');

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

// @route     POST api/jobs
// @desc      Add a new job
// @access    Private
// [check('title', 'Title of the board is required').not().isEmpty()],
// router.post('/', myRequestHeaders, validateRequest, async (req, res) => {
router.post('/', async (req, res) => {
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
    rate_of_pay,
    main_contact,
    selectedboard_user_id
  } = req.body;

  // console.log(req.body);

  console.log('create new job api triggered!');
  // console.log('TOKEN IS: ' + req.headers.authorization);

  // Decode the token
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;
  console.log('userId is: ' + userId);
  console.log('selectedboard_user_id is: ' + selectedboard_user_id);

  // if the user doesnt own the board throw error
  if (selectedboard_user_id !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board' });
  } else {
    // const query1 = format(
    //   'INSERT INTO board (title, user_id) VALUES(%L, %L) RETURNING *',
    //   title,
    //   userId
    // );

    const query = format(
      'INSERT INTO job (job_title, company, location, status, board_id) VALUES(%L, %L, %L, %L, %L) RETURNING *',
      job_title,
      company,
      location,
      status,
      board_id
    );

    // INSERT INTO job (job_title, company, location, status, board_id) VALUES ('frontend engineer', 'amazon', 'remote', 'screening', 1);

    // returns errors to use for Alert components later
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    try {
      client.query(query, (err, response) => {
        if (err) {
          console.error(err);
          res.status(500).json({ msg: 'query error' });
        }

        // return the new column status that is added
        // console.log(response.rows[0]);
        res.status(200).json(response.rows[0]);

        client.end();
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
});

// router.get('/:user_id', async (req, res) => {
//   console.log('boards api getall hits');

//   // RESEARCH IF WE NEED TO CLOSE THE CLIENT IF THERES AN ERROR
//   // load the current logged in user id later on
//   const userId = req.params.user_id;
//   const query = format('SELECT * FROM board WHERE user_id = %s', userId);
//   const client = new Client(config);
//   client.connect();

//   try {
//     client.query(query, (err, response) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'query error' });
//       }

//       res.status(200).json(response.rows);
//       client.end();
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// Going to change this to SELECT * FROM JOBS WHERE boardId is the current selectedBoard and userId is the current loggedIn user id
// '/:user_id/board/:board_id/jobs' ---> maybe change to this later
router.get('/board/:board_id', async (req, res) => {
  //check the board_id and check if it belongs to the current loggedin user and then if it does, go fetch it
  console.log('jobs api hits');
  // Maybe have userId with through body instead of params. ---> have a check if the boardId belongs to the userId
  const boardId = req.params.board_id;
  const userId = req.params.user_id;
  const query = format('SELECT * FROM job WHERE board_id = %s', boardId);
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
router.patch('/:job_id/status', async (req, res) => {
  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();

  const { newStatus, boardId } = req.body;
  const jobId = req.params.job_id;

  // Add a user authentication later authenticate that the boardid belongs to the authenticated logged in user. maybe do a join?? so I can check if the userId is the same as the authenticated userId
  const query = format(
    `UPDATE job SET status = %L WHERE id = %s and board_id = %s RETURNING *`,
    newStatus,
    jobId,
    boardId
  );

  console.log(query);

  try {
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: 'query error' });
      }

      // return the updated job
      console.log(response.rows[0]);
      res.status(200).json(response.rows[0]);
      client.end();
    });
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
