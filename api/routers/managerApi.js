const express = require('express');
const router = express.Router();
const {checkTokenAdmin} = require('../auth/checkToken');
const {getAllManagers,getManagerById,addManager,updateManager,deleteManager,loginManager,logoutManager} = require('../controllers/managerController');

// route for get all manager
router.get('/',checkTokenAdmin,getAllManagers);
router.get('/:id',checkTokenAdmin,getManagerById);
router.post('/',checkTokenAdmin,addManager);
router.patch('/:id',checkTokenAdmin,updateManager);
router.delete('/:id',checkTokenAdmin,deleteManager);

// autontification manager
router.post('/login',loginManager);

// deconnecter manager
router.get('/logout',logoutManager);
module.exports = router;