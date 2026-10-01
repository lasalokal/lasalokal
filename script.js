const SUPABASE_URL = 'https://oossngpylupjpwzytvxq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7RiW9-_SSEAejJXoTYypZQ_cvMZ7OTP';
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

function getSessionId(){
  let sid = localStorage.getItem('ll_session');
  if(!sid){ sid = crypto.randomUUID(); localStorage.setItem('ll_session', sid); }
  return sid;
}

const products = [
  // Ulam & Mains
  {id:'p1', name:'Chicken Adobo', cat:'Ulam & Mains', desc:'Slow-braised in soy, vinegar & garlic', price:185, image:'images/chicken-adobo.jpeg', serving:'Solo rice meal', tags:['Best seller','Rice meal']},
  {id:'p2', name:'Pork Humba', cat:'Ulam & Mains', desc:'Sweet-savory Visayan braised pork', price:210, image:'images/pork-humba.jpeg', serving:'Solo rice meal', tags:['Family favorite']},
  {id:'p3', name:'Chicken Inasal', cat:'Ulam & Mains', desc:'Char-grilled with annatto & calamansi', price:165, image:'images/chicken-inasal.jpeg', serving:'Solo rice meal', tags:['Grilled']},
  {id:'p4', name:'Filipino Fried Chicken', cat:'Ulam & Mains', desc:'Golden, crispy and juicy inside', price:150, image:'images/filipino-fried-chicken.jpeg', serving:'Solo rice meal', tags:['Crispy']},
  // Soups & Sabaw
  {id:'p5', name:'Nilagang Baboy', cat:'Soups & Sabaw', desc:'Comforting clear pork & vegetable soup', price:175, image:'images/nilagang-baboy.jpeg', serving:'Good for 1–2', tags:['Soup','Comfort food']},
  {id:'p6', name:'Sinigang na Baboy', cat:'Soups & Sabaw', desc:'Sour tamarind pork soup', price:195, image:'images/sinigang-na-baboy.jpeg', serving:'Good for 1–2', tags:['Soup','Sour']},
  {id:'p7', name:'Sinigang na Bangus', cat:'Soups & Sabaw', desc:'Tamarind milkfish sour soup', price:205, image:'images/sinigang-na-bangus.jpeg', serving:'Good for 1–2', tags:['Soup','Sour']},
  // Pancit & Noodles
  {id:'p8', name:'Pancit Palabok', cat:'Pancit & Noodles', desc:'Rice noodles in rich shrimp sauce', price:145, image:'images/pancit-palabok.jpeg', serving:'Regular plate', tags:['Noodles','Party tray']},
  {id:'p9', name:'Pancit Bihon', cat:'Pancit & Noodles', desc:'Stir-fried rice noodles & vegetables', price:130, image:'images/pancit-bihon.jpeg', serving:'Regular plate', tags:['Noodles','Party tray']},
  // Lumpia
  {id:'p10', name:'Fresh Lumpia', cat:'Lumpia', desc:'Cool, crunchy vegetable crepe rolls', price:150, image:'images/fresh-lumpia.jpg', serving:'4 rolls', tags:['Vegetarian','Light']},
  {id:'p11', name:'Pork Lumpia', cat:'Lumpia', desc:'Crispy golden pork spring rolls', price:160, image:'images/pork-lumpia.jpeg', serving:'8 pcs', tags:['Best seller','Party tray']},
  // Grilled & BBQ
  {id:'p12', name:'Lechon', cat:'Grilled & BBQ', desc:'Crispy-skinned roasted pork', price:320, image:'images/lechon.jpg', serving:'Per 1/4 kilo', tags:['Best seller','Party tray']},
  {id:'p14', name:'Grilled Boneless Bangus', cat:'Grilled & BBQ', desc:'Stuffed milkfish, charred & juicy', price:210, image:'images/grilled-boneless-bangus.jpeg', serving:'Solo rice meal', tags:['Grilled']},
  {id:'p15', name:'Pork Barbeque', cat:'Grilled & BBQ', desc:'Sweet-savory skewers, smoky edges', price:120, image:'images/pork-barbeque.jpeg', serving:'3 sticks', tags:['Grilled']},
  // Kakanin & Sweets
  {id:'p16', name:'Puto Kutsinta', cat:'Kakanin & Sweets', desc:'Steamed rice cakes with grated coconut', price:95, image:'images/puto-kutsinta.png', serving:'10 pcs', tags:['Kakanin','Sharing']},
  {id:'p17', name:'Bibingka', cat:'Kakanin & Sweets', desc:'Baked rice cake with salted egg & cheese', price:120, image:'images/bibingka.jpg', serving:'Whole', tags:['Kakanin','Baked']},
  {id:'p18', name:'Cassava Cake', cat:'Kakanin & Sweets', desc:'Creamy cassava with a custard top', price:155, image:'images/cassava-cake.jpg', serving:'Half loaf', tags:['Kakanin','Baked']},
  {id:'p19', name:'Suman', cat:'Kakanin & Sweets', desc:'Banana-leaf sticky rice rolls', price:100, image:'images/suman.jpg', serving:'5 pcs bundle', tags:['Kakanin']},
  // Drinks
  {id:'p21', name:'Buko Juice', cat:'Drinks', desc:'Fresh young coconut water', price:75, image:'images/buko-juice.jpg', serving:'Per glass', tags:['Chilled']},
  {id:'p22', name:'Calamansi Juice', cat:'Drinks', desc:'Zesty citrus, lightly sweetened', price:60, image:'images/calamansi-juice.jpg', serving:'Per glass', tags:['Chilled']},
  {id:'p24', name:'Softdrinks', cat:'Drinks', desc:'Ice-cold bottled soda', price:45, image:'images/softdrinks.jpg', serving:'Per bottle', tags:['Chilled']},
];
const partyTrays = [
  {id:'pt1', name:'Barkada Bilao', desc:'Pancit Bihon (medium), Pork Lumpia (20pcs), Chicken Inasal (4pcs), Rice (6 cups)', price:899, image:'images/barkada-bilao.png', serving:'Good for 5–8', blurb:'The easiest way to feed a small group of friends without touching a stove.', tags:['Most ordered']},
  {id:'pt2', name:'Pamilya Fiesta Tray', desc:'Chicken Adobo tray, Pancit Palabok (large), Pork Lumpia (40pcs), Rice (12 cups)', price:1899, image:'images/pamilya-fiesta-tray.png', serving:'Good for 10–12', blurb:'A complete family handaan spread with the classics everyone asks for.', tags:['Best value']},
  {id:'pt3', name:'Handaan Grande', desc:'Pork Humba tray, Pancit Bihon (extra large), Pork Lumpia (80pcs), Chicken Inasal (15pcs), Kakanin sampler', price:3499, image:'images/handaan-grande.png', serving:'Good for 20–25', blurb:'Built for birthdays, fiestas, reunions and office parties that go all day.', tags:['Events & handaan']},
];
const categories = ['All', ...new Set(products.map(p=>p.cat))];
let activeCat = 'All';
let cart = {}; // id -> qty

