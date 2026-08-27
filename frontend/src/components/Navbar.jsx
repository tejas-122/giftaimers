import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { itemCount } = useCart();
  const { customer } = useCustomerAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="GiftAimers" className="h-11 w-11 object-contain" />
          <span className="font-display text-xl tracking-wide text-ivory hidden sm:inline">
            gift<span className="text-gold">aimers</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm text-ivory/80">
          <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <Link to="/track-order" className="hover:text-gold transition-colors">Track Order</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to={customer ? "/account" : "/signin"} className="text-sm text-ivory/80 hover:text-gold transition-colors hidden sm:inline">
            {customer ? `Hi, ${customer.name.split(" ")[0]}` : "Sign In"}
          </Link>
          <Link to="/cart" className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17M9 21a1 1 0 100-2 1 1 0 000 2zM17 21a1 1 0 100-2 1 1 0 000 2z"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button className="md:hidden text-ivory" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 text-ivory/80 font-body text-sm">
          <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/track-order" onClick={() => setOpen(false)}>Track Order</Link>
          <Link to={customer ? "/account" : "/signin"} onClick={() => setOpen(false)}>
            {customer ? `Hi, ${customer.name.split(" ")[0]}` : "Sign In"}
          </Link>
        </div>
      )}
    </header>
  );
}
