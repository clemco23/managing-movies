const express = require ('express');
const router = express.Router();
const favoriController = require('../../controllers/films/favoriController');
const verifyToken = require('../../middlewares/verifyToken');

//routes Privées
router.get('/', verifyToken, favoriController.getAllFavoris);
router.post('/', verifyToken, favoriController.addFavori);
router.delete('/:id', verifyToken, favoriController.removeFavori);

module.exports = router;