const express = require('express');
const router = express.Router(); 
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');
const path = require('path');

//  Configuration du stockage local pour les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier où les images seront enregistrées
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '_' + uniqueSuffix);
  }
});

const upload = multer({ storage });


// router.post('/:id/photo', upload.single('photo'), userController.uploadPhoto);



//routes Publiques
// router.post('/', userController.createUser);
router.post('/', upload.single('photo'), userController.createUser);
router.post('/login', userController.loginUser);

//routes Privées
router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.patch('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);


module.exports = router;


