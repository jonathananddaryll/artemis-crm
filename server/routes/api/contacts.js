const express = require('express');
const router = express.Router();
const Client = require('../../config/db');
const format = require('pg-format');

// @ROUTE  GET api/contacts/
// @DESC   READ api for individual users contacts
// @ACCESS Private
router.get('/', async (req, res) => {
    try{
        // SELECT * FROM contacts WHERE user_id = ${req.user_id}
        // Frontend search form should have 2 parameters, first and last name
        // pass parameters as single strings into identifiers object, pass the object in the request,
        // if not present, do not create the key for that identifier.
        // also, order results by timestamp
        let queryStarter = 'SELECT * FROM %I WHERE user_id = %L'
        let firstAndLast = req.identifiers.first && req.identifiers.last
        if(req.identifiers.first){
            queryStarter = queryStarter + ` AND first_name = %L`
        }
        if(req.identifiers.last){
            queryStarter = queryStarter + ` AND last_name = %L`
        }
        if(firstAndLast){
            const query = format(queryStarter + `ORDER BY timestamp DESC;`, 'contacts', req.user_id)
        }
        const query = format(queryStarter + `ORDER BY timestamp DESC;`, 'contacts', req.user_id)
        const client = new Client()
        client.connect()
        client.query(query, (err, response) => {
            if(err) {
                console.error(err)
            }
            if(!response.length){
                res.status(400).json({msg: 'contact not found'})
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
// @DESC   CREATE contact api for individual users
// @ACCESS Private
router.post('/', async (req, res) => {
    try{
        // validate inputs here - check that values were provided, and omit the rows that weren't from both
        // the contact() parameter as well as the VALUES() parameters. This is a fix until the 'pg' library
        // is used which parameterizes everything for us.
        const {
            rows_names
        } = req.names;
        const {
            rows_values
        } = req.values
        const query = `INSERT INTO contact() VALUES(${rows_values.join(", ")});`
        const results = await sql`${query}`
        res.status(200).json({contacts: results.rows})
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
