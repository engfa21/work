// Simulated login
const loginSection = document.getElementById('login-section');
let user = JSON.parse(localStorage.getItem('user')) || null;
function renderLogin() {
  if (user) {
    loginSection.innerHTML = `<p>Welcome, ${user.email}! <button onclick="logout()">Logout</button></p>`;
  } else {
    loginSection.innerHTML = `<form id="loginForm">
      <input type="email" id="email" placeholder="Email" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>`;
    document.getElementById('loginForm').onsubmit = function(e) {
      e.preventDefault();
      user = { email: document.getElementById('email').value };
      localStorage.setItem('user', JSON.stringify(user));
      renderLogin();
      renderVideos();
    };
  }
}
function logout() {
  user = null;
  localStorage.removeItem('user');
  renderLogin();
  renderVideos();
}
renderLogin();

// Adverts
function getAdverts() {
  return JSON.parse(localStorage.getItem('adverts')) || [
    { id: 1, title: 'Live Concert', img: 'https://via.placeholder.com/300x150/FF5722/FFFFFF?text=Live+Concert' },
    { id: 2, title: 'Upcoming Show', img: 'https://via.placeholder.com/300x150/1976d2/FFFFFF?text=Upcoming+Show' }
  ];
}
function renderAdverts() {
  const adverts = getAdverts();
  document.getElementById('adverts').innerHTML = adverts.map(a => `<div class="card"><img src="${a.img}" alt="${a.title}"><div class="card-title">${a.title}</div></div>`).join('');
}
renderAdverts();

// Videos
function getVideos() {
  return JSON.parse(localStorage.getItem('videos')) || [
    { id: 1, title: 'Summer Beats', price: 9.99, img: 'https://via.placeholder.com/300x150/FF5722/FFFFFF?text=Summer+Beats', youtube: 'dQw4w9WgXcQ' },
    { id: 2, title: 'Winter Jam', price: 7.99, img: 'https://via.placeholder.com/300x150/1976d2/FFFFFF?text=Winter+Jam', youtube: 'eY52Zsg-KVI' }
  ];
}
function getPaidVideos() {
  return JSON.parse(localStorage.getItem('paidVideos')) || [];
}
function payForVideo(id) {
  if (!user) { alert('Please login first!'); return; }
  let paid = getPaidVideos();
  if (!paid.includes(id)) {
    paid.push(id);
    localStorage.setItem('paidVideos', JSON.stringify(paid));
  }
  window.location.href = `video.html?id=${id}`;
}
function renderVideos() {
  const videos = getVideos();
  const paid = getPaidVideos();
  document.getElementById('video-cards').innerHTML = videos.map(v => `<div class="card"><img src="${v.img}" alt="${v.title}"><div class="card-title">${v.title}</div><div class="card-price">$${v.price}</div><button onclick="payForVideo(${v.id})">${paid.includes(v.id) ? 'Watch Again' : 'Pay to Watch'}</button></div>`).join('');
}
renderVideos();