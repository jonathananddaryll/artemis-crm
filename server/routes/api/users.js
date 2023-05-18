const express = require('express');
const router = express.Router();
const sql = require('../../config/db');

router.get('/', () => console.log('users get route'));

module.exports = router;
