// script.js — Mengejar Deadline

/* ── Mock blog data ── */
const blogPosts = [
  {
    title: "5 Mitos & Fakta Seputar Desain yang Sering Salah Dipahami",
    slug: "mitos-fakta-design",
    featuredImage: "assets/blog-mitos-fakta.png",
    category: "Design",
    excerpt: "Yang sering kamu dengar belum tentu yang pasti benar. Dari soal font, revisi, sampai inspirasi — kita luruskan satu per satu.",
    author: "Mengejar Deadline",
    date: "7 Okt 2026"
  }
];

/* ── Blog preview injection ── */
document.addEventListener('DOMContentLoaded', () => {
  const blogGrid = document.querySelector('#blog-preview .blog-grid');
  if (blogGrid) {
    const post = blogPosts[0];
    // Build one large featured card
    const card = document.createElement('a');
    card.href = `blog/${post.slug}.html`;
    card.className = 'glass-card blog-featured-card';
    card.innerHTML = `
      <div class="bfc-img">
        <img src="${post.featuredImage}" alt="${post.title}" onerror="this.style.display='none'" />
      </div>
      <div class="bfc-body">
        <p class="label-tag">${post.category}</p>
        <h3>${post.title}</h3>
        <p class="bfc-excerpt">${post.excerpt}</p>
        <p class="blog-meta">${post.date} · ${post.author}</p>
        <span class="btn-outline bfc-btn">Baca Artikel →</span>
      </div>
    `;
    blogGrid.appendChild(card);
  }


  /* ── Mobile nav toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobileNav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      toggle.innerHTML = mobileNav.classList.contains('open') ? '✕' : '☰';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        toggle.innerHTML = '☰';
      });
    });
  }

  /* ── Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
});
