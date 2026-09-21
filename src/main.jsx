import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import {getProducts} from './lib/store';

const cats=[['◉','Smart Watches'],['◒','Air pods'],['◉','Headphones'],['◌','Vlogging'],['▣','Gaming'],['⚡','Chargers'],['⌘','Computer Accessories'],['✦','Gadgets']];
const money=n=>`Rs ${n.toLocaleString('en-PK',{minimumFractionDigits:2})}`;

function App(){
 const [search,setSearch]=useState(''),[cat,setCat]=useState('All'),[cart,setCart]=useState([]),[wish,setWish]=useState([]),[menu,setMenu]=useState(false),[quick,setQuick]=useState(null),[notice,setNotice]=useState('');
 const [dbProducts,setDbProducts]=useState([]);
const [loading,setLoading]=useState(true);
const [dbError,setDbError]=useState('');

useEffect(()=>{
  getProducts()
    .then(data=>{
      const mapped=data.map(p=>({
        id:p.id,
        name:p.name,
        price:Number(p.price),
        cat:p.categories?.name || 'Gadgets',
        img:p.image_url,
        hot:p.is_featured
      }));
      setDbProducts(mapped);
    })
    .catch(error=>{
      console.error('Supabase products error:',error);
      setDbError(error.message);
    })
    .finally(()=>setLoading(false));
},[]);
 const activeProducts=dbProducts;
const filtered=useMemo(()=>activeProducts.filter(p=>(cat==='All'||p.cat===cat)&&p.name.toLowerCase().includes(search.toLowerCase())),[activeProducts,cat,search]);
 const add=p=>{setCart(c=>[...c,p]);setNotice(`${p.name} added to cart`);setTimeout(()=>setNotice(''),1800)};
 const toggleWish=id=>setWish(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
 const total=cart.reduce((s,p)=>s+p.price,0);
 return <div>
 {notice&&<div className="toast">✓ {notice}</div>}
 <div className="topbar"><span>Premium gadgets. Better everyday technology.</span><span>Fast delivery across Pakistan · <b>+92 321 3232000</b></span></div>
 <header><div className="nav container">
   <button className="hamb" onClick={()=>setMenu(!menu)}>☰</button><a className="logo" href="#home"><span>RCM</span><small>MULTIMEDIA</small></a>
   <nav className={menu?'open':''}><a href="#home">Home</a><a href="#shop">Shop</a><a href="#categories">Categories</a><a href="#deals">Deals</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
   <div className="actions"><div className="search"><span>⌕</span><input value={search} onChange={e=>{setSearch(e.target.value);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}} placeholder="Search products..."/></div><button title="Wishlist" className="icon" onClick={()=>setNotice(`${wish.length} item${wish.length===1?'':'s'} in wishlist`)}>♡<i>{wish.length}</i></button><button title="Cart" className="icon" onClick={()=>document.getElementById('cart')?.classList.add('show')}>🛒<i>{cart.length}</i></button></div>
 </div></header>
 <main id="home">
  <section className="hero"><div className="hero-inner container"><div className="hero-copy"><span className="eyebrow">RCM MULTIMEDIA · LAHORE</span><h1>Technology<br/><em>upgraded.</em></h1><p>Discover smart wearables, immersive audio, creator gear and everyday tech — selected to keep you connected.</p><div className="hero-buttons"><a href="#shop" className="btn primary">Shop the collection <span>→</span></a><a href="#categories" className="btn ghost">Explore categories</a></div><div className="hero-meta"><span>✓ Curated products</span><span>✓ Nationwide delivery</span><span>✓ Easy support</span></div></div><div className="hero-art"><div className="orb"></div><img src={dbProducts[0]?.img} alt="RCM smartwatch"/><div className="floating"><small>FEATURED</small><b>{dbProducts[0]?.name || "Loading..."}</b><span>{dbProducts[0] ? money(dbProducts[0].price) : ""}</span></div></div></div></section>
  <section id="categories" className="section container"><div className="section-head"><div><span className="eyebrow">SHOP BY CATEGORY</span><h2>Find your next <em>upgrade.</em></h2></div><a href="#shop">View all →</a></div><div className="cat-grid">{cats.map(([ico,c])=><button key={c} onClick={()=>{setCat(c);document.getElementById('shop').scrollIntoView({behavior:'smooth'})}}><span>{ico}</span><b>{c}</b><small>Explore →</small></button>)}</div></section>
  <section id="deals" className="deal"><div className="container deal-inner"><div><span className="eyebrow">LIMITED-TIME PICKS</span><h2>Smart tech.<br/><em>Smart prices.</em></h2><p>Upgrade your setup with standout gadgets from the RCM collection.</p><a className="btn light" href="#shop">Shop deals →</a></div><div className="deal-products">{activeProducts.slice(1,4).map(p=><Product key={p.id} p={p} add={add} wish={wish} toggleWish={toggleWish} compact/>)}</div></div></section>
  <section id="shop" className="section container"><div className="section-head"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Trending <em>technology.</em></h2></div><div className="chips"><button className={cat==='All'?'active':''} onClick={()=>setCat('All')}>All</button>{['Smart Watches','Air pods','Headphones','Vlogging'].map(c=><button className={cat===c?'active':''} key={c} onClick={()=>setCat(c)}>{c}</button>)}</div></div><div className="products">{filtered.map(p=><Product key={p.id} p={p} add={add} wish={wish} toggleWish={toggleWish} setQuick={setQuick}/>)}</div>{!filtered.length&&<div className="empty">No products match “{search}”.</div>}</section>
  <section id="about" className="about"><div className="container about-grid"><div><span className="eyebrow">THE RCM STANDARD</span><h2>More than gadgets.<br/><em>Better experiences.</em></h2></div><div><p>RCM Multimedia brings together practical technology, personal audio, smart wearables, gaming accessories and creator essentials under one modern shopping experience.</p><p>From our Lahore base, we serve customers across Pakistan with a product-first approach and straightforward support.</p><a href="#contact" className="text-link">Talk to RCM →</a></div></div></section>
  <section className="newsletter"><div className="container newsletter-inner"><div><span className="eyebrow">STAY IN THE LOOP</span><h2>New tech, fresh deals.</h2></div><form onSubmit={e=>{e.preventDefault();setNotice('Thanks — you are on the RCM list.')}}><input type="email" required placeholder="Your email address"/><button className="btn primary">Subscribe →</button></form></div></section>
 </main>
 <footer id="contact"><div className="container footer-grid"><div><a className="logo footer-logo" href="#home"><span>RCM</span><small>MULTIMEDIA</small></a><p>Modern technology and everyday gadgets, curated for Pakistan.</p></div><div><h4>Explore</h4><a href="#shop">Shop</a><a href="#categories">Categories</a><a href="#deals">Deals</a><a href="#about">About us</a></div><div><h4>Support</h4><a href="#contact">Contact us</a><a href="#">Track order</a><a href="#">Shipping policy</a><a href="#">Returns</a></div><div><h4>Contact</h4><p>+92 321 3232000</p><p>contact@rcmmultimedia.com</p><p>Usama Center, Hall Road<br/>Lahore, Pakistan</p></div></div><div className="copyright container"><span>© 2026 RCM Multimedia. All rights reserved.</span><span>Designed for a premium shopping experience.</span></div></footer>
 {quick&&<div className="modal-back" onClick={()=>setQuick(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setQuick(null)}>×</button><img src={quick.img}/><div><span className="eyebrow">QUICK VIEW</span><h2>{quick.name}</h2><p className="price">{money(quick.price)}</p><p>Quality-selected tech from the RCM Multimedia collection.</p><button className="btn primary" onClick={()=>{add(quick);setQuick(null)}}>Add to cart →</button></div></div></div>}
 <aside id="cart" className="cart"><div className="cart-head"><h2>Your cart</h2><button onClick={()=>document.getElementById('cart').classList.remove('show')}>×</button></div>{cart.length?<><div className="cart-items">{cart.map((p,i)=><div className="cart-item" key={i}><img src={p.img}/><div><b>{p.name}</b><span>{money(p.price)}</span></div></div>)}</div><div className="cart-total"><span>Total</span><b>{money(total)}</b></div><button className="btn primary wide" onClick={()=>setNotice('Checkout demo ready — connect your payment/order backend.')}>Proceed to checkout →</button></>:<div className="empty-cart"><span>🛒</span><h3>Your cart is empty</h3><p>Add something you love.</p></div>}</aside><div className="overlay" onClick={()=>document.getElementById('cart').classList.remove('show')}></div>
 </div>
}
function Product({p,add,wish,toggleWish,setQuick,compact}){return <article className={'product '+(compact?'compact':'')}><div className="product-img"><img src={p.img} alt={p.name}/>{p.hot&&<span className="badge">HOT</span>}<button className={'wish '+(wish.includes(p.id)?'liked':'')} onClick={()=>toggleWish(p.id)}>♡</button>{!compact&&setQuick&&<button className="quick" onClick={()=>setQuick(p)}>Quick view</button>}</div><div className="product-info"><span className="category">{p.cat}</span><h3>{p.name}</h3><div className="rating">★★★★★ <small>New</small></div><div className="product-bottom"><strong>{money(p.price)}</strong><button onClick={()=>add(p)}>+ Add</button></div></div></article>}
createRoot(document.getElementById('root')).render(<App/>);
