const Film = require('../../models/filmsModels/Film');
const jwt = require('jsonwebtoken');

exports.getAllFilms = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const films = await Film.find({ userId: req.user.userId }); // ✅ le bon champ
    res.status(200).json({ films, message: 'Films retrieved successfully' });
  } catch (error) {
    console.error("Erreur getAllFilms:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getFilmById = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const film = await Film.findById(req.params.id);
        if (!film) {
            return res.status(404).json({ message: 'Film not found' });
        }
        res.status(200).json({ film, message: 'Film retrieved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFilm = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("===> Fichier reçu:", req.file);
console.log("===> Corps de la requête:", req.body);


    const { title, director, releaseYear, description, categorie, rating, watched } = req.body;

    // Vérifie que le fichier est bien reçu
    const pictures = req.file ? `/uploads/films/${req.file.filename}` : null;

    // Vérifie que les champs obligatoires sont présents
    if (!title || !director || !releaseYear) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const newFilm = new Film({
      title,
      director,
      releaseYear,
      pictures,
      description,
      categorie,
      rating,
      watched,
      userId: req.user.userId, // récupéré du token
    });

    const savedFilm = await newFilm.save();
    res.status(201).json(savedFilm);
  } catch (error) {
    console.error("Erreur création film :", error);
    res.status(400).json({ message: "Erreur lors de la création du film", error });
  }
};


exports.updateFilm = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const film = await Film.findById(req.params.id);
        if (!film) {
            return res.status(404).json({ message: 'Film not found' });
        }
        if (film.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }   
        const { title, director, releaseYear, pictures, description, rating, categorie } = req.body;
        film.title = title || film.title;
        film.director = director || film.director;
        film.releaseYear = releaseYear || film.releaseYear;
        film.pictures = pictures || film.pictures;
        film.description = description || film.description;
        film.rating = rating || film.rating;
        film.categorie = categorie || film.categorie;
        await film.save();
        res.status(200).json({ film, message: 'Film updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteFilm = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }   
      try {
    const film = await Film.findByIdAndDelete(req.params.id);
    if (!film) {
      return res.status(404).json({ message: "Film non trouvé" });
    }

    res.status(200).json({ message: "Film supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};