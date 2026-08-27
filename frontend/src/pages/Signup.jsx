import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";
import logo from "../assets/logo.png";

export default function SignUp() {
  const { register } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to GiftAimers.");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="GiftAimers" className="h-20 w-20 object-contain mb-2" />
        <h1 className="font-display text-2xl text-ivory">Create your account</h1>
        <p className="text-muted text-sm">Takes less than a minute</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name" required placeholder="Full name" value={form.name} onChange={handleChange}
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-muted"
        />
        <input
          name="email" type="email" required placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-muted"
        />
        <input
          name="phone" type="tel" required placeholder="Phone number" value={form.phone} onChange={handleChange}
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-muted"
        />
        <input
          name="password" type="password" required minLength={6} placeholder="Password (min. 6 characters)" value={form.password} onChange={handleChange}
          className="w-full bg-surface2 border border-ink/10 rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-muted"
        />
        <button
          disabled={loading}
          className="w-full bg-gold text-white py-3 rounded-full font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{" "}
        <Link to="/signin" state={{ from: redirectTo }} className="text-gold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
