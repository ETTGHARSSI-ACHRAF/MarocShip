const express = require('express');
const router = express.Router();
const {checkTokenManager} = require('../auth/checkToken');
const {getAllVehicule,getVehiculeById,addVehicule,updateVehicule,deleteVehicule} = require('../controllers/vehiculeController');

// route for get all vehicule
router.get('/',checkTokenManager,getAllVehicule);

// route for get vehicule by id
router.get('/:id',checkTokenManager,getVehiculeById);

// add vehicule
router.post('/',checkTokenManager,addVehicule);

// update vehicule
router.patch('/:id',checkTokenManager,updateVehicule);

// delete vehicule by id
router.delete('/:id',checkTokenManager,deleteVehicule);

module.exports = router;