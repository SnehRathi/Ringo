const express = require('express');
const router = express.Router();

const { getAllUsers } = require('../controllers/userControllers');

router.get('/getAllUsers', getAllUsers);

module.exports = router;