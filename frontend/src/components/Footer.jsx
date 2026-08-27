import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-ink/10 mt-24">
      <div className="ribbon-divider" />
      <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 font-body text-sm text-ivory/70">
        <div>
          <img src={logo} alt="GiftAimers" className="h-16 w-16 object-contain mb-3" />
          <p>Aim to spread love through gifts. Every order, personalized and wrapped with intention.</p>
        </div>
        <div>
          <h4 className="text-ivory mb-3 uppercase tracking-wider text-xs">Store</h4>
          <ul className="space-y-2">
            <li><Link to="/shop" className="hover:text-gold">Shop All</Link></li>
            <li><Link to="/track-order" className="hover:text-gold">Track an Order</Link></li>
            <li><Link to="/signin" className="hover:text-gold">Sign In / Sign Up</Link></li>
            <li><Link to="/admin/login" className="hover:text-gold">Admin Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-ivory mb-3 uppercase tracking-wider text-xs">Contact</h4>
          <p>support@giftaimers.com</p>
          <p>Bhopal, Madhya Pradesh, India</p>
        </div>
      </div>
      <div className="text-center text-xs text-ivory/40 pb-6">
        © {new Date().getFullYear()} GiftAimers. All rights reserved.
      </div>
    </footer>
  );
}
