import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export default function Register() {
const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    photo: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
  
    if (name === "photo" && files.length > 0) {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // --- Soumission du formulaire ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      // construction du corps de la requête
      const data = new FormData();
      data.append("name", formData.name);
      data.append("nickname", formData.nickname);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("photo", formData.photo); // fichier binaire
  
      // envoi vers ton API Node
      const res = await axios.post("http://localhost:3000/api/users", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setMessage("✅ Compte créé avec succès !");
      console.log("Réponse du serveur :", res.data);
  
      setTimeout(() => navigate("/login"), 500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Créer un compte</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ton nom"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="nickname">
            pseudo
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ton pseudo"
            required
          />
        </div>


        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="exemple@mail.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="********"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            phot de profil 
          </label>
          <input
            id="photo"
            name="photo"
            type="file"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "En cours..." : "S'inscrire"}
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
      <p className="mt-4 text-gray-600">
        Vous avez un compte ?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
