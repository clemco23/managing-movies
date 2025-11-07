import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export default function Register() {
const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Ajouter un film</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="titre du film"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="director">
            director
          </label>
          <input
            id="director"
            name="director"
            type="text"
            value={formData.director}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="realisateur"
            required
          />
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="releaseYear">
            releaseYear
          </label>
          <input
            id="releaseYear"
            name="releaseYear"
            type="number"
            value={formData.releaseYear}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="2002"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="filename">
            pictures
          </label>
          <input
            id="pictures"
            name="pictures"
            type="file"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="path to picture"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="description du film"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="categorie">
            categorie
          </label>
          <input
            id="categorie"
            name="categorie"
            type="text"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="thriller, comedie..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="rating">
            rating
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="rating sur 10"
            required
          />
        </div>

        <div className="mb-4">
  <label className="block text-gray-700 mb-2">Vue ?</label>
  
  <div className="flex items-center space-x-4">
    <label className="flex items-center">
      <input
        type="radio"
        id="watched-true"
        name="watched"
        value="true"
        onChange={handleChange}
        className="mr-2"
        required
      />
      Oui
    </label>

    <label className="flex items-center">
      <input
        type="radio"
        id="watched-false"
        name="watched"
        value="false"
        onChange={handleChange}
        className="mr-2"
      />
      Non
    </label>
  </div>
</div>


        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "En cours..." : "film ajouté"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
  
    </div>
  );
}
