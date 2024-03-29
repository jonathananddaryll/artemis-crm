const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');

////////////////////@@@@@@@@@@TODO@@@@@@@@@@@@@@@@@@@@@
// @route     POST api/users/new
// @desc      Create a new User
// @access    Private
router.post('/new', async (req, res) => {
  const client = new Client(config);
  client.connect();
  const clerk_id = req.body.data.id;

  console.log(req.body);
  const query = format(
    'INSERT INTO users (user_id) VALUES(%L) ON CONFLICT (user_id) DO NOTHING RETURNING *',
    clerk_id
  );

  try {
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: 'query error' });
      }

      client.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
