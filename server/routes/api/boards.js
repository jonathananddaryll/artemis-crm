const express = require('express');
const router = express.Router();
const sql = require('../../config/db');

router.get('/', async (req, res) => {
  // load the current logged in user id later on
  const userId = 111;
  try {
    const boards = await sql`SELECT * FROM BOARD WHERE user_id = ${userId}`;

    if (!boards) {
      return res.status(400).json({ msg: 'No boards found' });
    }

    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id/columns', async (req, res) => {
  // load the current logged in user id later on
  const boardId = req.params.id;
  try {
    const boardColumns =
      await sql`SELECT * FROM BOARD_COLUMN WHERE board_id = ${boardId}`;

    if (!boardColumns) {
      return res.status(400).json({ msg: 'No board columns found' });
    }

    res.json(boardColumns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add authentication and input validation later
// router.post('/', async (req, res) => {
//   const newBoard =
// })

module.exports = router;
