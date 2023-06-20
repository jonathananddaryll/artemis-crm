const express = require('express');
const router = express.Router();
const format = require('pg-format');
const { Client, config } = require('../../config/db');

router.get('/', () => {
  try {
    // const user = get user with sql query
  } catch (err) {
    console.log(err);
  }
  console.log('users get route');
});

module.exports = router;
