const express = require("express");
const router = express.Router();
const { Client, config } = require("../../config/db");

const format = require("pg-format");
const { check, validationResult } = require('express-validator');

const {
  myRequestHeaders,
  validateRequest
} = require('../../middlewares/validators');

const { decodeToken } = require('../../middlewares/decodeToken');

// TODO:
// 1) Integrate backend auth (grab user_id from clerk frontend token)
// 2) Input validation and sql injection check
// 3) Error handling and response object formatting

// @ROUTE  GET api/contacts/
// @DESC   READ api for individual users contacts table
// @ACCESS Private
router.get("/", myRequestHeaders, async (req, res) => {
  const decodedToken = decodeToken(req.headers.authorization);
  const user_id = decodedToken.userId;

  let queryStarter = "SELECT * FROM %I WHERE user_id = %L";
  const query = format(queryStarter, "contact", user_id);

  const client = new Client(config);
  try {
    client.connect();
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: "query error" });
      }
      res.status(200).json(response.rows);
      client.end();
    });
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
});

// @ROUTE  POST /api/contacts/
// @DESC   CREATE contact api for individual users
// @ACCESS Private
router.post("/", async (req, res) => {
  console.log(req.headers.authorization, req)
  // myRequestHeaders, validateRequest, 
  const decodedToken = decodeToken(req.headers.authorization);
  const user_id = decodedToken.userId;

  const { names, values } = req.body;
  const query = format(
    `INSERT INTO %I(user_id, ${names.join(", ")}) VALUES('${user_id}', %L) RETURNING *;`,
    "contact",
    values
  );
  try {
    // Receives an array of column 'names', and an array of column 'values'
    // to fill the row with. Will return an error if insufficient data to create a new
    // row in the table.

    const client = new Client(config);
    client.connect();
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: "query error" });
      }
      res.json(response.rows);
      client.end();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});

// @ROUTE  PATCH /api/contacts/
// @DESC   UPDATE api for individual users contacts
// @ACCESS Private
router.patch("/", myRequestHeaders, validateRequest,  async (req, res) => {
  try {
    const decodedToken = decodeToken(req.headers.authorization);
    const user_id = decodedToken.userId;

    const { updateWhat, updateTo, id } = req.body;
    // merge two arrays strings, together throwing in the formatting for SQL updates for updating
    // a type STRING column to a new value.
    const setUpdate = updateWhat.map((element, index, array) => {
      // EXAMPLE:  <row_name> = '<new_row_value>'
      return `${element} = '${updateTo[index]}'`;
    });
    const query = `UPDATE contact SET ${setUpdate.join(
      ", "
    )} WHERE user_id = '${user_id}' AND id = '${id}' RETURNING *;`;
    const client = new Client(config);
    client.connect();
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: err });
      }
      res.status(200).json(response.rows);
      client.end();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});

// @ROUTE  DELETE /api/contacts/
// @DESC   DELETE api for individual users contacts
// @ACCESS Private
router.delete("/", myRequestHeaders,  async (req, res) => {
  const decodedToken = decodeToken(req.headers.authorization);
  const user_id = decodedToken.userId;
  const { id } = req.body.deleteRequest;
  const query = `DELETE FROM contact WHERE user_id = '${user_id}' AND id = '${id}' RETURNING *;`;
  try {
    // Receives the typical user_id, the id of the contact. Verifies ownership,
    // validates inputs for injections, and then deletes the contact.

    // TODO:

    // 1) Verify that the user_id is deleting a contact that it owns before deleting it.
    const client = new Client(config);
    client.connect();
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: "query error" });
      }
      res.status(200).json(response.rows);
      client.end();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
