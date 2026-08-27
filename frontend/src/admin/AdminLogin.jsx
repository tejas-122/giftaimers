import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-5">
      <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-2xl border border-ink/10 w-full max-w-sm">
        <img src={logo} alt="GiftAimers" className="h-16 w-16 object-contain mb-3" />
        <h1 className="font-display text-2xl text-ivory mb-1">GiftAimers Admin</h1>
        <p className="text-muted text-sm mb-6">Sign in to manage products & orders</p>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory mb-3"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory mb-6"
        />
        <button
          disabled={loading}
          className="w-full bg-gold text-ink py-3 rounded-full font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
