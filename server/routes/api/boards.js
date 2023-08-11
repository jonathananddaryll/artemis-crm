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

// @route     GET api/boards/:user_id ---> change it to /:user_id later --> maybe change this to clerk_id and then look for user_id with that clerk_id and then query the board
// @desc      get all boards for the user with user_id
// @access    public ----> will probably make this private later with userid
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  const query = format(
    'SELECT * FROM board WHERE user_id = %L ORDER BY date_created ASC',
    userId
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

// @route     GET api/boards/:user_id/board/:board_id
// @desc      get boards for the user_id with board_id
// @access    public ----> will probably make this private later with userid
router.get('/:user_id/board/:board_id', async (req, res) => {
  const userId = req.params.user_id;
  const boardId = req.params.board_id;
  const query = format(
    'SELECT * FROM board WHERE user_id = %L and id = %s',
    userId,
    boardId
  );

  const client = new Client(config);
  client.connect();

  try {
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: 'query error' });
      }

      // Returns the board obj
      res.status(200).json(response.rows[0]);
      client.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/boards
// @desc      Add a new board
// @access    Private
// [check('title', 'Title of the board is required').not().isEmpty()],
router.post('/', myRequestHeaders, validateRequest, async (req, res) => {
  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();
  const { title } = req.body;

  // Decode the token
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  const query = format(
    'INSERT INTO board (title, user_id) VALUES(%L, %L) RETURNING *',
    title,
    userId
  );

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

      res.status(200).json(response.rows[0]);
      client.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/boards/:id/add
// @desc      Add a new column
// @access    Private
router.patch(
  '/:board_id/add',
  myRequestHeaders,
  validateRequest,
  async (req, res) => {
    // do the calculating of what colum to add to. have a keeper of first empty column in redux

    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();
    const { columnStatus, totalCols, userId } = req.body;
    // addcolumn or updatecolumn --> make sure to pass 'action' along with everytrhing in body
    const newTotalCols = totalCols + 1;
    const boardId = req.params.board_id;
    const columnToAdd = 'column'.concat(newTotalCols);

    // Decode the token
    const decodedToken = decodeToken(req.headers.authorization);
    const decodedUserId = decodedToken.userId;

    if (userId !== decodedUserId) {
      return res
        .status(405)
        .json({ msg: 'Error: The user does not own the board' });
    } else {
      const query = format(
        `UPDATE BOARD SET %I = %L, %I = %s WHERE id = %s and user_id = %L RETURNING *`,
        columnToAdd,
        columnStatus,
        'total_cols',
        newTotalCols,
        boardId,
        decodedUserId
      );

      if (totalCols === 10) {
        return res
          .status(405)
          .json({ msg: 'Error. Only 10 column is allowed per board' });
      }

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          // return the new column status that is added
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

// @route     POST api/boards/:id/update/column
// @desc      update column
// @access    Private
router.patch(
  '/:board_id/update/column',
  myRequestHeaders,
  validateRequest,
  async (req, res) => {
    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();
    const { columnStatus, columnToUpdate, userId } = req.body;
    // addcolumn or updatecolumn --> make sure to pass 'action' along with everytrhing in body
    const boardId = req.params.board_id;

    // Decode the token
    const decodedToken = decodeToken(req.headers.authorization);
    const decodedUserId = decodedToken.userId;

    // if user do not own the board
    if (userId !== decodedUserId) {
      return res
        .status(405)
        .json({ msg: 'Error: The user does not own the board' });
    } else {
      const query = format(
        `UPDATE BOARD SET %I = %L WHERE id = %s and user_id = %L RETURNING *`,
        columnToUpdate,
        columnStatus,
        boardId,
        'user_2SWlvSMY0DKPuKthQBIRgFoDvdi'
      );

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          // return the updated column
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

// @route     POST api/boards/:id/update/name
// @desc      update board name
// @access    Private
router.patch(
  '/:board_id/update/name',
  myRequestHeaders,
  validateRequest,
  async (req, res) => {
    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();
    const { title, userId } = req.body;
    // addcolumn or updatecolumn --> make sure to pass 'action' along with everytrhing in body
    const boardId = req.params.board_id;

    // Decode the token
    const decodedToken = decodeToken(req.headers.authorization);
    const decodedUserId = decodedToken.userId;

    // if user do not own the board
    if (userId !== decodedUserId) {
      return res
        .status(405)
        .json({ msg: 'Error: The user does not own the board' });
    } else {
      const query = format(
        `UPDATE BOARD SET title = %L WHERE id = %s and user_id = %L RETURNING *`,
        title,
        boardId,
        userId
      );

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          // return the updated board
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

// -------------------------------------- ADD HEADER AUTHENTICATION LATER ON
// @route     POST api/boards/:board_id/remove
// @desc      remove a column status
// @access    Private
router.patch('/:board_id/remove', async (req, res) => {
  // do the calculating of what colum to add to. have a keeper of first empty column in redux

  // const errors = validationResult(req);
  const client = new Client(config);
  client.connect();
  const { columnToRemove, totalCols } = req.body;
  const boardId = req.params.board_id;
  const columnToAdd = 'column'.concat(totalCols + 1);

  const query = format(
    `UPDATE BOARD SET %I = %L WHERE id = %s and user_id = %s`,
    columnToAdd,
    columnStatus,
    boardId,
    111
  );

  if (totalCols === 0) {
    return res.status(405).json({ msg: 'Error. No column to remove' });
  }

  try {
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: 'query error' });
      }

      // return the new column status that is added
      res.status(200).json(response);
      client.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/boards/:id
// @desc      delete a board
// @access    Private
router.delete(
  '/:board_id',
  myRequestHeaders,
  validateRequest,
  async (req, res) => {
    const client = new Client(config);
    client.connect();

    const { selectedBoard_userId } = req.body;
    const id = req.params.board_id;
    const decodedToken = decodeToken(req.headers.authorization);
    const userId = decodedToken.userId;

    // Checks if the loggedIn user owns the board
    if (userId === undefined || selectedBoard_userId !== userId) {
      console.log('invalid user');
      return res
        .status(405)
        .json({ msg: 'Error: The user does not own the board' });
    } else {
      const query = format(
        `DELETE FROM board WHERE id = %s and NOT EXISTS (SELECT * FROM job WHERE board.id = job.board_id) RETURNING *`,
        id
      );

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          // ------------------------------- ADD A RETURN IF THE QUERY DOESNT RETURN ANYTHIHNG
          res.status(200).json(response);
          client.end();
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }

    //check authorization header

    // check if there are any jobs in the board with the board_id

    // throws an error if there is,

    // DELETE the board if it meets all condition
  }
);
module.exports = router;
