// Simulated admin login
const adminLoginSection = document.getElementById('admin-login-section');
const adminControls = document.getElementById('admin-controls');
let admin = JSON.parse(localStorage.getItem('admin')) || null;
function renderAdminLogin() {
  if (admin) {
    adminLoginSection.innerHTML = `<p>Welcome, Admin! <button onclick="adminLogout()">Logout</button></p>`;
    adminControls.style.display = '';
    renderAdminControls();
  } else {
    adminLoginSection.innerHTML = `<form id="adminLoginForm">
      <input type="email" id="adminEmail" placeholder="Admin Email" required>
      <input type="password" id="adminPassword" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>`;
    adminControls.style.display = 'none';
    document.getElementById('adminLoginForm').onsubmit = function(e) {
      e.preventDefault();
      admin = { email: document.getElementById('adminEmail').value };
      localStorage.setItem('admin', JSON.stringify(admin));
      renderAdminLogin();
    };
  }
}
function adminLogout() {
  admin = null;
  localStorage.removeItem('admin');
  renderAdminLogin();
}
renderAdminLogin();

function renderAdminControls() {
  adminControls.innerHTML = `
    <h2>Manage Livestreams & Promos</h2>
    <form id="addAdvertForm">
      <input type="text" id="advertTitle" placeholder="Promo Title" required>
      <input type="text" id="advertImg" placeholder="Promo Image URL" required>
      <button type="submit">Add Promo</button>
    </form>
    <div id="admin-adverts"></div>
    <h2>Manage Videos</h2>
    <form id="addVideoForm">
      <input type="text" id="videoTitle" placeholder="Video Title" required>
      <input type="number" id="videoPrice" placeholder="Price" required>
      <input type="text" id="videoImg" placeholder="Video Image URL" required>
      <input type="text" id="videoYoutube" placeholder="YouTube ID or URL" required>
      <button type="submit">Add Video</button>
    </form>
    <div id="admin-videos"></div>
  `;
  // Adverts
  const adverts = JSON.parse(localStorage.getItem('adverts')) || [];
  document.getElementById('admin-adverts').innerHTML = adverts.map((a,i) => `<div class="card"><img src="${a.img}" alt="${a.title}"><input type="text" value="${a.title}" onchange="updateAdvertTitle(${i}, this.value)"><input type="text" value="${a.img}" onchange="updateAdvertImg(${i}, this.value)"><button onclick="deleteAdvert(${i})">Delete</button></div>`).join('');
  document.getElementById('addAdvertForm').onsubmit = function(e) {
    e.preventDefault();
    adverts.push({ title: document.getElementById('advertTitle').value, img: document.getElementById('advertImg').value });
    localStorage.setItem('adverts', JSON.stringify(adverts));
    renderAdminControls();
  };
  // Videos
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  document.getElementById('admin-videos').innerHTML = videos.map((v,i) => `<div class="card"><img src="${v.img}" alt="${v.title}"><input type="text" value="${v.title}" onchange="updateVideoTitle(${i}, this.value)"><input type="number" value="${v.price}" onchange="updateVideoPrice(${i}, this.value)"><input type="text" value="${v.img}" onchange="updateVideoImg(${i}, this.value)"><input type="text" value="${v.youtube}" onchange="updateVideoYoutube(${i}, this.value)"><button onclick="deleteVideo(${i})">Delete</button><button onclick="bypassPayment(${v.id})">Bypass Payment</button></div>`).join('');
  document.getElementById('addVideoForm').onsubmit = function(e) {
    e.preventDefault();
    videos.push({ id: Date.now(), title: document.getElementById('videoTitle').value, price: parseFloat(document.getElementById('videoPrice').value), img: document.getElementById('videoImg').value, youtube: document.getElementById('videoYoutube').value });
    localStorage.setItem('videos', JSON.stringify(videos));
    renderAdminControls();
  };
}
// Adverts controls
window.updateAdvertTitle = function(i, val) {
  const adverts = JSON.parse(localStorage.getItem('adverts')) || [];
  adverts[i].title = val;
  localStorage.setItem('adverts', JSON.stringify(adverts));
  renderAdminControls();
};
window.updateAdvertImg = function(i, val) {
  const adverts = JSON.parse(localStorage.getItem('adverts')) || [];
  adverts[i].img = val;
  localStorage.setItem('adverts', JSON.stringify(adverts));
  renderAdminControls();
};
window.deleteAdvert = function(i) {
  const adverts = JSON.parse(localStorage.getItem('adverts')) || [];
  adverts.splice(i,1);
  localStorage.setItem('adverts', JSON.stringify(adverts));
  renderAdminControls();
};
// Video controls
window.updateVideoTitle = function(i, val) {
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos[i].title = val;
  localStorage.setItem('videos', JSON.stringify(videos));
  renderAdminControls();
};
window.updateVideoPrice = function(i, val) {
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos[i].price = parseFloat(val);
  localStorage.setItem('videos', JSON.stringify(videos));
  renderAdminControls();
};
window.updateVideoImg = function(i, val) {
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos[i].img = val;
  localStorage.setItem('videos', JSON.stringify(videos));
  renderAdminControls();
};
window.updateVideoYoutube = function(i, val) {
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos[i].youtube = val;
  localStorage.setItem('videos', JSON.stringify(videos));
  renderAdminControls();
};
window.deleteVideo = function(i) {
  const videos = JSON.parse(localStorage.getItem('videos')) || [];
  videos.splice(i,1);
  localStorage.setItem('videos', JSON.stringify(videos));
  renderAdminControls();
};
window.bypassPayment = function(id) {
  let paid = JSON.parse(localStorage.getItem('paidVideos')) || [];
  if (!paid.includes(id)) {
    paid.push(id);
    localStorage.setItem('paidVideos', JSON.stringify(paid));
  }
  window.location.href = `video.html?id=${id}`;
};