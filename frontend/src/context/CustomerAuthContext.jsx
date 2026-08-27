import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const CustomerAuthContext = createContext(null);

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ga_customer_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/customers/me")
      .then((res) => setCustomer(res.data))
      .catch(() => localStorage.removeItem("ga_customer_token"))
      .finally(() => setLoading(false));
  }, []);

  const register = async (data) => {
    const res = await api.post("/customers/register", data);
    localStorage.setItem("ga_customer_token", res.data.token);
    setCustomer(res.data);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post("/customers/login", { email, password });
    localStorage.setItem("ga_customer_token", res.data.token);
    setCustomer(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("ga_customer_token");
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, register, login, logout, loading }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export const useCustomerAuth = () => useContext(CustomerAuthContext);
