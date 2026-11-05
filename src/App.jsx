import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Html, OrbitControls } from "@react-three/drei";
import { ArrowDown, ArrowRight, ArrowUpRight, Heart, Menu, Minus, Plus, ShoppingBag, X } from "lucide-react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: "01", name: "Aero Runner", category: "Footwear", price: 189, tone: "#d7d2c8", tag: "BESTSELLER", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=85" },
  { id: "02", name: "Studio Form", category: "Footwear", price: 220, tone: "#c6c0b5", tag: "NEW", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=85" },
  { id: "03", name: "Cloud Object", category: "Accessories", price: 96, tone: "#d5d0c7", tag: "LIMITED", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=85" },
  { id: "04", name: "Everyday Carry", category: "Accessories", price: 145, tone: "#b9b1a5", tag: "POPULAR", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85" }
];

function Sneaker() {
  const group = useRef();
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.035, 0.03);
    }
  });
  return <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
    <group ref={group} rotation={[0.05, -0.35, -0.12]} scale={1.15}>
      <mesh castShadow position={[0, 0, 0]}><capsuleGeometry args={[0.48, 1.5, 8, 20]} /><meshStandardMaterial color="#e7e2d8" roughness={0.42} /></mesh>
      <mesh castShadow position={[0, -0.39, 0.02]} scale={[1.02, 0.16, 1.02]}><capsuleGeometry args={[0.48, 1.5, 8, 20]} /><meshStandardMaterial color="#282725" roughness={0.7} /></mesh>
      <mesh castShadow position={[0, 0.34, 0.18]} rotation={[0, 0, 0.15]} scale={[0.5, 0.24, 0.12]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#b7a18b" roughness={0.55} /></mesh>
      {[0,1,2,3].map((v)=><mesh key={v} position={[-0.18 + v*0.12, 0.24-v*0.08, 0.47]} rotation={[0,0,-0.28]}><boxGeometry args={[0.42,0.025,0.025]} /><meshStandardMaterial color="#8d8173" /></mesh>)}
      <mesh position={[0,0.05,-0.43]} rotation={[0,0,Math.PI/2]}><torusGeometry args={[0.22,0.045,8,32,Math.PI]} /><meshStandardMaterial color="#b6a18b" /></mesh>
    </group>
  </Float>;
}

function HeroScene({ progress }) {
  const scene = useRef();
  useFrame(() => { if (scene.current) { scene.current.rotation.y = progress * 1.05; scene.current.position.y = -progress * 0.28; } });
  return <Canvas shadows dpr={[1,1.6]} camera={{ position: [3.6, 2.2, 5.2], fov: 36 }}>
    <ambientLight intensity={1.25} />
    <directionalLight position={[4,6,5]} intensity={2.2} castShadow />
    <group ref={scene}><Sneaker /></group>
    <ContactShadows position={[0,-1.25,0]} opacity={0.35} scale={5} blur={2.5} far={3} />
    <Environment preset="studio" />
    <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
  </Canvas>;
}

