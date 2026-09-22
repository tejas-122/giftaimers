import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useCustomerAuth } from "../context/CustomerAuthContext.jsx";
import logo from "../assets/logo.png";
import api from "../api/api";

export function StoreIcon({ name }) {
  const paths = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    cart: <><path d="M2 3h3l3 12h11l3-9H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    account: <><rect x="3" y="3" width="18" height="18" rx="6" /><circle cx="12" cy="9" r="3" /><path d="M6 19c0-6 12-6 12 0" /></>,
    track: <><path d="m3 7 9-4 9 4v11l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v11M7 5l10 4" /></>,
    gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v9h14v-9M12 8v13M12 8C3 8 5 0 9 3l3 5Zm0 0c9 0 7-8 3-5l-3 5Z" /></>,
    more: <><rect x="3" y="3" width="18" height="18" rx="6" /><path d="M7 12h.01M12 12h.01M17 12h.01" strokeWidth="3" /></>,
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Navbar() {
  const { itemCount } = useCart();
  const { customer } = useCustomerAuth();
  const [search, setSearch] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => { api.get("/products/categories/list").then(({ data }) => setCategories(data)).catch(() => setCategories([])); }, []);
  const navigate = useNavigate();
  function searchGifts(event) {
    event.preventDefault();
    navigate(search.trim() ? `/shop?search=${encodeURIComponent(search.trim())}` : "/shop");
  }
  return (
    <header className="store-header font-body">
      <div className="store-topbar">
        <Link to="/" className="store-brand" aria-label="GiftAimers home"><img src={logo} alt="" /><span>gift<span className="text-gold">aimers</span><small>little gifts. big feelings.</small></span></Link>
        <div className="store-location"><span aria-hidden="true">🇮🇳</span><div>Made with love in<strong>Bhopal, Madhya Pradesh</strong></div></div>
        <form onSubmit={searchGifts} className="store-search" role="search"><input aria-label="Search gifts" type="search" placeholder="Find a gift they'll love..." value={search} onChange={(e) => setSearch(e.target.value)} /><button type="submit" aria-label="Search"><StoreIcon name="search" /></button></form>
        <Link to="/shop" className="store-finder"><StoreIcon name="gift" /> Find a gift</Link>
        <nav aria-label="Account and orders" className="store-actions">
          <Link to="/track-order" className="store-action store-track"><StoreIcon name="track" /><span>Track Order</span></Link>
          <Link to="/cart" className="store-action"><span className="relative"><StoreIcon name="cart" />{itemCount > 0 && <b className="store-cart-count">{itemCount}</b>}</span><span>Cart</span></Link>
          <Link to={customer ? "/account" : "/signin"} className="store-action"><StoreIcon name="account" /><span>{customer ? `Hi, ${customer.name.split(" ")[0]}` : "Hi, Guest"}</span></Link>
          <div className="relative store-more"><button className="store-action" onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen} aria-controls="store-more-menu"><StoreIcon name="more" /><span>More</span></button>{moreOpen && <div id="store-more-menu" className="store-more-menu"><Link to="/track-order" onClick={() => setMoreOpen(false)}>Track an order</Link><a href="#contact" onClick={() => setMoreOpen(false)}>Contact us</a><Link to="/signup" onClick={() => setMoreOpen(false)}>Create an account</Link></div>}</div>
        </nav>
      </div>
      <nav className="store-categories" aria-label="Gift categories"><Link to="/shop">All Gifts</Link><Link to="/shop?sort=popular">Bestsellers</Link><Link to="/shop?search=anniversary">Anniversary</Link>{categories.map((category) => <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`}>{category}<span aria-hidden="true">⌄</span></Link>)}<Link to="/shop">New Arrivals</Link></nav>
    </header>
  );
}
