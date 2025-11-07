import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Home() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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

        fetchFilms();
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
            <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
                🎬 Mes Films
            </h1>

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
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition">
                <Link to="/addFilm" className="block w-full h-full">
                    Ajouter un film +
                </Link>
            </button>



        </div>
    );
}