function findItem(id){
  return products.find(x=>x.id===id) || partyTrays.find(x=>x.id===id);
}

/* ---- Analytics ---- */
function track(name, props={}){
  if(db){
    db.from('analytics_events').insert({
      session_id: getSessionId(),
      event_name: name,
      properties: props,
      page: window.location.pathname
    }).then(({error})=>{ if(error) console.warn('track error', error.message); });
  } else {
    try{
      const events = JSON.parse(localStorage.getItem('ll_events')||'[]');
      events.push({name, props, t: Date.now()});
      localStorage.setItem('ll_events', JSON.stringify(events));
    }catch(e){console.warn('analytics error', e);}
  }
}

/* ---- Render menu ---- */
function renderFilters(){
  const el = document.getElementById('filters');
  el.innerHTML = categories.map(c =>
    `<button class="filter-btn ${c===activeCat?'active':''}" onclick="setCat('${c}')">${c}</button>`
  ).join('');
}
function setCat(c){
  activeCat = c;
  track('category_click',{category:c});
  renderFilters();
  renderGrid();
}
function renderGrid(){
  const list = activeCat==='All' ? products : products.filter(p=>p.cat===activeCat);
  document.getElementById('productGrid').innerHTML = list.map(p => `
    <div class="card" onclick="viewProduct('${p.id}')">
      <div class="card-img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
      <div class="card-body">
        <div class="card-cat">${p.cat}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-tags">
          <span class="tag serving">${p.serving}</span>
          ${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="card-foot">
          <span class="price">₱${p.price}</span>
          <button class="add-btn" onclick="event.stopPropagation(); addToCart('${p.id}')">Add</button>
        </div>
      </div>
    </div>`).join('');
}
function viewProduct(id){
  const p = findItem(id);
  track('product_view', {productId:id, name:p.name});
}

