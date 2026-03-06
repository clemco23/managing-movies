import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import   Snowfall from 'react-snowfall'

export default function Home() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [recs, setRecs] = useState([]);
const [loadingRecs, setLoadingRecs] = useState(true);
const [errorRecs, setErrorRecs] = useState("");

    useEffect(() => {
        // 🔐 Vérifie la connexion
        const savedUser = localStorage.getItem("user");
        if (!savedUser || savedUser === "undefined") {
            navigate("/"); // Redirige vers Register si pas connecté
            return;
        }

        const user = JSON.parse(savedUser);

        const fetchFilms = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `http://localhost:3000/api/films/`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFilms(res.data.films);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des films");
            } finally {
                setLoading(false);
            }
        };

        const fetchRecs = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:3000/api/films/recommendations?limit=5",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRecs(res.data);
  } catch (err) {
    console.error(err);
    setErrorRecs("Erreur lors du chargement des recommandations");
  } finally {
    setLoadingRecs(false);
  }
};

        fetchFilms();
        fetchRecs();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600">Chargement des films...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    const handleDelete = async (filmId) => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce film ?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3000/api/films/${filmId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 🔄 Met à jour l'état local sans recharger la page
            setFilms((prevFilms) => prevFilms.filter((film) => film._id !== filmId));

            alert("🎬 Film supprimé avec succès !");
        } catch (error) {
            console.error("Erreur lors de la suppression du film :", error);
            alert("❌ Impossible de supprimer ce film");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
            <Snowfall color="#82C3D9"/>
            <div className="flex justify-between items-center px-10 pt-4 mb-8">
                <div className="flex-column items-center">
                    <h1 className="  text-5xl font-bold text-white  ml-8">
                        My Movie Vault
                    </h1>
                    <h3 className="text-xl  text-gray-700 ml-8 pt-8">
                        Your personal cinema collection
                    </h3>
                </div>
                
                <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition">
                <Link to="/addFilm" className="block w-full h-full">
                    Ajouter un film 
                </Link>
                </button>
            </div>
           


            {films.length === 0 ? (
                <p className="text-center text-gray-500">
                    Aucun film pour le moment 😅
                </p>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    
                    {films.map((film) => (
                        <div
                            key={film._id}
                            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
                        >
                            {film.pictures && (
                                <img
                                    src={`http://localhost:3000${film.pictures}`}
                                    alt={film.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {film.title}
                                </h2>
                                <p className="text-sm text-gray-600">{film.description}</p>
                                <p className="text-s text-grey-600">{film.categorie}</p>
                                <p className="text-sm text-gray-600">Réalisé par: {film.director}</p>
                                <p className="text-sm text-gray-600">Année: {film.releaseYear}</p>
                                <p className="text-sm text-gray-600">Note: {film.rating}/10</p>
                                <p className="text-sm text-gray-600">Vu: {film.watched ? "Oui" : "Non"}</p>
                                <button
                                    onClick={() => handleDelete(film._id)}
                                    className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                >
                                    Supprimer
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
                
            )}
            

             <div className="mt-12 px-2">
  <h2 className="text-3xl font-bold text-white mb-6 ml-2">
    Recommandés pour toi
  </h2>

  {loadingRecs && (
    <p className="text-gray-400 ml-2">Chargement des recommandations…</p>
  )}

  {errorRecs && (
    <p className="text-red-500 ml-2">{errorRecs}</p>
  )}

  {!loadingRecs && !errorRecs && recs.length === 0 && (
    <p className="text-gray-400 ml-2">
      Ajoute au moins un film pour obtenir des recommandations 🙂
    </p>
  )}

  {!loadingRecs && !errorRecs && recs.length > 0 && (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recs.map((m) => {
        const posterUrl = m.poster_path
          ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
          : null;

        return (
          <div
            key={m.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
          >
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={m.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200" />
            )}

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {m.title}
              </h3>
              <p className="text-sm text-gray-600">
                {(m.overview || "").slice(0, 120)}
                {m.overview?.length > 120 ? "…" : ""}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                ⭐ {Number(m.vote_average || 0).toFixed(1)} •{" "}
                {m.release_date ? m.release_date.slice(0, 4) : "—"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>


        </div>
    );
}
