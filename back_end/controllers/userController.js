// const e = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({users, message: 'Users retrieved successfully' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json({ user, message: 'User retrieved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};

// exports.createUser = async (req, res) => {
//  try {
//         const { name, nickname, email, password, photo } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ name, nickname, email, password: hashedPassword, photo });
//         User.photo = photoPath;
//         await newUser.save();
//         res.status(201).json(newUser, { message: 'User created successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

exports.createUser = async (req, res) => {
  try {
    const { name, nickname, email, password } = req.body;

    // Vérifie si un fichier a été uploadé
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = new User({
      name,
      nickname,
      email,
      password: hashedPassword,
      photo: photoPath
    });

    await newUser.save();

    res.status(201).json({
      user: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        if (!req.user || (req.user.role !== 'admin' && req.user.userId !== req.params.id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true , runValidators: true}
        ).select('-password');
        if (!updateUser) {
            return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json({ updateUser, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!req.user || (req.user.role !== 'admin' && req.user.userId !== req.params.id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        if (!deleteUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!req.user || (req.user.role !== 'admin' && req.user.userId !== req.params.id)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginUser = await User.findOne({ email });
        if (!loginUser) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }   
        const isMatch = await bcrypt.compare(password, loginUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { userId: loginUser._id, role: loginUser.role }, 
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ExPIRES_IN }
        );
        res.status(200).json({ loginUser,token, message: 'Login successful' });
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Upload photo de profil
// exports.uploadPhoto = async (req, res) => {
//     try {
//         const userId = req.params.id;

        
//         if (!req.file) {
//             return res.status(400).json({ message: 'Aucune image envoyée' });
//         }

//         const photoPath = `/uploads/${req.file.filename}`;

       
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé' });
//         }

        
//         if (user.photo && fs.existsSync(path.join(__dirname, '..', user.photo))) {
//             fs.unlinkSync(path.join(__dirname, '..', user.photo));
//         }

        
//         user.photo = photoPath;
//         await user.save();

//         res.status(200).json({
//             message: 'Photo de profil mise à jour avec succès',
//             photo: user.photo,
//             user
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };

 
