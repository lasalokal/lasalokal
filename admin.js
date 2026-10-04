const SUPABASE_URL = 'https://oossngpylupjpwzytvxq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7RiW9-_SSEAejJXoTYypZQ_cvMZ7OTP';
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

function fmtDate(t) {
  return new Date(t).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderStats(events, orders) {
  const count = name => events.filter(e => e.event_name === name).length;
  const revenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const stats = [
    ['Page views', count('page_view')],
    ['Product views', count('product_view')],
    ['Add to cart', count('add_to_cart')],
    ['Orders completed', orders.length],
    ['Total revenue', '₱' + revenue.toLocaleString()],
  ];
  document.getElementById('statGrid').innerHTML = stats.map(([label, num]) =>
    `<div class="stat-box"><div class="stat-num">${num}</div><div class="stat-label">${label}</div></div>`
  ).join('');
}
function renderRanking(events) {
  const viewCounts = {};
  events.filter(e => e.event_name === 'product_view').forEach(e => {
    const n = (e.properties && (e.properties.name || e.properties.productId)) || 'Unknown';
    viewCounts[n] = (viewCounts[n] || 0) + 1;
  });
  const ranked = Object.entries(viewCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  document.getElementById('rankList').innerHTML = ranked.length
    ? ranked.map(([n, c]) => `<li><span>${n}</span><span>${c} views</span></li>`).join('')
    : '<li style="color:#9BA394;">No product views yet.</li>';
}
function renderOrders(orders) {
  const el = document.getElementById('ordersList');
  if (orders.length === 0) {
    el.innerHTML = '<p style="color:#9BA394; font-size:14px;">No orders yet.</p>';
    return;
  }
  el.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-top">
        <div>
          <strong>${o.order_code}</strong> · ${o.customer_name} · ${o.phone}
          <div style="font-size:12px; color:#B7A793; margin-top:2px;">${o.address}</div>
        </div>
        <div style="text-align:right;">
          <div class="order-total">₱${o.total}</div>
          <div style="font-size:12px; color:#B7A793;">${o.payment_method === 'cod' ? 'Cash on Delivery' : 'GCash'} · ${fmtDate(o.created_at)}</div>
        </div>
      </div>
      <div class="order-items">${(o.items || []).map(i => `${i.qty}× ${i.name}`).join(', ')}</div>
    </div>`).join('');
}

function renderLocations(events) {
  const locEvents = events.filter(e => e.event_name === 'location');
  const el = document.getElementById('locationsList');
  if (!el) return;
  if (locEvents.length === 0) {
    el.innerHTML = '<p style="color:#9BA394; font-size:14px;">No visitor locations recorded yet (visitor must allow location access).</p>';
    return;
  }
  el.innerHTML = locEvents.slice(0, 20).map(e => {
    const p = e.properties || {};
    const placeParts = [p.barangay, p.city, p.region, p.country].filter(Boolean);
    const place = placeParts.length ? placeParts.join(', ') : 'Unknown area';
    const hasCoords = typeof p.lat === 'number' && typeof p.lng === 'number';
    const mapsUrl = hasCoords ? `https://www.google.com/maps?q=${p.lat},${p.lng}` : null;
    return `<div class="location-card">
      <span class="place">📍 ${place}${mapsUrl ? ` <a href="${mapsUrl}" target="_blank" rel="noopener" style="color:var(--gold); font-size:12px; text-decoration:underline; margin-left:6px;">View exact spot on Google Maps</a>` : ''}</span>
      <span class="time">${fmtDate(e.created_at)}</span>
    </div>`;
  }).join('');
}

async function refresh() {
  if (!db) {
    document.getElementById('statGrid').innerHTML = '<p style="color:#e88;">Supabase not connected.</p>';
    return;
  }
  const [{ data: events, error: e1 }, { data: orders, error: e2 }] = await Promise.all([
    db.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(500),
    db.from('orders').select('*').order('created_at', { ascending: false }).limit(200),
  ]);
  if (e1) console.warn('events fetch error', e1.message);
  if (e2) console.warn('orders fetch error', e2.message);
  renderStats(events || [], orders || []);
  renderRanking(events || []);
  renderOrders(orders || []);
  renderLocations(events || []);
}

refresh();
setInterval(refresh, 8000);