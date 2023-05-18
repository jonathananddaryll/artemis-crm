const express = require('express');
const router = express.Router();
const sql = require('../../config/db');
// import 'dotenv/config';
const pkg = require('@clerk/clerk-sdk-node');
const clerk = pkg.default;

// @route     GET api/boards/:user_id ---> change it to /:user_id later --> maybe change this to clerk_id and then look for user_id with that clerk_id and then query the board
// @desc      get all boards for the user_id
// @access    public ----> will probably make this private later with userid
router.get('/', async (req, res) => {
  console.log('boards api getall hits');

  // load the current logged in user id later on
  // const userId = req.params.user_id;
  try {
    const boards = await sql`SELECT * FROM BOARD WHERE user_id = 111`;

    if (!boards) {
      return res.status(400).json({ msg: 'No boards found' });
    }

    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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

module.exports = router;
