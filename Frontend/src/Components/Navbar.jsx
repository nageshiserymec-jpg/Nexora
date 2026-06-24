import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ loged, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full px-6 md:px-12 py-4 bg-black/65 backdrop-blur-md shadow-lg border-b border-white/10 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-2xl md:text-3xl font-bold text-green-300 drop-shadow-md">
        <Link to="/">Nexora</Link>
      </h1>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-8 text-white text-xl font-bold">
        <a
          href="/"
          className="hover:text-green-300 transition-all duration-200">
          Home
        </a>
        <a
          href="#about"
          className="hover:text-green-300 transition-all duration-200">
          About
        </a>
        {loged ? (
          <button
            onClick={handleLogout}
            className="hover:text-red-400 transition-all duration-200">
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="hover:text-green-300 transition-all duration-200">
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white focus:outline-none">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-20 right-6 w-56 rounded-xl bg-black/80 text-white p-6 space-y-4 shadow-xl backdrop-blur-md md:hidden">
          <a
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-green-300">
            Home
          </a>
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-green-300">
            About
          </a>
          {loged ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full text-left hover:text-red-400">
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-green-300">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
