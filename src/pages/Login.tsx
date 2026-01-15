import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/login.mp4"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-5"></div>
      <div className="relative z-15 w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Tervetuloa takaisin</h2>
          <p className="mt-2 text-white/70">Kirjaudu sisään jatkaaksesi</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white/80">
                Sähköposti
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nimi@esimerkki.fi"
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-ts-red focus:border-transparent outline-none transition-all placeholder-gray-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white/80">
                Salasana
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Salasana"
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-ts-red focus:border-transparent outline-none transition-all placeholder-gray-500 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ts-red hover:bg-ts-red-dark rounded-lg text-white font-semibold transition-all hover:scale-105"
            >
              Kirjaudu sisään
            </button>
          </div>
        </form>

        <div className="border-t border-white/10 text-center mt-8 pt-4">
          <p className="text-white/70">
            Ei vielä tiliä?{" "}
            <a
              href="mailto:hello@onnisalomaa.dev"
              className="text-ts-red font-semibold hover:underline hover:text-ts-red/80 transition-colors focus:outline-none"
            >
              Ota yhteyttä
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
