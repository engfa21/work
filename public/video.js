// Get video id from URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));
let user = JSON.parse(localStorage.getItem('user')) || null;
let admin = JSON.parse(localStorage.getItem('admin')) || null;
let paid = JSON.parse(localStorage.getItem('paidVideos')) || [];
const videos = JSON.parse(localStorage.getItem('videos')) || [];
const video = videos.find(v => v.id === id);
const videoPlayer = document.getElementById('video-player');
if (!video) {
  videoPlayer.innerHTML = '<p>Video not found.</p>';
} else if (!user && !admin) {
  videoPlayer.innerHTML = '<p>Please login to view this video.</p>';
} else if (!paid.includes(id) && !admin) {
  videoPlayer.innerHTML = '<p>You have not paid for this video.</p>';
} else {
  let youtubeId = video.youtube;
  if (youtubeId.includes('youtube.com')) {
    const url = new URL(youtubeId);
    youtubeId = url.searchParams.get('v');
  }
  videoPlayer.innerHTML = `<h1>${video.title}</h1><iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allowfullscreen></iframe>`;
}
// Comments
const commentList = document.getElementById('comment-list');
const commentForm = document.getElementById('comment-form');
let comments = JSON.parse(localStorage.getItem('comments_'+id)) || [];
function renderComments() {
  commentList.innerHTML = comments.map(c => `<li><strong>${c.user}:</strong> ${c.text}</li>`).join('');
}
commentForm.onsubmit = function(e) {
  e.preventDefault();
  if (!user && !admin) { alert('Please login to comment.'); return; }
  const text = document.getElementById('comment-input').value;
  if (text.trim()) {
    comments.push({ user: (user ? user.email : 'Admin'), text });
    localStorage.setItem('comments_'+id, JSON.stringify(comments));
    document.getElementById('comment-input').value = '';
    renderComments();
  }
};
renderComments();