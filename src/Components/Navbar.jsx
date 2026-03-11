import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logoImg from "../images/logo1.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const navigate = useNavigate();

  // ✅ Load user + superuser info dynamically
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem("user");
        const superFlag = localStorage.getItem("is_superuser");

        if (userData) {
          const parsed = JSON.parse(userData);
          console.log("⚡ Loaded user data:", parsed);
          setUser(parsed);

          const isSuper =
            parsed?.is_superuser === true ||
            parsed?.is_superuser === "true" ||
            parsed?.is_staff === true ||
            superFlag === "true" ||
            superFlag === true;

          setIsSuperUser(isSuper);
          console.log("🧩 Superuser:", isSuper);
        } else {
          setUser(null);
          setIsSuperUser(false);
        }
      } catch (error) {
        console.error("Error loading user info:", error);
        setUser(null);
        setIsSuperUser(false);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // 🔍 Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return setResults([]);

    try {
      const response = await axios.get(
        `https://fooddevbackend-production.up.railway.app/api/items/?search=${searchQuery}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("is_superuser");
    setUser(null);
    setIsSuperUser(false);
    setShowDropdown(false);
    navigate("/login");
  };

  // ✅ Helper for getting first letter safely
  const getFirstLetter = (text) => {
    if (!text) return "";
    const trimmed = text.trim();
    return trimmed.length > 0 ? trimmed[0].toUpperCase() : "";
  };

  // ✅ Reliable display letter logic
  const displayLetter = useMemo(() => {
    if (!user) return "👤";
    return (
      getFirstLetter(user.full_name) ||
      getFirstLetter(user.email) ||
      "👤"
    );
  }, [user]);

  return (
<> 
<nav className="bg-red-600 text-white px-4 py-3 shadow-md"> <div className="max-w-1xl mx-auto flex justify-between items-center">
    {/* 🔹 Logo + Title */}
    <div className="flex items-center space-x-2">
      <img
        src={logoImg}
        alt="Restaurant Logo"
        className="h-10 w-auto rounded-xl"
      />
      <span className="text-2xl font-bold">Book My Order</span>
    </div>

    {/* 🔹 Desktop Menu */}
    <div className="hidden md:flex items-center space-x-4">

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white rounded-full px-3 py-1 shadow-inner"
      >
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-2 p-1 text-gray-800 bg-transparent outline-none w-40"
        />
        <button
          type="submit"
          className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-700"
        >
          Search
        </button>
      </form>

      <Link to="/view">
        <i className="fas fa-home" style={{ fontSize: "22px" }}></i>
      </Link>

      <Link to="/cart">
        <i className="fa fa-shopping-cart" style={{ fontSize: "22px" }}></i>
      </Link>

      {/* Profile */}
      <div className="relative">
        {!user ? (
          <div className="w-9 h-9 bg-gray-300 animate-pulse rounded-full" />
        ) : (
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center font-semibold cursor-pointer"
          >
            {displayLetter}
          </div>
        )}

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">

            {!user ? (
              <>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-100">
                  Register
                </Link>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                  Login
                </Link>
              </>
            ) : (
              <>
                <div className="px-4 py-2 font-semibold border-b">
                  👤 {user.full_name || user.email}
                </div>

                <Link to="/view" className="block px-4 py-2 hover:bg-gray-100">
                  Home
                </Link>

                <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                  Your Orders
                </Link>

                {isSuperUser && (
                  <>
                    <Link to="/profit" className="block px-4 py-2 hover:bg-gray-100">
                      Profits & Overview
                    </Link>

                    <Link to="/upload" className="block px-4 py-2 hover:bg-gray-100">
                      Upload Items
                    </Link>

                    <Link to="/Allorders" className="block px-4 py-2 hover:bg-gray-100">
                      User Order details
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>

    {/* 🔹 Mobile Toggle */}
    <button
      className="md:hidden text-lg font-semibold"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? "✕" : "☰"}
    </button>
  </div>
</nav>

{/* 📱 Mobile Menu */}
{isOpen && (

  <div className="md:hidden bg-red-600 text-white px-4 py-5 space-y-4">

```
{/* Search */}
<form
  onSubmit={handleSearch}
  className="flex items-center bg-white rounded-full px-3 py-2"
>
  <input
    type="text"
    placeholder="Search items..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="ml-2 p-1 text-gray-800 bg-transparent outline-none w-full"
  />
  <button
    type="submit"
    className="bg-red-500 text-white px-4 py-1 rounded-full"
  >
    Search
  </button>
</form>

{/* Menu Links */}
<div className="flex flex-col space-y-3 text-lg font-medium">

  <Link
    to="/view"
    onClick={() => setIsOpen(false)}
    className="border-b border-red-400 pb-2"
  >
    🏠 Home
  </Link>

  <Link
    to="/cart"
    onClick={() => setIsOpen(false)}
    className="border-b border-red-400 pb-2"
  >
    🛒 Cart
  </Link>

  {!user ? (
    <>
      <Link
        to="/login"
        onClick={() => setIsOpen(false)}
        className="border-b border-red-400 pb-2"
      >
        🔐 Login
      </Link>

      <Link
        to="/register"
        onClick={() => setIsOpen(false)}
        className="border-b border-red-400 pb-2"
      >
        📝 Register
      </Link>
    </>
  ) : (
    <>
      <Link
        to="/orders"
        onClick={() => setIsOpen(false)}
        className="border-b border-red-400 pb-2"
      >
        📦 Your Orders
      </Link>

      {isSuperUser && (
        <>
          <Link
            to="/profit"
            onClick={() => setIsOpen(false)}
            className="border-b border-red-400 pb-2"
          >
            💰 Profits
          </Link>

          <Link
            to="/upload"
            onClick={() => setIsOpen(false)}
            className="border-b border-red-400 pb-2"
          >
            ⬆ Upload Items
          </Link>

          <Link
            to="/Allorders"
            onClick={() => setIsOpen(false)}
            className="border-b border-red-400 pb-2"
          >
            📋 User Order Details
          </Link>
        </>
      )}

      <button
        onClick={handleLogout}
        className="text-left border-b border-red-400 pb-2"
      >
        🚪 Logout
      </button>
    </>
  )}
</div>
```

  </div>
)}
</>
);
}
export default Navbar;