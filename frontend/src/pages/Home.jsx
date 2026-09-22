import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import ProductCard from "../components/ProductCard.jsx";
import { StoreIcon } from "../components/Navbar.jsx";
import logo from "../assets/logo.png";

const campaigns = [
  { eyebrow: "A LITTLE PERSONAL. A LOT OF LOVE.", title: "Make it", accent: "theirs.", description: "Their name. Your memories. A gift like no other.", cta: "Explore personalised gifts", to: "/shop" },
  { eyebrow: "FOR YOUR FAVOURITE PERSON", title: "Celebrate", accent: "your story.", description: "Turn the moments you share into keepsakes to treasure.", cta: "Shop anniversary gifts", to: "/shop?search=anniversary" },
  { eyebrow: "SMALL DETAILS. BIG FEELINGS.", title: "A little", accent: "extra special.", description: "Thoughtful pieces, made personal for the ones you love.", cta: "Discover engraved gifts", to: "/shop?search=engraved" },
];
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [slide, setSlide] = useState(0);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    api.get("/products", { params: { limit: 12 } })
      .then(({ data }) => { if (active) setProducts(data.products); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]);
  const photo = (pattern) => products.find((p) => pattern.test(p.name))?.images?.[0] || products[0]?.images?.[0] || logo;
  const shortcuts = [
    { label: "Bestsellers", detail: "Loved for a reason", image: photo(/mug/i), to: "/shop?sort=popular" },
    { label: "New Arrivals", detail: "Fresh little finds", image: photo(/calendar/i), to: "/shop" },
    { label: "Photo Gifts", detail: "Keep a memory close", image: photo(/frame/i), to: "/shop?search=photo" },
    { label: "All Gifts", detail: "Something for everyone", image: photo(/gift box/i), to: "/shop" },
  ];
  const campaign = campaigns[slide];
  const featured = products.filter((p) => p.isFeatured);
  const categories = [...new Set(products.map((p) => p.category))];
  return (
    <div className="store-home font-body">
      <section className="store-showcase" aria-label="Discover gifts">
        <div className="gift-shortcuts">{shortcuts.map((item) => <Link to={item.to} key={item.label} className="gift-shortcut"><div className="shortcut-photo"><img src={item.image} alt="" /></div><h2>{item.label}</h2><p>{item.detail}</p></Link>)}</div>
        <div className={`gift-banner gift-banner-${slide}`}>
          <div className="banner-art" aria-hidden="true"><span className="banner-orbit" /><div className="banner-photo banner-photo-back"><img src={photo(/calendar/i)} alt="" /><span>Your everyday favourite</span></div><div className="banner-photo banner-photo-front"><img src={photo(/frame/i)} alt="" /><span>Made for your memories ♡</span></div><span className="banner-note">made with<br /><i>love</i></span><span className="banner-sparkle">✧</span></div>
          <div className="banner-copy" aria-live="polite"><p className="banner-eyebrow">{campaign.eyebrow}</p><h1>{campaign.title}<em>{campaign.accent}</em></h1><p className="banner-description">{campaign.description}</p><Link to={campaign.to} className="banner-cta">{campaign.cta}<span aria-hidden="true">→</span></Link></div>
          <div className="banner-controls"><button onClick={() => setSlide((slide + campaigns.length - 1) % campaigns.length)} aria-label="Previous collection">←</button><div className="banner-dots">{campaigns.map((item, index) => <button key={item.title} aria-label={`Show collection ${index + 1}: ${item.title} ${item.accent}`} aria-pressed={slide === index} onClick={() => setSlide(index)} />)}</div><button onClick={() => setSlide((slide + 1) % campaigns.length)} aria-label="Next collection">→</button></div>
        </div>
      </section>
      <div className="store-benefits"><span><StoreIcon name="gift" />Personalised with love</span><span><StoreIcon name="track" />Track your order</span><span><StoreIcon name="account" />Your account. Your memories.</span></div>
      {categories.length > 0 && <section className="store-products" aria-labelledby="categories-heading">
        <div className="store-section-heading"><div><p>FIND THEIR KIND OF SPECIAL</p><h2 id="categories-heading">Personalised Gifts</h2></div><Link to="/shop">Explore all <span aria-hidden="true">→</span></Link></div>
        <div className="store-category-grid">{categories.map((category) => <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`}><div><img src={products.find((p) => p.category === category)?.images?.[0] || logo} alt="" loading="lazy" /></div><h3>{category}</h3></Link>)}</div>
      </section>}
      <section className="store-products" aria-labelledby="personalised-heading">
        <div className="store-section-heading"><div><p>SOMETHING ONLY YOU COULD GIVE</p><h2 id="personalised-heading">Gifts in the spotlight</h2></div><Link to="/shop">View all gifts <span aria-hidden="true">→</span></Link></div>
        {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-5" role="status" aria-label="Loading gifts">{[1, 2, 3, 4].map((n) => <div key={n} className="aspect-square rounded-2xl bg-surface animate-pulse" />)}</div> : error ? <div className="store-empty"><p>We couldn't load the gifts right now.</p><button onClick={() => setReload(reload + 1)}>Try again</button></div> : products.length === 0 ? <p className="store-empty">New gifts are on their way. Check back soon.</p> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">{(featured.length ? featured : products).slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}</div>}
      </section>
      <section className="store-occasion"><div><p>IT'S THE THOUGHT THAT STAYS.</p><h2>For every name.<br />For every little occasion.</h2></div><Link to="/shop">Find their next favourite gift <span aria-hidden="true">→</span></Link></section>
    </div>
  );
}
