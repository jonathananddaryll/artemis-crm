const express = require("express");
const router = express.Router();
const { Client, config } = require("../../config/db");

const format = require("pg-format");

// middleware for request server validation and string input sanitization
const {
  myRequestHeaders,
  validateRequest,
} = require("../../middlewares/validators");

const { decodeToken } = require("../../middlewares/decodeToken");

// @ROUTE  GET api/contacts/
// @DESC   READ api for individual users contacts table
// @ACCESS Private
router.get("/", myRequestHeaders, async (req, res) => {
  // Pass in your headers an auth token, along with the user_id
  // Response object in res.data an array of objects [{}, {}, {}]

  // Use the token authenticated user_id, not the one in the request
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
  // myRequestHeaders, validateRequest,

  // req.body needs names and values of the postgres columns to fill in the new record

  // using the user_id that was authenticated via token
  const decodedToken = decodeToken(req.headers.authorization);
  const user_id = decodedToken.userId;

  const { names, values } = req.body;
  const query = format(
    `INSERT INTO %I(user_id, ${names.join(
      ", "
    )}) VALUES('${user_id}', %L) RETURNING *;`,
    "contact",
    values
  );
  try {
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
router.patch("/", myRequestHeaders, validateRequest, async (req, res) => {
  try {
    // use the token authenticated user_id
    const decodedToken = decodeToken(req.headers.authorization);
    const user_id = decodedToken.userId;

    // req.body needs the id of the contact, the columns to update, and the values to replace with
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
router.delete("/", myRequestHeaders, async (req, res) => {
  // use the token authenticated user_id
  const decodedToken = decodeToken(req.headers.authorization);
  const user_id = decodedToken.userId;

  // Requires just the id of the contact to delete
  const { id } = req.body.deleteRequest;
  const query = `DELETE FROM contact WHERE user_id = '${user_id}' AND id = '${id}' RETURNING *;`;
  try {
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
