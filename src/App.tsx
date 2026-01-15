import React, { useState, useEffect } from "react";
import { type User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

const Navbar = ({ user }: { user: User | null }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <nav
      className={`w-full p-4 z-10 ${
        isLoginPage
          ? "absolute top-0 left-0 bg-transparent"
          : "relative bg-gray-800"
      }`}
    >
      <div className="flex justify-between items-center text-white">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="h-16" />
        </Link>

        {user ? (
          <div>
            <span className="mr-4">Terve, {user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : isLoginPage ? null : (
          <Link
            className="bg-ts-red hover:bg-ts-red/80 rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 px-4 py-2"
            to="/login"
          >
            Kirjaudu sisään
          </Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tournament/:id" element={<div>Tournament Details</div>} />
        <Route
          path="/create"
          element={
            user ? (
              <div>Create Tournament</div>
            ) : (
              <div>Please log in to create a tournament.</div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
