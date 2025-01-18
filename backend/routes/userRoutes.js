const express = require('express');
const router = express.Router();

const { getAllUsers } = require('../controllers/userControllers');

router.get('/getAllUsers/:userId', getAllUsers);

module.exports = router;