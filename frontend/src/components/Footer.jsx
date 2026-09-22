import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const socialLinks = [
  { name: "Instagram", url: import.meta.env.VITE_INSTAGRAM_URL, icon: "instagram" },
  { name: "Facebook", url: import.meta.env.VITE_FACEBOOK_URL, icon: "facebook" },
];

function SocialIcon({ name }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {name === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </>
      ) : (
        <path d="M14 21v-8h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v8" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface border-t border-ink/10 mt-24 scroll-mt-40">
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
          <h4 className="text-ivory mb-3 uppercase tracking-wider text-xs">Contact Us</h4>
          <a href="mailto:support@giftaimers.com" className="hover:text-gold transition-colors">support@giftaimers.com</a>
          <p>Bhopal, Madhya Pradesh, India</p>
          <div className="mt-4 flex flex-wrap gap-3" aria-label="Social media">
            {socialLinks.map(({ name, url, icon }) => {
              const className = "inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/15 px-4 py-2";
              const content = <><SocialIcon name={icon} /><span>{name}</span></>;
              return /^https?:\/\//i.test(url || "") ? (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`} className={`${className} hover:border-gold hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold`}>
                  {content}
                </a>
              ) : (
                <span key={name} aria-disabled="true" title={`${name} profile coming soon`} className={`${className} opacity-50`}>
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-ivory/40 pb-6">
        © {new Date().getFullYear()} GiftAimers. All rights reserved.
      </div>
    </footer>
  );
}
