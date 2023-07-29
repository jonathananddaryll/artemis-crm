const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');

const {
  myRequestHeaders,
  validateRequest
} = require('../../middlewares/validators');

const { decodeToken } = require('../../middlewares/decodeToken');

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
router.post('/', myRequestHeaders, validateRequest, async (req, res) => {
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
      // Add a user authentication later authenticate that the boardid belongs to the authenticated logged in user. maybe do a join?? so I can check if the userId is the same as the authenticated userId
      // const query = format(
      //   `UPDATE job SET status = %L WHERE id = %s and board_id = %s RETURNING *`,
      //   newStatus,
      //   jobId,
      //   boardId
      // );

      const query = format(
        `UPDATE job SET status = %L WHERE id = %s and board_id = %s RETURNING *; INSERT INTO timeline (job_id, update_type, description) VALUES(%s, %L, %L)`,
        newStatus,
        jobId,
        boardId,
        jobId,
        update_type,
        description
      );

      console.log(query);

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          // return the updated job
          // console.log(response.rows[0]);
          console.log(response[0].rows[0]);
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

// @route     DELETE /api/jobs/:id
// @desc      delete a job
// @access    Private
router.delete('/:id', myRequestHeaders, validateRequest, async (req, res) => {
  const client = new Client(config);
  client.connect();

  const { selectedBoard_userId, selectedBoard_id } = req.body.formData;
  const id = req.params.id;
  console.log('req body data');
  console.log(req.body.formData);

  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;
  console.log('user id is:' + userId);
  console.log('selectedBoard_userId: ' + selectedBoard_userId);
  console.log('DELETE JOB triggered in the job API');

  // Checks if the loggedIn user owns the board
  if (userId === undefined || selectedBoard_userId !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the board and the job' });
  } else {
    // Add a user authentication later authenticate that the boardid belongs to the authenticated logged in user. maybe do a join?? so I can check if the userId is the same as the authenticated userId
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

        // return the updated job
        // console.log(response.rows[0]);
        // res.status(200).json(response.rows[0]);

        // Find a way to send a response and console log that the query got 0 result
        // if (response === undefined) {
        //   console.log('didnt find the row to delete');
        // }

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
// Add authentication and input validation later
// router.post('/', async (req, res) => {
//   const newJob =
// })

module.exports = router;
