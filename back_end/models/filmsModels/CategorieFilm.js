const mongoose = require('mongoose');
const categorieFilmSchema = new mongoose .Schema({
  
    name: {
        type: String,
        required: true,
    }
}, { timestamps: true,   collection: 'categorieFilm',  });   

module.exports = mongoose.model('CategorieFilm', categorieFilmSchema );



