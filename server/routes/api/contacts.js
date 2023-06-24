const express = require('express');
const router = express.Router();

router.get('/', () => console.log('contacts get route'));

module.exports = router;
