const express = require('express');
const router = express.Router();
const { createContact } = require('../controller/contacts.controller');

router.post('/', createContact);

module.exports = router;
