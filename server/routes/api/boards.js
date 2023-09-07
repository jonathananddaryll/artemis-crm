const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const format = require('pg-format');
const { Client, config } = require('../../config/db');
// const clerk = require('@clerk/clerk-sdk-node');
const {
  myRequestHeaders,
  validateRequest,
  boardInputValidator,
  addColumnInputValidator
} = require('../../middlewares/validators');

const { decodeToken } = require('../../middlewares/decodeToken');

// @route     GET api/boards/:user_id ---> change it to /:user_id later --> maybe change this to clerk_id and then look for user_id with that clerk_id and then query the board
// @desc      get all boards for the user with user_id
// @access    public ----> will probably make this private later with userid
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  const query = format(
    'SELECT b.*, (SELECT count(*)::int from job j WHERE j.board_id = b.id) total_jobs_count FROM board b WHERE user_id = %L ORDER BY date_created DESC',
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
    'SELECT b.*, (SELECT count(*)::int from job j WHERE j.board_id = b.id) total_jobs_count FROM board b WHERE user_id = %L and id = %s',
    userId,
    boardId
  );

  // const query = format(
  //   'SELECT * FROM board WHERE user_id = %L and id = %s',
  //   userId,
  //   boardId
  // );

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
router.post('/', boardInputValidator, validateRequest, async (req, res) => {
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

// @route     POST api/boards/:id/add/column
// @desc      Add a new column
// @access    Private
router.patch(
  '/:board_id/add/column',
  addColumnInputValidator,
  validateRequest,
  async (req, res) => {
    // do the calculating of what colum to add to. have a keeper of first empty column in redux

    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();
    const { columnStatus, totalCols, userId } = req.body;

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
      // DO NOTE let the user add more than 10 columns
      if (totalCols === 10) {
        return res
          .status(405)
          .json({ msg: 'Error. Only 10 column is allowed per board' });
      }

      const query = format(
        `UPDATE BOARD SET %I = %L, %I = %s WHERE id = %s and user_id = %L RETURNING *`,
        columnToAdd,
        columnStatus.toLowerCase(),
        'total_cols',
        newTotalCols,
        boardId,
        decodedUserId
      );

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

// @route     POST api/boards/:id/delete/column
// @desc      delete a column
// @access    Private
router.patch(
  '/:board_id/delete/column',
  myRequestHeaders,
  validateRequest,
  async (req, res) => {
    // do the calculating of what colum to add to. have a keeper of first empty column in redux

    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();
    const {
      totalCols,
      columnToDelete,
      userId,
      col10Status,
      col9Status,
      col8Status
    } = req.body;

    console.log('it got here in the beginning');

    const boardId = req.params.board_id;
    const newTotalCol = totalCols - 1;
    // const newTotalCol = parseInt(totalCols) - 1;

    // Decode the token
    const decodedToken = decodeToken(req.headers.authorization);
    const decodedUserId = decodedToken.userId;

    if (userId !== decodedUserId) {
      return res
        .status(405)
        .json({ msg: 'Error: The user does not own the board' });
    } else {
      // DO NOT let the user add more than 10 columns
      if (columnToDelete < 7 || columnToDelete > 10) {
        return res
          .status(405)
          .json({ msg: 'Error. Can only delete column 7 to 10' });
      }

      // MAKE SURE TO NOT LET USER DELETE IF THERE ARE JOBS WITH BOARDID AND STATUS AS THE ONE GETTING DELETED
      // If deleting Column10

      let query;

      if (columnToDelete === 10) {
        query = format(
          `UPDATE BOARD SET column10 = NULL, total_cols = %s WHERE id = %s and user_id = %L RETURNING *`,
          newTotalCol,
          boardId,
          decodedUserId
        );
      }

      if (columnToDelete === 9) {
        query = format(
          `UPDATE BOARD SET column9 = %L, column10 = NULL, total_cols = %s WHERE id = %s and user_id = %L RETURNING *`,
          col10Status,
          newTotalCol,
          boardId,
          decodedUserId
        );
      }

      if (columnToDelete === 8) {
        query = format(
          `UPDATE BOARD SET column8 = %L, column9 = %L, column10 = NULL, total_cols = %s WHERE id = %s and user_id = %L RETURNING *`,
          col9Status,
          col10Status,
          newTotalCol,
          boardId,
          decodedUserId
        );
      }

      if (columnToDelete === 7) {
        query = format(
          `UPDATE BOARD SET column7 = %L, column8 = %L, column9 = %L, column10 = NULL, total_cols = %s WHERE id = %s and user_id = %L RETURNING *`,
          col8Status,
          col9Status,
          col10Status,
          newTotalCol,
          boardId,
          decodedUserId
        );
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
// @desc      update column Name
// @access    Private
router.patch(
  '/:board_id/update/column',
  addColumnInputValidator,
  validateRequest,
  async (req, res) => {
    // const errors = validationResult(req);
    const client = new Client(config);
    client.connect();
    const { columnStatus, columnToUpdate, userId, oldColumnStatus } = req.body;
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
      // DO NOT let the user update the first  6 default columns
      if (columnToUpdate < 6) {
        return res
          .status(405)
          .json({ msg: 'Error. Only 10 column is allowed per board' });
      }

      const query = format(
        `UPDATE BOARD SET %I = %L WHERE id = %s and user_id = %L RETURNING %I; UPDATE JOB SET status = %L WHERE board_id = %s AND status = %L RETURNING *`,
        columnToUpdate,
        columnStatus.toLowerCase(),
        boardId,
        decodedUserId,
        columnToUpdate,
        columnStatus.toLowerCase(),
        boardId,
        oldColumnStatus
      );

      try {
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: 'query error' });
          }

          // response[0] = updated board
          // response[1] = updated jobs
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

// @route     POST api/boards/:id/update/name
// @desc      update board name
// @access    Private
router.patch(
  '/:board_id/update/name',
  boardInputValidator,
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

// @TODO: implement this
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
