import { Link } from "react-router-dom";
import { Film, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();



    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        console.log("Donnée trouvée dans localStorage :", savedUser);

        if (savedUser && savedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(savedUser);
                console.log("Utilisateur parsé :", parsedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Erreur de parsing JSON:", error);
                localStorage.removeItem("user");
            }
        }
    }, []);

    // 🧠 Fermer le dropdown si clic à l’extérieur
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🚪 Déconnexion
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 flex justify-between items-center">
            {/* Logo & titre */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Link to="/home">
                        <Film className="w-6 h-6 text-white" />
                    </Link>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">MovieVault</h1>
                    <p className="text-xs text-gray-400">Your Cinema Collection</p>
                </div>
            </div>

            {/* Partie droite */}
            <div className="relative bg-white/10 p-2 rounded-lg flex items-center" ref={dropdownRef}>
                {user ? (
                    <>
                        {/* Bouton du dropdown */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 text-white hover:text-gray-300"
                        >
                            {user.photo && (
                                <img
                                    src={`http://localhost:3000${user.photo}`} 
                                    alt="Photo de profil"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            )}
                            <span>{user.nickname}</span>
                        </button>

                        {/* Menu déroulant */}
                        {open && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </>
                ) : (

                    <div className="flex items-center gap-2 text-gray-400">
                        <Link to="/login" className="flex items-center gap-2 hover:text-blue-400">
                            <User size={18} />
                            <span>Se connecter</span>
                        </Link>
                    </div>

                )}
            </div>
        </nav>
    );
}
