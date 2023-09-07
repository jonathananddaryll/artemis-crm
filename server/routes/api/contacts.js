const express = require("express");
const router = express.Router();
const { Client, config } = require("../../config/db");
const format = require("pg-format");

// TODO:
// 1) Integrate backend auth (grab user_id from clerk frontend token)
// 2) Input validation and sql injection check
// 3) Error handling and response object formatting

// @ROUTE  GET api/contacts/search
// @DESC   READ api for individual users contacts
// @ACCESS Private
router.get("/search", async (req, res) => {
  try {
    // Uses first OR last name to search contacts. Receives a request body with 'first', 'last',
    // and 'user_id' fields. User_id is required, and must provide at least one of the two other
    // values, or you will get an error with the message 'not found'.

    // TODO:
    // 1) add LIKE into postgresql query to add more flexible search
    //
    const { first, last, user_id, type, strValue, token } = req.query;
    // Query string will always begin with:
    let queryStarter = "SELECT * FROM %I WHERE user_id = %L";
    // But if both first name and last name were added to the search,
    if (first && last) {
      const query = format(
        (queryStarter =
          queryStarter +
          ` AND first_name = %L  AND last_name = %L ORDER BY timestamp DESC;`),
        "contact",
        user_id,
        first,
        last
      );
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
    } else if (first) {
      queryStarter = queryStarter + ` AND first_name = %L`;
      const query = format(
        queryStarter + ` ORDER BY timestamp DESC;`,
        "contact",
        user_id,
        first
      );
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
    } else if (last) {
      queryStarter = queryStarter + ` AND last_name = %L`;
      const query = format(
        queryStarter + ` ORDER BY timestamp DESC;`,
        "contact",
        user_id,
        last
      );
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
    } else {
      if (type === "init") {
        const query = format(queryStarter, "contact", user_id);
        const client = new Client(config);
        client.connect();
        client.query(query, (err, response) => {
          if (err) {
            console.error(err);
            res.status(500).json({ msg: "user has no contacts, or db error" });
          }
          res.status(200).json(response.rows);
          client.end();
        });
      } else {
        return res.status(400).json({ msg: "not found" });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
});

// @ROUTE  GET api/contacts/
// @DESC   READ api for individual users contacts table
// @ACCESS Private
router.get("/", async (req, res) => {
  try {
    const { user_id, token } = req.query;
    let queryStarter = "SELECT * FROM %I WHERE user_id = %L";
    const query = format(queryStarter, "contact", user_id);
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
    res.status(500).json({ msg: "server error" });
  }
});

// @ROUTE  POST /api/contacts/
// @DESC   CREATE contact api for individual users
// @ACCESS Private
router.post("/", async (req, res) => {
  const { names, values } = req.body;
  const query = format(
    `INSERT INTO %I(user_id, ${names.join(", ")}) VALUES(${
      req.body.user_id
    }, %L) RETURNING *;`,
    "contact",
    values
  );
  try {
    // Receives an array of column 'names', and an array of column 'values'
    // to fill the row with. Will return an error if insufficient data to create a new
    // row in the table.

    // TODO:
    // 1) Check that request has sufficient data for creation of a new row
    const client = new Client(config);
    client.connect();
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: "query error" });
      }
      res.json(response);
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
router.patch("/", async (req, res) => {
  try {
    // A request sends JSON.stringified arrays as parts of the body along with the user_id --
    // an array of column names 'updateWhat,' and an array of values 'updateTo,' to set
    // as the new values for the contact.

    const { updateWhat, updateTo, user_id, id } = req.body;
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
        res.status(500).json({ msg: "query error" });
      }
      res.status(200).json(response);
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
router.delete("/", async (req, res) => {
  const { user_id, id, token } = req.body.deleteRequest;
  const query = `DELETE FROM contact WHERE user_id = ${user_id} AND id = ${id} RETURNING *;`;
  try {
    // Receives the typical user_id, the id of the contact. Verifies ownership,
    // validates inputs for injections, and then deletes the contact.

    // TODO:

    // 1) Verify that the user_id is deleting a contact that it owns before deleting it.
    console.log("test")
    const client = new Client(config);
    client.connect();
    client.query(query, (err, response) => {
      if (err) {
        console.error(err);
        res.status(500).json({ msg: "query error" });
      }
      res.status(200).json(response);
      client.end();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "server error" });
  }
});

module.exports = router;
