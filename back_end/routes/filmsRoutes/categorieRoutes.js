const express = require("express");
const router = express.Router();
const Categorie = require("../../models/filmsModels/CategorieFilm");

router.get("/", async (req, res) => {
  const cats = await Categorie.find().sort({ name: 1 });
  res.json(cats);
});

module.exports = router;