export default function App() {
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem("forme-cart-v1") || "[]"); } catch { return []; } });
  const [liked, setLiked] = useState(() => { try { return JSON.parse(localStorage.getItem("forme-wishlist-v1") || "[]"); } catch { return []; } });
  const [drawer, setDrawer] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const count = cart.reduce((n, item) => n + item.qty, 0);
  const total = cart.reduce((n, item) => n + item.price * item.qty, 0);

  useEffect(() => { localStorage.setItem("forme-cart-v1", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("forme-wishlist-v1", JSON.stringify(liked)); }, [liked]);
  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => setProgress(self.progress),
      });
      gsap.fromTo(".hero-copy > *", { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, stagger: 0.11, ease: "power3.out", delay: 0.15,
        clearProps: "transform",
      });
      gsap.utils.toArray(".product-card").forEach((card, index) => {
        gsap.fromTo(card, { y: 38, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.75, ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
          delay: (index % 2) * 0.08,
        });
      });
      gsap.fromTo(".story-image img", { scale: 1.12 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: ".story", start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.fromTo(".story-copy", { x: 36, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".story", start: "top 72%", once: true },
      });
      gsap.fromTo(".journal-row > *", { y: 25, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out",
        scrollTrigger: { trigger: ".journal", start: "top 78%", once: true },
      });
    });
    return () => { ctx.revert(); mm.revert(); ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); };
  }, []);
  useEffect(() => { if (!notice) return; const id = setTimeout(() => setNotice(""), 2200); return () => clearTimeout(id); }, [notice]);

  const add = (p) => { setCart(old => { const found = old.find(x => x.id === p.id); return found ? old.map(x => x.id === p.id ? {...x, qty:x.qty+1} : x) : [...old, {...p, qty:1}]; }); setNotice(p.name + " added to bag"); };
  const changeQty = (id, delta) => setCart(old => old.map(x => x.id === id ? {...x, qty:x.qty+delta} : x).filter(x => x.qty > 0));
  const toggleLike = (id) => setLiked(old => old.includes(id) ? old.filter(x=>x!==id) : [...old,id]);

  return <main>
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
      <a className="brand" href="#home">FORME<span>®</span></a>
      <nav className={menuOpen?"nav-links open":"nav-links"}><a href="#collection" onClick={()=>setMenuOpen(false)}>Collection</a><a href="#story" onClick={()=>setMenuOpen(false)}>Our approach</a><a href="#journal" onClick={()=>setMenuOpen(false)}>Journal</a></nav>
      <button className="bag-button" onClick={()=>setDrawer(true)}><span>Bag</span><span className="bag-count">{count}</span></button>
    </header>

    <section className="hero" id="home">
      <div className="hero-copy"><p className="eyebrow"><i/> OBJECTS IN MOTION — VOL. 01</p><h1>Made to<br/><em>move</em> you.</h1><p className="hero-sub">Thoughtful objects. Considered form.<br/>A new perspective on everyday essentials.</p><a className="round-link" href="#collection">Explore collection <ArrowUpRight size={17}/></a></div>
      <div className="hero-visual"><div className="model-label">FORME / 001<br/><span>THE AERO RUNNER</span></div><HeroScene progress={progress}/><div className="model-caption">SCROLL TO EXPLORE <ArrowDown size={13}/></div></div>
      <div className="hero-index">01 — 04</div>
    </section>

    <section className="ticker" aria-label="Store values"><div>DESIGNED WITH INTENTION <b>✳</b> BUILT FOR EVERY DAY <b>✳</b> LESS, BUT BETTER <b>✳</b> DESIGNED WITH INTENTION <b>✳</b></div></section>

    <section className="collection section-wrap" id="collection">
      <div className="section-heading"><div><p className="eyebrow">THE EDIT / 001</p><h2>Objects worth<br/><em>keeping.</em></h2></div><p className="section-note">A small collection of considered<br/>essentials, made to go further.</p></div>
      <div className="product-grid">{products.map((p,i)=><article className="product-card" key={p.id}>
        <div className="product-image" style={{backgroundColor:p.tone}}><img src={p.image} alt={p.name} loading="lazy"/><span className="product-tag">{p.tag}</span><button className={"like-btn "+(liked.includes(p.id)?"liked":"")} onClick={()=>toggleLike(p.id)} aria-label={"Wishlist "+p.name}><Heart size={17} fill={liked.includes(p.id)?"currentColor":"none"}/></button><button className="quick-add" onClick={()=>add(p)}>Add to bag <Plus size={15}/></button></div>
        <div className="product-info"><div><p>{p.category} / 0{i+1}</p><h3>{p.name}</h3></div><strong>${p.price}</strong></div>
      </article>)}</div>
      <div className="collection-foot"><span>SHOWING 04 / 04 OBJECTS</span><a href="#story">Discover our approach <ArrowRight size={15}/></a></div>
    </section>

    <section className="story" id="story"><div className="story-image"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85" alt="Minimal studio wardrobe and materials" loading="lazy"/><span>FORM FOLLOWS FEELING — 2026</span></div><div className="story-copy"><p className="eyebrow">A DIFFERENT POINT OF VIEW</p><h2>Less noise.<br/><em>More meaning.</em></h2><p>We believe the things you live with should earn their place. Every detail has a reason. Every object has room to breathe.</p><a className="text-link" href="#journal">Read our philosophy <ArrowUpRight size={16}/></a></div></section>

    <section className="journal section-wrap" id="journal"><p className="eyebrow">NOTES FROM THE STUDIO</p><div className="journal-row"><h2>Good design<br/>is a daily ritual.</h2><p>Explore the details, materials and ideas behind the collection.</p><a className="circle-arrow" href="#home" aria-label="Back to top"><ArrowUpRight/></a></div></section>

    <footer><a className="brand" href="#home">FORME<span>®</span></a><span>CONSIDERED OBJECTS. CONSCIOUS LIVING.</span><span>© 2026 FORME STUDIO</span></footer>

    {drawer && <div className="drawer-layer" onMouseDown={e=>{if(e.target===e.currentTarget)setDrawer(false);}}><aside className="cart-drawer"><div className="drawer-head"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag <small>({count})</small></h2></div><button className="icon-btn" onClick={()=>setDrawer(false)} aria-label="Close bag"><X/></button></div>
      {cart.length===0?<div className="empty-bag"><ShoppingBag size={30}/><h3>Your bag is waiting.</h3><p>Find something worth keeping.</p><button className="dark-btn" onClick={()=>setDrawer(false)}>Explore collection</button></div>:<><div className="cart-lines">{cart.map(item=><div className="cart-line" key={item.id}><img src={item.image} alt=""/><div className="cart-line-info"><h3>{item.name}</h3><p>${item.price}</p><div className="qty"><button onClick={()=>changeQty(item.id,-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.qty}</span><button onClick={()=>changeQty(item.id,1)} aria-label="Increase quantity"><Plus size={13}/></button></div></div><strong>${item.price*item.qty}</strong></div>)}</div><div className="cart-bottom"><div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="dark-btn" onClick={()=>setNotice("Demo checkout — no payment is processed.")}>Continue to checkout <ArrowRight size={16}/></button><small>Demo storefront · no real payment is taken</small></div></>}
    </aside></div>}
    {notice && <div className="toast" role="status">{notice}</div>}
  </main>;
}