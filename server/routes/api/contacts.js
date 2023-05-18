const express = require('express');
const router = express.Router();

// @ROUTE  /api/contacts/
// @DESC   READ api for individual users contacts
// @ACCESS Private
router.get('/', async (req, res) => {
    try{
        // SELECT * FROM contacts WHERE user_id = ${req.user_id}
        // Frontend search form should have 2 parameters, first and last name
        // pass parameters as single strings into array, pass the array in the request
        // Order by: timestamp
        let queryStarter = 'SELECT * FROM %I WHERE user_id = %L'
        if(req.identifiers.first){
            queryStarter = queryStarter + ` AND first_name = %L`
        }
        if(req.identifiers.last){
            queryStarter = queryStarter + ` AND last_name = %L`
        }
        const query = format(queryStarter + `ORDER BY timestamp DESC;`, 'contacts', req.user_id, req.identifiers.first, req.identifiers.last)
        const contacts = await sql`${query}`
        if(!contacts){
            return res.status(400).json({ msg: 'no contacts found' })
        }
        res.json(contacts)
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
