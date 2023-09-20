const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');

const {
  myRequestHeaders,
  validateRequest,
} = require('../../middlewares/validators');

// returns { sessionId, userId }
const { decodeToken } = require('../../middlewares/decodeToken');

// MANY TO MANY jobs-contacts table

router.post('/', myRequestHeaders, validateRequest, async (req, res) => {
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  const { jobId, contactId } = req.query;
  const query = format(
    `INSERT INTO job_contact(job_id, contact_id) VALUES(${jobId}, ${contactId}) RETURNING *`
  );
  const client = new Client(config);

  try {
    client.connect();
    client.query(query, (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).json({ msg: 'query error' });
      }
      res.json(response);
      client.end();
    });
  } catch (error) {
    res.status(500).json({ msg: 'POST server error', error });
  }
});

router.get('/', myRequestHeaders, validateRequest, async (req, res) => {
  const decodedToken = decodeToken(req.headers.authorization);
  const userId = decodedToken.userId;

  const { searchingFor, searchingWith, id } = req.query;
  const query = format(
    `SELECT ${searchingFor} FROM job_contact WHERE ${searchingWith} = ${id};`
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
    res.status(500).json({ msg: 'GET server error', error });
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
