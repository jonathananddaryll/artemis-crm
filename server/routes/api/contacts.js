const express = require('express');
const router = express.Router();
const sql = require('../../config/db');

router.get('/', () => console.log('contacts get route'));

module.exports = router;
