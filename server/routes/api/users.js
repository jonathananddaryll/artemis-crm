const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');

////////////////////@@@@@@@@@@TODO@@@@@@@@@@@@@@@@@@@@@
// 1. add webhooks for session created
// 2. add webhooks for session end

// @route     POST api/users/new
// @desc      Create a new User
// @access    Private
router.post('/new', async (req, res) => {
  const client = new Client(config);
  client.connect();
  const clerk_id = req.body.data.id;
  // console.log(req.body);
  // console.log(req.body.data.user_id);

  console.log('create user after creating clerk account is triggered');

  const query = format(
    'INSERT INTO users (user_id) VALUES(%L) RETURNING *',
    clerk_id
  );

  // const query = format(
  //   'INSERT INTO users (clerk_id) VALUES(%L) ON CONFLICT RETURNING *',
  //   clerk_id
  // );

  try {
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: 'query error' });
      }

      // return the new column status that is added
      // res.status(200).json(response.rows[0]);
      // console.log(response.rows[0]);
      // res.status(200).json(response.rows[0]);

      client.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/auth', async (req, res) => {
  console.log('auth in users route triggered');
  const client = new Client(config);
  client.connect();
  // const clerk_id = req.body.data.id;
  const clerk_id = req.body.data.user_id;
  // console.log(req.body);

  const query = format('SELECT * FROM users WHERE clerk_id = %L', clerk_id);

  try {
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: 'query error' });
      }

      console.log(response.rows[0]);
      res.status(200).json(response.rows[0]);
      client.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
