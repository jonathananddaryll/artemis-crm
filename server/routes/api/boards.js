const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
const { check, validationResult } = require('express-validator');
const format = require('pg-format');

// import 'dotenv/config';
const pkg = require('@clerk/clerk-sdk-node');
const clerk = pkg.default;

// @TODO:
// 1. Create Board route
// 2. Update Board route
// 3. Add column to the board route
// 4. renaming column name
// 5. deleting column name --> make sure the column is empty first before letting user delete it

// @route     GET api/boards/:user_id ---> change it to /:user_id later --> maybe change this to clerk_id and then look for user_id with that clerk_id and then query the board
// @desc      get all boards for the user_id
// @access    public ----> will probably make this private later with userid
router.get('/:user_id', async (req, res) => {
  console.log('boards api getall hits');

  // load the current logged in user id later on
  const userId = req.params.user_id;
  try {
    const query = format('SELECT * FROM BOARD WHERE %s', userId);
    // const boards = await sql`SELECT * FROM BOARD WHERE user_id = ${userId}`;
    console.log(query);

    // const boards = await sql`SELECT * FROM BOARD WHERE user_id = 111`;

    const boards = await sql`SELECT * FROM BOARD WHERE user_id = 111`;
    const query1 = ('SELECT * FROM board WHERE user_id = $1', [userId]);
    // const boards = await sql`${query1}`;

    if (!boards) {
      return res.status(400).json({ msg: 'No boards found' });
    }

    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/boards
// @desc      Add a new board
// @access    Private
router.post(
  '/',
  [check('title', 'Title of the board is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    // returns errors to use for Alert components later
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title } = req.body;

    try {
      // have a userid later pull from the user table
      await sql`INSERT INTO BOARD (title, user_id) VALUES(${title}, 111)`;
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route     POST api/boards/:id/add
// @desc      Add a new column
// @access    Private
router.patch('/:board_id/add', async (req, res) => {
  // do the calculating of what colum to add to. have a keeper of first empty column in redux
  const { columnStatus, columnToAdd } = req.body;
  const boardId = req.params.board_id;
  console.log(req.body);

  try {
    // const query = format(`SELECT * FROM JOB WHERE board_id = ${boardId}`);
    const query = format(
      `UPDATE BOARD SET %I = %L WHERE id = %I and user_id = %L`,
      columnToAdd,
      columnStatus,
      boardId,
      111
    );
    console.log(query);
    // await sql`UPDATE BOARD SET ${columnToAdd} = ${columnStatus}, WHERE id = ${boardId} AND user_id = 111,`;
  } catch (err) {
    console.error(err);
  }
});

// {
//     "columnStatus": "applied",
//     "columnToAdd": "column2",
// }

// @route     GET api/boards/:user_id ---> change it to /:user_id later --> maybe change this to clerk_id and then look for user_id with that clerk_id and then query the board
// @desc      get all boards for the user_id
// @access    public ----> will probably make this private later with userid
// router.get('/', clerk.expressRequireAuth({}), async (req, res) => {
//   console.log('boards api getall hits');

//   // load the current logged in user id later on
//   // const userId = req.params.user_id;
//   try {
//     const boards = await sql`SELECT * FROM BOARD WHERE user_id = 111`;

//     if (!boards) {
//       return res.status(400).json({ msg: 'No boards found' });
//     }

//     res.json(boards);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// router.get('/', async (req, res) => {
//   // load the current logged in user id later on
//   const userId = 111;
//   try {
//     const boards = await sql`SELECT * FROM BOARD WHERE user_id = ${userId}`;

//     if (!boards) {
//       return res.status(400).json({ msg: 'No boards found' });
//     }

//     res.json(boards);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

// Add authentication and input validation later
// router.post('/', async (req, res) => {
//   const newBoard =
// })

// // @route     GET api/boards/:user_id ---> change it to /:user_id later --> maybe change this to clerk_id and then look for user_id with that clerk_id and then query the board
// // @desc      get all boards for the user_id
// // @access    public ----> will probably make this private later with userid
// router.get('/:user_id', async (req, res) => {
//   console.log('boards api getall hits');

//   const client = new Client(config);
//   await client.connect();
//   // load the current logged in user id later on
//   const userId = req.params.user_id;
//   try {
//     const query = format('SELECT * FROM BOARD WHERE user_id = %s', userId);
//     // const boards = await sql`SELECT * FROM BOARD WHERE user_id = ${userId}`;

//     client.query(query, (err, response) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'query error' });
//       }

//       res.status(200).json(response);
//       client.end();
//     });

//     // if (!boards) {
//     //   return res.status(400).json({ msg: 'No boards found' });
//     // }

//     // res.json(boards);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
