const express = require('express');
const router = express.Router(); 
const filmController = require('../../controllers/films/filmController');
const verifyToken = require('../../middlewares/verifyToken');
const multer = require('multer');
const path = require('path');

//  Configuration du stockage local pour les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/films'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '_' + uniqueSuffix);
  }
});

const upload = multer({ storage });

//routes Privées
router.get('/', verifyToken, filmController.getAllFilms);
router.get('/:id', verifyToken, filmController.getFilmById);
router.post('/', verifyToken, upload.single('pictures'), filmController.createFilm);
router.patch('/:id', verifyToken, filmController.updateFilm);
router.delete('/:id', verifyToken, filmController.deleteFilm);


module.exports = router;