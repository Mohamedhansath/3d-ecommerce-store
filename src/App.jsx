import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Heart, Menu, Minus, Plus, ShoppingBag, X } from "lucide-react";
import HeroScene from "./HeroScene.jsx";

const products = [
  { id: "01", name: "Aero Runner", category: "Footwear", price: 189, tone: "#d7dcd3", tag: "THE EVERYDAY PAIR", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85" },
  { id: "02", name: "Studio Form", category: "Footwear", price: 220, tone: "#d5d4cc", tag: "A CLEANER CLASSIC", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=85" },
  { id: "03", name: "Cloud Object", category: "Accessories", price: 96, tone: "#d8d9d1", tag: "SMALL, WELL MADE", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=85" },
  { id: "04", name: "Everyday Carry", category: "Accessories", price: 145, tone: "#c9cec5", tag: "MADE TO GO ALONG", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85" }
];

const readStorage = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [cart, setCart] = useState(() => readStorage("forme-cart-v1", []));
  const [liked, setLiked] = useState(() => readStorage("forme-wishlist-v1", []));
  const [drawer, setDrawer] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const count = cart.reduce((n, item) => n + item.qty, 0);
  const total = cart.reduce((n, item) => n + item.price * item.qty, 0);

  useEffect(() => {
    try { localStorage.setItem("forme-cart-v1", JSON.stringify(cart)); } catch { setNotice("Your bag could not be saved on this device."); }
  }, [cart]);
  useEffect(() => {
    try { localStorage.setItem("forme-wishlist-v1", JSON.stringify(liked)); } catch { setNotice("Your saved pieces could not be stored."); }
  }, [liked]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = document.querySelector(".hero");
        if (!hero) return;
        const range = Math.max(1, hero.offsetHeight);
        setProgress(Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / range)));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(""), 2600);
    return () => clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    if (!drawer) return;
    const previous = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setDrawer(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [drawer]);

  const add = (product) => {
    setCart((old) => {
      const found = old.find((item) => item.id === product.id);
      return found
        ? old.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        : [...old, { ...product, qty: 1 }];
    });
    setNotice(product.name + " is in your bag.");
  };
  const changeQty = (id, delta) => setCart((old) =>
    old.map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0)
  );
  const toggleLike = (id) => setLiked((old) => old.includes(id) ? old.filter((item) => item !== id) : [...old, id]);

  return <main id="main-content">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
      <a className="brand" href="#home" aria-label="FORME home">FORME<span>®</span></a>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Main navigation">
        <a href="#collection" onClick={() => setMenuOpen(false)}>The collection</a>
        <a href="#story" onClick={() => setMenuOpen(false)}>Our point of view</a>
        <a href="#journal" onClick={() => setMenuOpen(false)}>Field notes</a>
      </nav>
      <button className="bag-button" onClick={() => setDrawer(true)} aria-label={`Open shopping bag, ${count} items`}><span>Bag</span><span className="bag-count">{count}</span></button>
    </header>

    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><i/> A MORE CONSIDERED EVERYDAY</p>
        <h1 id="hero-title">Good things.<br/><em>Well formed.</em></h1>
        <p className="hero-sub">Footwear and everyday objects, chosen for how they feel, work and wear over time.</p>
        <a className="round-link" href="#collection">Explore the edit <ArrowUpRight size={17}/></a>
      </div>
      <div className="hero-visual" aria-label="Interactive three-dimensional Aero Runner sneaker">
        <div className="model-label">OBJECT / 001<br/><span>THE AERO RUNNER</span></div>
        <HeroScene progress={progress}/>
        <div className="model-caption"><span>TURN THE FORM</span><ArrowDown size={13}/></div>
        <span className="model-index">01 / 04</span>
      </div>
      <div className="hero-index">THE FORME EDITION — 001</div>
    </section>

    <section className="ticker" aria-label="FORME principles"><div>MADE FOR THE EVERYDAY <b>✳</b> LESS, BUT BETTER <b>✳</b> FORM WITH PURPOSE <b>✳</b> MADE FOR THE EVERYDAY <b>✳</b></div></section>

    <section className="collection section-wrap" id="collection">
      <div className="section-heading">
        <div><p className="eyebrow">THE COLLECTION / 001</p><h2>Keep what<br/><em>works.</em></h2></div>
        <p className="section-note">A focused edit of useful forms.<br/>No excess. Nothing to prove.</p>
      </div>
      <div className="product-grid">{products.map((product, index) => <article className="product-card" key={product.id}>
        <div className="product-image" style={{ backgroundColor: product.tone }}>
          <img src={product.image} alt={product.name} loading="lazy" width="900" height="1100"/>
          <span className="product-tag">{product.tag}</span>
          <button className={"like-btn " + (liked.includes(product.id) ? "liked" : "")} onClick={() => toggleLike(product.id)} aria-label={(liked.includes(product.id) ? "Remove " : "Save ") + product.name + (liked.includes(product.id) ? " from saved pieces" : " to saved pieces")} aria-pressed={liked.includes(product.id)}><Heart size={17} fill={liked.includes(product.id) ? "currentColor" : "none"}/></button>
          <button className="quick-add" onClick={() => add(product)}>Add to bag <Plus size={15}/></button>
        </div>
        <div className="product-info"><div><p>{product.category.toUpperCase()} / 0{index + 1}</p><h3>{product.name}</h3></div><strong>${product.price}</strong></div>
      </article>)}</div>
      <div className="collection-foot"><span>FOUR OBJECTS. ONE POINT OF VIEW.</span><a href="#story">Why we choose carefully <ArrowRight size={15}/></a></div>
    </section>

    <section className="story" id="story">
      <div className="story-image"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85" alt="Quietly composed wardrobe and material details" loading="lazy" width="1200" height="1000"/><span>THE FORME APPROACH / 01</span></div>
      <div className="story-copy"><p className="eyebrow">A QUIETER KIND OF DESIGN</p><h2>Less to think<br/><em>about.</em></h2><p>Good design earns its place quietly. A useful shape. A considered detail. An object that feels right in the rhythm of your day.</p><a className="text-link" href="#journal">Read the FORME notes <ArrowUpRight size={16}/></a></div>
    </section>

    <section className="journal section-wrap" id="journal"><p className="eyebrow">NOTES ON EVERYDAY FORM</p><div className="journal-row"><h2>Notice the<br/>little things.</h2><p>Materials, movement and the small decisions that make an object worth keeping.</p><a className="circle-arrow" href="#home" aria-label="Return to the top"><ArrowUpRight/></a></div></section>

    <footer><a className="brand" href="#home">FORME<span>®</span></a><span>OBJECTS WITH A CLEAR POINT OF VIEW.</span><span>© 2026 FORME STUDIO</span></footer>

    {drawer && <div className="drawer-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawer(false); }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2 id="bag-title">The bag <small>({count})</small></h2></div><button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close shopping bag"><X/></button></div>
        {cart.length === 0 ? <div className="empty-bag"><ShoppingBag size={30}/><h3>A little room for something good.</h3><p>Your considered edit starts here.</p><button className="dark-btn" onClick={() => setDrawer(false)}>Browse the collection</button></div> : <>
          <div className="cart-lines">{cart.map((item) => <div className="cart-line" key={item.id}><img src={item.image} alt=""/><div className="cart-line-info"><h3>{item.name}</h3><p>${item.price}</p><div className="qty"><button onClick={() => changeQty(item.id, -1)} aria-label={"Remove one " + item.name}><Minus size={13}/></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)} aria-label={"Add one " + item.name}><Plus size={13}/></button></div></div><strong>${item.price * item.qty}</strong></div>)}</div>
          <div className="cart-bottom"><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><p>Delivery and taxes are not included.</p><button className="dark-btn" onClick={() => setNotice("Checkout is a preview. No payment has been taken.")}>Continue to checkout <ArrowRight size={16}/></button><small>Preview store · checkout is not active</small></div>
        </>}
      </aside>
    </div>}
    {notice && <div className="toast" role="status" aria-live="polite">{notice}</div>}
  </main>;
}