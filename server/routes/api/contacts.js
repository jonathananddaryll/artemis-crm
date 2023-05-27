const express = require('express');
const router = express.Router();
<<<<<<< HEAD
=======
const Client = require('../../config/db');
const format = require('pg-format');
>>>>>>> 05be52a (added more client query structure)

// @ROUTE  GET api/contacts/
// @DESC   READ api for individual users contacts
// @ACCESS Private
router.get('/', async (req, res) => {
    try{
        // This query is a straightforward match, which means if searching for 'joh', 'john' will not be 
        // in the results, and neither will jo.
        // Will later add LIKE, as in, first_name LIKE '<first_name>%', or LIKE '%<first_name>' for 
        // misspellings or similar names, etc
        const { first, last, user_id } = req.body
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
                res.status(200).json(response)
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
                res.status(200).json(response)
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
                res.status(200).json(response)
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
        // Should have client side input checks, and server side input validation.
        // Integrate express validator
        // an array of the identifiers
        // needs secure parameterization for when adding the user_id to the query
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
        // request sends JSON.stringified arrays as parts of the body
        const { updateWhat, updateTo, user_id, id } = req.body
        // merge two arrays strings, together throwing in the formatting for SQL updates for updating a type STRING
        // => <row_name> = '<new_row_value>'
        const setUpdate = updateWhat.map((element, index, array) => {
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
        // Are DELETE requests authenticated and protected from injection?
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
