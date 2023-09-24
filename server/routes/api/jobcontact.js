const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');
const {
  myRequestHeaders,
  validateRequest
} = require('../../middlewares/validators');
const { decodeToken } = require('../../middlewares/decodeToken');

// @route     POST api/jobcontact
// @desc      Creates a new job_contact to create a many-to-many relationship between jobs and contacts
// @access    Private
router.post('/', myRequestHeaders, validateRequest, async (req, res) => {
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;
  const { jobId, contactId, contactUserId } = req.body;

  // pass contact.user_id to compare to userId

  // Checks if the loggedIn user owns the board
  if (userId === undefined || contactUserId !== userId) {
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

// @route     GET api/jobcontact/jobs/:job_id
// @desc      Gets all the contact related to job with job id
// @access    Private -- it will be
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

// @route     DELETE /:id/job/:job_id/contact/:contact_id
// @desc      Deletes a job contact link
// @access    Private
router.delete(
  '/:id/job/:job_id/contact/:contact_id',
  myRequestHeaders,
  validateRequest,
  async (req, res) => {
    const client = new Client(config);
    client.connect();

    const { contactUserId } = req.body;
    const id = req.params.id;
    const contactId = req.params.contact_id;
    const jobId = req.params.job_id;
    const decodedToken = decodeToken(req.headers.authorization);
    const userId = decodedToken.userId;

    // Checks if the loggedIn user owns the board
    if (userId === undefined || contactUserId !== userId) {
      return res
        .status(405)
        .json({ msg: 'Error: The user does not own the contact' });
    } else {
      const query = format(
        'DELETE FROM job_contact WHERE id = %s and contact_id = %s and job_id = %s RETURNING *',
        id,
        contactId,
        jobId
      );

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
    }
  }
);

module.exports = router;
