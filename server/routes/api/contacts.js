const express = require('express');
const router = express.Router();
const sql = require('../../config/db');

router.get('/', async (req, res) => {
    try{
        // when searching for contacts, how should contacts be searchable? 
        // first_name, last_name, company, linked_job_opening
        // Order by: timestamp
        
        // SELECT * FROM contacts WHERE user_id = ${req.user_id} AND 
        const contacts = await sql`SELECT * FROM contacts`
        if(!contacts){
            return res.status(400).json({ msg: 'no contacts found' })
        }
        res.json(contacts)
    }catch (err) {
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
});

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
