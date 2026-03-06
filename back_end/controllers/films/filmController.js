const Film = require('../../models/filmsModels/Film');
const jwt = require('jsonwebtoken');
const { matchWithTMDB } = require("../../services/tmdb");
const axios = require("axios");


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

// exports.createFilm = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);
//     console.log("===> Fichier reçu:", req.file);
// console.log("===> Corps de la requête:", req.body);


//     const { title, director, releaseYear, description, categorie, rating, watched } = req.body;

//     // Vérifie que le fichier est bien reçu
//     const pictures = req.file ? `/uploads/films/${req.file.filename}` : null;

//     // Vérifie que les champs obligatoires sont présents
//     if (!title || !director || !releaseYear) {
//       return res.status(400).json({ message: "Champs obligatoires manquants" });
//     }

//     const newFilm = new Film({
//       title,
//       director,
//       releaseYear,
//       pictures,
//       description,
//       categorie,
//       rating,
//       watched,
//       userId: req.user.userId, // récupéré du token
//     });

//     const savedFilm = await newFilm.save();
//     res.status(201).json(savedFilm);
//      // 2) appeler TMDB (après avoir savedFilm)
//     let tmdbData = null;
//     try {
//       tmdbData = await matchWithTMDB(savedFilm.title, savedFilm.releaseYear);
//       console.log("TMDB RESULT:", tmdbData);
//     } catch (e) {
//       console.warn("TMDB match error:", e.message);
//     }

//     // 3) si TMDB a trouvé -> update du film
//     if (tmdbData && tmdbData.tmdbId) {
//       await Film.findByIdAndUpdate(savedFilm._id, tmdbData);
//     }

//     // 4) renvoyer la version finale
//     const finalFilm = await Film.findById(savedFilm._id);
//     return res.status(201).json(finalFilm);
//   } catch (error) {
//     console.error("Erreur création film :", error);
//     res.status(400).json({ message: "Erreur lors de la création du film", error });
//   }
// };

exports.createFilm = async (req, res) => {
  try {
    const { title, director, releaseYear, description, categorie, rating, watched } = req.body;

    const pictures = req.file ? `/uploads/films/${req.file.filename}` : null;

    if (!title || !director || !releaseYear) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    // 1) save
    const savedFilm = await Film.create({
      title,
      director,
      releaseYear: Number(releaseYear),
      pictures,
      description,
      categorie,
      rating: Number(rating),
      watched: watched === "true" || watched === true,
      userId: req.user.userId,
    });

    // 2) TMDB match + update
    try {
      const tmdbData = await matchWithTMDB(savedFilm.title, savedFilm.releaseYear);
      console.log("TMDB RESULT:", tmdbData);

      if (tmdbData && tmdbData.tmdbId) {
        await Film.findByIdAndUpdate(savedFilm._id, tmdbData);
      }
    } catch (e) {
      console.warn("TMDB match error:", e.message);
    }

    // 3) return final (ONE response)
    const finalFilm = await Film.findById(savedFilm._id);
    return res.status(201).json(finalFilm);

  } catch (error) {
    console.error("Erreur création film :", error);
    return res.status(500).json({ message: "Erreur lors de la création du film", error: error.message });
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



exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = Number(req.query.limit || 20);

    // 1) Seeds = films ajoutés qui ont tmdbId
    const seeds = await Film.find({
      userId,
      tmdbId: { $ne: null },
    })
      .sort({ _id: -1 })
      .limit(10)
      .lean();

    if (!seeds.length) return res.json([]);

    // 2) tmdbIds déjà dans la liste -> à exclure
    const already = await Film.find({ userId, tmdbId: { $ne: null } })
      .select("tmdbId -_id")
      .lean();
    const alreadySet = new Set(already.map(x => x.tmdbId));

    const TMDB_BASE = "https://api.themoviedb.org/3";
    const TMDB_KEY = process.env.TMDB_API_KEY;

    // 3) On récupère une liste de recos par seed (sans scoring global)
    const perSeedLists = [];
    for (const seed of seeds) {
      const r = await axios.get(`${TMDB_BASE}/movie/${seed.tmdbId}/recommendations`, {
        params: { api_key: TMDB_KEY, language: "fr-FR" },
      });

      // on filtre déjà : pas de doublons "déjà ajoutés"
      const list = (r.data.results || [])
        .filter(m => m?.id && !alreadySet.has(m.id))
        .slice(0, 30); // on garde une réserve

      perSeedLists.push(list);
    }

    // 4) Round-robin: on prend 1 film par seed à tour de rôle
    const out = [];
    const used = new Set(); // éviter doublons entre seeds
    let i = 0;

    while (out.length < limit) {
      let progressed = false;

      for (let s = 0; s < perSeedLists.length && out.length < limit; s++) {
        const list = perSeedLists[s];

        // avance dans la liste jusqu'à trouver un film pas encore utilisé
        while (list.length && used.has(list[0].id)) {
          list.shift();
        }

        if (list.length) {
          const pick = list.shift();
          used.add(pick.id);
          out.push(pick);
          progressed = true;
        }
      }

      // si aucune liste n'a pu fournir un film, on stop
      if (!progressed) break;

      // sécurité anti-boucle infinie
      i++;
      if (i > 2000) break;
    }

    return res.json(out);
  } catch (e) {
    return res.status(500).json({ message: "Erreur recommendations", error: e.message });
  }
};

