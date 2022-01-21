const express = require('express');
const router = express.Router();
// const checkToken = require('../auth/checkToken')
const {loginAdmin,logoutAdmin}= require('../controllers/adminController');

router.post('/login',loginAdmin);
router.get('/logout',logoutAdmin)

module.exports = router;