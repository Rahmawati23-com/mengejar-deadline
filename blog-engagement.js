// blog-engagement.js - Interactive Views, Likes, and Comments for Mengejar Deadline Blog

(function() {
  window.initBlogEngagement = function(config) {
    const slug = config.slug || 'default-post';
    const initialViews = config.initialViews || 128;
    const initialLikes = config.initialLikes || 34;
    const initialComments = config.initialComments || [];

    // Keys for LocalStorage
    const KEY_VIEWS = `md_blog_views_${slug}`;
    const KEY_LIKES = `md_blog_likes_${slug}`;
    const KEY_USER_LIKED = `md_blog_user_liked_${slug}`;
    const KEY_COMMENTS = `md_blog_comments_${slug}`;

    // --- 1. VIEWS HANDLING ---
    let currentViews = parseInt(localStorage.getItem(KEY_VIEWS), 10);
    if (isNaN(currentViews)) {
      currentViews = initialViews;
    }
    // Increment view count for current session/page load
    currentViews += 1;
    localStorage.setItem(KEY_VIEWS, currentViews);

    // Update View Count UI
    const viewEl = document.getElementById('viewCount');
    if (viewEl) {
      viewEl.textContent = currentViews.toLocaleString('id-ID');
    }

    // --- 2. LIKES HANDLING ---
    let currentLikes = parseInt(localStorage.getItem(KEY_LIKES), 10);
    if (isNaN(currentLikes)) {
      currentLikes = initialLikes;
    }
    let isLiked = localStorage.getItem(KEY_USER_LIKED) === 'true';

    const likeBtn = document.getElementById('likeBtn');
    const likeCountEl = document.getElementById('likeCount');

    function updateLikeUI() {
      if (likeCountEl) {
        likeCountEl.textContent = currentLikes.toLocaleString('id-ID');
      }
      if (likeBtn) {
        if (isLiked) {
          likeBtn.classList.add('liked');
          likeBtn.querySelector('svg').setAttribute('fill', '#EF4444');
          likeBtn.querySelector('svg').setAttribute('stroke', '#EF4444');
        } else {
          likeBtn.classList.remove('liked');
          likeBtn.querySelector('svg').setAttribute('fill', 'none');
          likeBtn.querySelector('svg').setAttribute('stroke', 'currentColor');
        }
      }
    }

    if (likeBtn) {
      updateLikeUI();
      likeBtn.addEventListener('click', function() {
        if (isLiked) {
          currentLikes = Math.max(0, currentLikes - 1);
          isLiked = false;
        } else {
          currentLikes += 1;
          isLiked = true;
        }
        localStorage.setItem(KEY_LIKES, currentLikes);
        localStorage.setItem(KEY_USER_LIKED, isLiked ? 'true' : 'false');
        updateLikeUI();
      });
    }

    // --- 3. COMMENTS HANDLING ---
    let savedComments = [];
    try {
      savedComments = JSON.parse(localStorage.getItem(KEY_COMMENTS)) || [];
    } catch(e) {
      savedComments = [];
    }

    // Combine initial demo comments with saved user comments
    const allComments = [...initialComments, ...savedComments];

    const commentCountEl = document.getElementById('commentCount');
    const commentsListEl = document.getElementById('commentsList');
    const commentForm = document.getElementById('commentForm');

    function renderComments() {
      if (commentCountEl) {
        commentCountEl.textContent = allComments.length;
      }
      if (!commentsListEl) return;

      if (allComments.length === 0) {
        commentsListEl.innerHTML = `
          <div class="glass-card" style="padding: 1.5rem; text-align: center; color: var(--gray-3); font-size: 0.88rem;">
            Belum ada komentar. Jadilah yang pertama memberikan tanggapan!
          </div>
        `;
        return;
      }

      commentsListEl.innerHTML = allComments.map(c => `
        <div class="comment-card">
          <div class="comment-header">
            <span class="comment-author">${escapeHTML(c.author)}</span>
            <span class="comment-date">${escapeHTML(c.date)}</span>
          </div>
          <p class="comment-text">${escapeHTML(c.text)}</p>
        </div>
      `).join('');
    }

    function escapeHTML(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    renderComments();

    if (commentForm) {
      commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const authorInput = document.getElementById('commentAuthor');
        const textInput = document.getElementById('commentText');

        const author = authorInput ? authorInput.value.trim() : '';
        const text = textInput ? textInput.value.trim() : '';

        if (!author || !text) return;

        const now = new Date();
        const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        const newComment = { author, text, date: dateStr };

        // Save to user comments
        savedComments.push(newComment);
        localStorage.setItem(KEY_COMMENTS, JSON.stringify(savedComments));

        // Add to active list & re-render
        allComments.push(newComment);
        renderComments();

        // Reset form
        commentForm.reset();
      });
    }
  };
})();

