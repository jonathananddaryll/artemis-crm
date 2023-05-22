const express = require('express');
const router = express.Router();
const { Client, config } = require('../../config/db');
const format = require('pg-format');

// @ROUTE  GET api/contacts/
// @DESC   READ api for individual users contacts
// @ACCESS Private
router.get('/', async (req, res) => {
    try{
        // This query is a straightforward match, which means if searching for 'joh', 'john' will not be in the results, and 
        // neither will jo.
        // Likely to just use LIKE, as in, first_name LIKE '<first_name>%', or LIKE '%<first_name>' for misspellings or similar names, etc
        let queryStarter = 'SELECT * FROM %I WHERE user_id = %L'
        if(req.query.first && req.query.last){
            const query = format(queryStarter = queryStarter + ` AND first_name = %L  AND last_name = %L ORDER BY timestamp DESC;`, 'contact', req.query.user_id, req.query.first, req.query.last)
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
        }else if(req.query.first){
            queryStarter = queryStarter + ` AND first_name = %L`
            const query = format(queryStarter + ` ORDER BY timestamp DESC;`, 'contact', req.query.user_id, req.query.first)
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
        }else if(req.query.last){
            queryStarter = queryStarter + ` AND last_name = %L`;
            const query = format(queryStarter + ` ORDER BY timestamp DESC;`, 'contact', req.query.user_id, req.query.last)
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

// @ROUTE  /api/contacts/
// @DESC   CREATE contact api for individual users
// @ACCESS Private
router.post('/', async (req, res) => {
    try{
        // Should have client side input checks, and server side input validation.
        // Filter inputs for SQL special characters, keywords?
        // an array of the identifiers
        // needs secure parameterization for when adding the user_id to the query
        const names = JSON.parse(req.query.names);
        const values = JSON.parse(req.query.values);
        const query = format(`INSERT INTO %I(user_id, ${names.join(", ")}) VALUES(${req.query.user_id}, %L);`, 'contact', values)
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

// @ROUTE  /api/contacts/
// @DESC   UPDATE api for individual users contacts
// @ACCESS Private
router.patch('/', async (req, res) => {
    try{
        // Needs input validation and parsing for updating multiple rows at a time
        const { updateWhat, updateFrom, updateTo } = req
        const query = `UPDATE contact SET ${updateWhat} = ${updateTo} WHERE ${updateWhat} = ${updateFrom};`;
        const response = sql`${query}`
        res.status(200).json({contacts: results. rows})
    }catch (err) {
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
});

module.exports = router;
