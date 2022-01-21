const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const {checkTokenManager,checkTokenChauffeur} = require('../auth/checkToken');
const {getAllChauffeur,getChauffeurById,addChauffeur,updateChauffeur,deleteChauffeur,loginChauffeur,logoutChauffeur,prandreCommande} = require('../controllers/chauffeurController');

// route for get all chauffeur
router.get('/',checkTokenManager,getAllChauffeur);

// route for get chauffeur by id
router.get('/:id',checkTokenManager,getChauffeurById);

// add chauffeur
router.post('/',checkTokenManager,addChauffeur);

// update chauffeur
router.patch('/:id',checkTokenManager,updateChauffeur);

// delete chauffeur by id
router.delete('/:id',checkTokenManager,deleteChauffeur);

// autontification chauffeur
router.post('/login',loginChauffeur);

// deconnecter chhauffeur
router.get('/logout',logoutChauffeur);

// reserver une commande
router.post('/addCommand',checkTokenChauffeur,prandreCommande);

module.exports = router;