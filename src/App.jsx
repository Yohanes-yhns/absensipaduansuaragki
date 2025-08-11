import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FaMusic } from 'react-icons/fa';
import './App.css';
import AbsensiPage from './pages/AbsensiPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="navContainer">
          <div className="brand">
            <FaMusic /> 
            <span>Absensi Paduan Suara</span>
          </div>
          <div className="navLinks">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "navLink activeLink" : "navLink"}
            >
              Absensi
            </NavLink>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<AbsensiPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;