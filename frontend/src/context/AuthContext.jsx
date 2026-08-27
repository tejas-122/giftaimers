import React, { createContext, useContext, useEffect, useState } from "react";
import adminApi from "../api/adminApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ga_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    adminApi
      .get("/auth/me")
      .then((res) => setAdmin(res.data))
      .catch(() => localStorage.removeItem("ga_admin_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await adminApi.post("/auth/login", { email, password });
    localStorage.setItem("ga_admin_token", res.data.token);
    setAdmin(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("ga_admin_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
