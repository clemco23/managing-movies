import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Navbar from "./components/Navbar.jsx";
import AddFilm from "./pages/addFilm.jsx";
// import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
    <Navbar />  
      <Routes>
        <Route path="/home" element={<Home />} />     {/* Accueil */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
        <Route path="/addFilm" element={<AddFilm />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
