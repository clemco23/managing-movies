import { useState, useEffect } from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export default function addFilm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/categories");
        setCategories(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);


  const [formData, setFormData] = useState({
    title: "",
    director: "",
    releaseYear: "",
    pictures: "",
    description: "",
    categorie: "",
    rating: "",
    watched: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Si c'est un fichier
    if (type === "file" && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
    // Si c'est le champ radio "watched"
    else if (name === "watched") {
      setFormData({ ...formData, watched: value === "true" });
    }
    // Sinon, champ classique
    else {
      setFormData({ ...formData, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("❌ Vous devez être connecté pour ajouter un film");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("director", formData.director);
      data.append("releaseYear", formData.releaseYear);
      data.append("pictures", formData.pictures);
      data.append("description", formData.description);
      data.append("categorie", formData.categorie);
      data.append("rating", formData.rating);
      data.append("watched", formData.watched);
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }


      const res = await axios.post(
        "http://localhost:3000/api/films/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );




      setMessage("✅ film ajouté avec succès !");
      console.log("Réponse du serveur :", res.data);

      setTimeout(() => navigate("/home"), 500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de l'ajout du film");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 text-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-slate-800"
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Ajouter un Film
        </h2>

        <div className="space-y-5">
          {/* Titre & Réalisateur côte à côte */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="title">
                Titre
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-500"
                placeholder="Inception..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="director">
                Réalisateur
              </label>
              <input
                id="director"
                name="director"
                type="text"
                value={formData.director}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-500"
                placeholder="C. Nolan"
                required
              />
            </div>
          </div>

          {/* Année & Note */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="releaseYear">
                Année
              </label>
              <input
                id="releaseYear"
                name="releaseYear"
                type="number"
                value={formData.releaseYear}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="2010"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="rating">
                Note / 10
              </label>
              <input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="10"
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="8.5"
                required
              />
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="categorie">
              Catégorie
            </label>
            <select
              id="categorie"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer"
              required
            >
              <option value="">-- Choisir un genre --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id} className="bg-slate-900">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="2"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-slate-500"
              placeholder="Un voyage au coeur de l'esprit..."
              required
            />
          </div>

          {/* Image Upload Custom */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1" htmlFor="pictures">
              Affiche du film
            </label>
            <input
              id="pictures"
              name="pictures"
              type="file"
              onChange={handleChange}
              className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
              required
            />
          </div>

          {/* Radio Buttons (Vue ?) */}
          <div className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Déjà vu ?</span>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="watched"
                  value="true"
                  onChange={handleChange}
                  className="hidden peer"
                  required
                />
                <div className="w-4 h-4 rounded-full border-2 border-slate-500 mr-2 peer-checked:bg-red-600 peer-checked:border-red-600 transition-all"></div>
                <span className="text-sm peer-checked:text-white text-slate-400">Oui</span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="watched"
                  value="false"
                  onChange={handleChange}
                  className="hidden peer"
                />
                <div className="w-4 h-4 rounded-full border-2 border-slate-500 mr-2 peer-checked:bg-red-600 peer-checked:border-red-600 transition-all"></div>
                <span className="text-sm peer-checked:text-white text-slate-400">Non</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/20 transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center italic">
                Enregistrement...
              </span>
            ) : (
              "Ajouter à ma collection"
            )}
          </button>
        </div>

        {/* Feedback Message */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${message.startsWith("✅") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
            {message}
          </div>
        )}
      </form>

    </div>
  );
}
