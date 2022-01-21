const express = require('express');
const router = express.Router();
const {checkTokenManager} = require('../auth/checkToken');
const {addResponsableLivraison,updateResponsableLivraison,getAllresponsableLivraison,getResponsableLivraisonById,deleteResponsableLivraison,loginResponsableLivraison,logoutResponsableLivraison} = require('../controllers/responsableLivraisonController');

// route for get all responsableLivraison
router.get('/',checkTokenManager,getAllresponsableLivraison);

// route for get responsableLivraison by id
router.get('/:id',checkTokenManager,getResponsableLivraisonById);

// add responsableLivraison
router.post('/',checkTokenManager,addResponsableLivraison);

// update responsableLivraison
router.patch('/:id',checkTokenManager,updateResponsableLivraison);

// delete responsableLivraison by id
router.delete('/:id',checkTokenManager,deleteResponsableLivraison);

// autontification responsableLivraison
router.post('/login',loginResponsableLivraison);

// deconnecter responsableLivraison
router.get('/logout',logoutResponsableLivraison);

module.exports = router;