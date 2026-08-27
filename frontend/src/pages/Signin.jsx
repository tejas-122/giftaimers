import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";
import logo from "../assets/logo.png";

export default function SignIn() {
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="GiftAimers" className="h-20 w-20 object-contain mb-2" />
        <h1 className="font-display text-2xl text-ivory">Welcome back</h1>
        <p className="text-muted text-sm">Sign in to continue to checkout</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-muted"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-muted"
        />
        <button
          disabled={loading}
          className="w-full bg-gold text-white py-3 rounded-full font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-muted mt-6">
        New to GiftAimers?{" "}
        <Link to="/signup" state={{ from: redirectTo }} className="text-gold hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
