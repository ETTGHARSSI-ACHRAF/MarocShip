const express = require('express');
const router = express.Router();
const {addLivraison,getAllLivraisonByStatu}= require('../controllers/livraisonController');
const {checkTokenResponsableLivraison,checkTokenChauffeur} = require('../auth/checkToken');
// router.post('/login',checkToken.checkToken,Admin.loginAdmin);
router.post('/',checkTokenResponsableLivraison,addLivraison);

// get libraison by statu
router.get('/statu',checkTokenChauffeur,getAllLivraisonByStatu);
module.exports = router;