function renderPartyTrays(){
  document.getElementById('partyGrid').innerHTML = partyTrays.map(p => `
    <div class="card party-card">
      <div class="card-img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
      <div class="card-body">
        <div class="card-cat">${p.serving}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc" style="min-height:auto;">${p.blurb}</div>
        <ul class="tray-contents">${p.desc.split(', ').map(i=>`<li>${i}</li>`).join('')}</ul>
        <div class="card-tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="card-foot">
          <span class="price">₱${p.price}</span>
          <button class="add-btn" onclick="addToCart('${p.id}')">Reserve</button>
        </div>
      </div>
    </div>`).join('');
}

/* ---- Cart ---- */
function addToCart(id){
  cart[id] = (cart[id]||0)+1;
  const p = findItem(id);
  track('add_to_cart', {productId:id, name:p.name, price:p.price});
  updateCartCount();
}
function removeFromCart(id){
  delete cart[id];
  track('remove_from_cart', {productId:id});
  updateCartCount();
  renderCartDrawer();
}
function changeQty(id, delta){
  cart[id] = Math.max(0, (cart[id]||0)+delta);
  if(cart[id]===0) delete cart[id];
  updateCartCount();
  renderCartDrawer();
}
function updateCartCount(){
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  document.getElementById('cartCount').textContent = count;
}
function cartTotal(){
  return Object.entries(cart).reduce((sum,[id,qty])=>{
    const p = findItem(id);
    return sum + p.price*qty;
  },0);
}
function openCart(){
  renderCartDrawer();
  document.getElementById('overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
}
function closeDrawer(){
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
}
function renderCartDrawer(){
  document.getElementById('drawerTitle').textContent = 'Your Cart';
  const entries = Object.entries(cart);
  const body = document.getElementById('drawerBody');
  if(entries.length===0){
    body.innerHTML = '<div class="empty-msg">Your cart is empty.</div>';
  } else {
    body.innerHTML = entries.map(([id,qty])=>{
      const p = findItem(id);
      return `<div class="cart-item">
        <div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">₱${p.price} × ${qty}</div>
        </div>
        <div class="qty-ctrl">
          <button onclick="changeQty('${id}',-1)">−</button>
          <span>${qty}</span>
          <button onclick="changeQty('${id}',1)">+</button>
        </div>
      </div>`;
    }).join('');
  }
  const foot = document.getElementById('drawerFoot');
  if(entries.length===0){
    foot.innerHTML = '';
  } else {
    foot.innerHTML = `
      <div class="total-row"><span>Total</span><span>₱${cartTotal()}</span></div>
      <button class="btn btn-gold" style="width:100%;" onclick="startCheckout()">Checkout</button>`;
  }
}
function startCheckout(){
  track('checkout_started', {items:Object.keys(cart).length, total:cartTotal()});
  document.getElementById('drawerTitle').textContent = 'Checkout';
  document.getElementById('drawerBody').innerHTML = `
    <button class="back-link" onclick="renderCartDrawer()">← Back to cart</button>
    <div class="field"><label>Full name</label><input id="ckName" placeholder="Juan Dela Cruz"></div>
    <div class="field"><label>Phone number</label><input id="ckPhone" placeholder="09XX XXX XXXX"></div>
    <div class="field"><label>Delivery address</label><textarea id="ckAddress" rows="2" placeholder="Barangay, street, Ormoc City"></textarea></div>
    <label>Payment method</label>
    <div class="pay-options">
      <div class="pay-opt active" id="payCod" onclick="selectPay('cod')">Cash on Delivery</div>
      <div class="pay-opt" id="payGcash" onclick="selectPay('gcash')">GCash</div>
    </div>
  `;
  document.getElementById('drawerFoot').innerHTML = `
    <div class="total-row"><span>Total</span><span>₱${cartTotal()}</span></div>
    <button class="btn btn-gold" style="width:100%;" onclick="submitOrder()">Confirm order</button>`;
}
let selectedPay = 'cod';
function selectPay(method){
  selectedPay = method;
  document.getElementById('payCod').classList.toggle('active', method==='cod');
  document.getElementById('payGcash').classList.toggle('active', method==='gcash');
}
function submitOrder(){
  const name = document.getElementById('ckName').value.trim();
  const phone = document.getElementById('ckPhone').value.trim();
  const address = document.getElementById('ckAddress').value.trim();
  if(!name || !phone || !address){
    alert('Please fill in all delivery details.');
    return;
  }
  const orderId = 'LL-' + Math.floor(Math.random()*90000+10000);
  const orderItems = Object.entries(cart).map(([id,qty])=>{
    const p = findItem(id);
    return {name:p.name, qty, price:p.price};
  });
  if(db){
    db.from('orders').insert({
      order_code: orderId,
      customer_name: name,
      phone: phone,
      address: address,
      payment_method: selectedPay,
      items: orderItems,
      total: cartTotal(),
      status: 'new'
    }).then(({error})=>{ if(error) console.warn('order save error', error.message); });
  } else {
    try{
      const orders = JSON.parse(localStorage.getItem('ll_orders')||'[]');
      orders.push({orderId, name, phone, address, pay:selectedPay, items:orderItems, total:cartTotal(), status:'new', t:Date.now()});
      localStorage.setItem('ll_orders', JSON.stringify(orders));
    }catch(e){console.warn('order save error', e);}
  }
  track('order_completed', {orderId, total: cartTotal(), items: Object.keys(cart).length, pay: selectedPay});
  document.getElementById('drawerTitle').textContent = 'Order confirmed';
  document.getElementById('drawerBody').innerHTML = `
    <div class="confirm-box">
      <div class="big">✅</div>
      <h3 style="margin-bottom:8px;">Thank you, ${name}!</h3>
      <p style="color:var(--muted); font-size:14px;">Order #${orderId} received. Total: ₱${cartTotal()} · ${selectedPay==='cod'?'Cash on Delivery':'GCash'}.<br>We'll contact you at ${phone} to confirm delivery.</p>
    </div>`;
  document.getElementById('drawerFoot').innerHTML = `<button class="btn btn-gold" style="width:100%;" onclick="closeDrawer()">Close</button>`;
  cart = {};
  updateCartCount();
}

/* ---- Mobile nav ---- */
function toggleMobileNav(){
  document.getElementById('mobileNav').classList.toggle('open');
}
function closeMobileNav(){
  document.getElementById('mobileNav').classList.remove('open');
}

function trackPageView(){
  const key = 'll_pv_' + window.location.pathname;
  if(!sessionStorage.getItem(key)){
    sessionStorage.setItem(key, '1');
    track('page_view', {page: window.location.pathname});
  }
}

/* ---- Init ---- */
renderFilters();
renderGrid();
renderPartyTrays();
trackPageView();