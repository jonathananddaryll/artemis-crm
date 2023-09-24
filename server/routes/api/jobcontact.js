const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');

const {
  myRequestHeaders,
  validateRequest
} = require('../../middlewares/validators');

// returns { sessionId, userId }
const { decodeToken } = require('../../middlewares/decodeToken');

// MANY TO MANY jobs-contacts table

router.post('/', myRequestHeaders, validateRequest, async (req, res) => {
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;
  const { jobId, contactId, contactUserId } = req.body;

  // pass contact.user_id to compare to userId

  // Checks if the loggedIn user owns the board
  if (contactUserId !== userId) {
    return res
      .status(405)
      .json({ msg: 'Error: The user does not own the contact' });
  } else {
    const query = format(
      `INSERT INTO job_contact(job_id, contact_id) VALUES(%s, %s) RETURNING *`,
      jobId,
      contactId
    );
    const client = new Client(config);

    try {
      client.connect();
      client.query(query, (error, response) => {
        if (error) {
          console.error(error);
          res.status(500).json({ msg: 'query error' });
        }
        res.json(response.rows[0]);
        client.end();
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
});

// GET
router.get('/job/:job_id', async (req, res) => {
  // const decodedToken = decodeToken(req.headers.authorization);
  // const userId = decodedToken.userId;

  const jobId = req.params.job_id;

  // Gets all the contacts that is related to the job
  const query = format(
    'SELECT * FROM job_contact jc JOIN contact c on jc.contact_id = c.id WHERE jc.job_id = %s',
    jobId
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
      console.log(response.rows);
      client.end();
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

router.delete('/', myRequestHeaders, validateRequest, async (req, res) => {
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;
  const { jobId, contactId } = req.query;
  const query = format(
    `DELETE FROM job_contact WHERE job_id = ${jobId} AND contact_id = ${contactId} RETURNING *`
  );
  const client = new Client(config);
  try {
    client.query(query, (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).json({ msg: 'query error' });
      }
      res.json(response);
      client.end();
    });
  } catch (error) {
    res.status(500).json({ msg: 'DELETE server error', error });
  }
});

module.exports = router;
