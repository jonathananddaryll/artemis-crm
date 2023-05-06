const express = require('express');
const router = express.Router();
const sql = require('../../config/db');

router.get('/', async (req, res) => {
    try{
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
        const {
            user_id,
            first_name,
            last_name,
            company,
            city,
            current_job_title,
            phone,
            email,
            linkedin,
            twitter,
            instagram,
            other_social,
            personal_site,
            fk_linked_job 
        } = req;
        const valuesArray = [
            user_id,
            first_name, 
            last_name, 
            company, 
            city, 
            current_job_title, 
            phone, 
            email, 
            linkedin, 
            twitter, 
            instagram, 
            other_social, 
            personal_site,
            fk_linked_job
        ]
        const query = `INSERT INTO contact(user_id, first_name, last_name, company, city, current_job_title, phone, email, linkedin, twitter, instagram, other_social, personal_site, fk_linked_job) VALUES(${valuesArray.join(", ")});`
        const results = await sql`${query}`
        res.status(200).json({contacts: results.rows})
    }catch (err) {
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
})

router.patch('/', async (req, res) => {
    try{
        
    }catch (err) {
        console.error(err)
        res.status(500).json({msg: 'server error'})
    }
})

module.exports = router;
