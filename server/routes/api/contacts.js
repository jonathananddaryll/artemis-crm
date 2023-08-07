const express = require('express');
const router = express.Router();
<<<<<<< HEAD
=======
const Client = require('../../config/db');
const format = require('pg-format');
>>>>>>> 05be52a (added more client query structure)

// TODO:
// 1) Integrate backend auth (grab user_id from clerk frontend token)
// 2) Input validation and sql injection check
// 3) Error handling and response object formatting

// @ROUTE  GET api/contacts/:user_id
// @DESC   READ api for individual users contacts
// @ACCESS Private
router.get('/', async (req, res) => {
    try{

        // Uses first OR last name to search contacts. Receives a request body with 'first', 'last', 
        // and 'user_id' fields. User_id is required, and must provide at least one of the two other
        // values, or you will get an error with the message 'not found'.

        // TODO:
        // 1) add LIKE into postgresql query to add more flexible search
        // 
        const { first, last, user_id, type, strValue } = req.params
        console.log(req)
        // Query string will always begin with:
        let queryStarter = 'SELECT * FROM %I WHERE user_id = %L'
        // But if both first name and last name were added to the search,
        if(first && last){
            const query = format(queryStarter = queryStarter + ` AND first_name = %L  AND last_name = %L ORDER BY timestamp DESC;`, 'contact', user_id, first, last)
            const client = new Client(config)
            client.connect()
            client.query(query, (err, response) => {
                if(err) {
                    console.error(err)
                    res.status(500).json({msg: 'query error'})
                }
                res.status(200).json(response.rows)
                client.end()
            })
        }else if(first){
            queryStarter = queryStarter + ` AND first_name = %L`
            const query = format(queryStarter + ` ORDER BY timestamp DESC;`, 'contact', user_id, first)
            const client = new Client(config)
            client.connect()
            client.query(query, (err, response) => {
                if(err) {
                    console.error(err)
                    res.status(500).json({msg: 'query error'});
                }
                res.status(200).json(response.rows)
                client.end()
            })
        }else if(last){
            queryStarter = queryStarter + ` AND last_name = %L`;
            const query = format(queryStarter + ` ORDER BY timestamp DESC;`, 'contact', user_id, last)
            const client = new Client(config)
            client.connect()
            client.query(query, (err, response) => {
                if(err) {
                    console.error(err)
                    res.status(500).json({msg: 'query error'})
                }
                res.status(200).json(response.rows)
                client.end()
            })
        }else{
            return res.status(400).json({msg: 'not found'})
        }
    }catch (err) {
        res.status(500).json({msg: 'server error'})
    }
});

// @ROUTE  POST /api/contacts/
// @DESC   CREATE contact api for individual users
// @ACCESS Private
router.post('/', async (req, res) => {
    try{

        // Receives an array of column 'names', and an array of column 'values'
        // to fill the row with. Will return an error if insufficient data to create a new
        // row in the table.

        // TODO: 
        // 1) Check that request has sufficient data for creation of a new row
        const { names, values } = req.body;
        const query = format(`INSERT INTO %I(user_id, ${names.join(", ")}) VALUES(${req.body.user_id}, %L);`, 'contact', values)
        const client = new Client(config)
        client.connect()
        client.query(query, (err, response) => {
            if(err) {
                console.error(err)
                res.status(500).json({msg: 'query error'})
            }
            res.json(response)
            client.end()
        })
    }catch (err) {
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
});

// @ROUTE  PATCH /api/contacts/
// @DESC   UPDATE api for individual users contacts
// @ACCESS Private
router.patch('/', async (req, res) => {
    try{

        // A request sends JSON.stringified arrays as parts of the body along with the user_id --
        // an array of column names 'updateWhat,' and an array of values 'updateTo,' to set
        // as the new values for the contact.

        const { updateWhat, updateTo, user_id, id } = req.body
        // merge two arrays strings, together throwing in the formatting for SQL updates for updating 
        // a type STRING column to a new value.
        const setUpdate = updateWhat.map((element, index, array) => {
        // EXAMPLE:  <row_name> = '<new_row_value>' 
            return `${element} = '${updateTo[index]}'`
        })
        const query = `UPDATE contact SET ${setUpdate.join(", ")} WHERE user_id = ${user_id} AND id = ${id};`;
        const client = new Client(config)
        client.connect()
        client.query(query, (err, response) => {
            if(err) {
                console.error(err)
                res.status(500).json({msg: 'query error'})
            }
            res.status(200).json(response);
            client.end()
        })
    }catch (err) {
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
});

// @ROUTE  DELETE /api/contacts/
// @DESC   DELETE api for individual users contacts
// @ACCESS Private
router.delete('/', async (req, res) => {
    try{
        
        // Receives the typical user_id, the id of the contact. Verifies ownership, 
        // validates inputs for injections, and then deletes the contact.

        // TODO:

        // 1) Verify that the user_id is deleting a contact that it owns before deleting it.

        const { user_id, id } = req.body;
        const query = `DELETE FROM contact WHERE user_id = ${user_id} AND id = ${id};`;
        const client = new Client(config)
        client.connect()
        client.query(query, (err, response) => {
            if(err) {
                console.error(err)
                res.status(500).json({msg: 'query error'})
            }
            res.status(200).json(response);
            client.end()
        })
    }catch (err){
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
})

module.exports = router;
