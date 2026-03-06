import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Button({ label, dropdownItems = [], className = "" }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasDropdown = dropdownItems.length > 0;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => hasDropdown && setOpen(!open)}
        className={`px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition ${className}`}
      >
        {label}
      </button>

      {hasDropdown && open && (
        <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg z-10">
          {dropdownItems.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)} // ferme le menu quand on clique
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
