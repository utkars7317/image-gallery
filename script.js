/* ============================================
   1. IMAGE DATA
   To use your own local images, just replace the
   src/full values below, e.g.:
   src: "images/image1.jpg", full: "images/image1.jpg"
============================================ */
const images = [
  { src: "https://picsum.photos/seed/misty/800/600.jpg",   full: "https://picsum.photos/seed/misty/1400/1000.jpg",   title: "Misty Mountain Peaks", category: "Nature" },
  { src: "https://picsum.photos/seed/forest/800/600.jpg",  full: "https://picsum.photos/seed/forest/1400/1000.jpg",  title: "Forest Light",         category: "Nature" },
  { src: "https://picsum.photos/seed/cliffs/800/600.jpg",  full: "https://picsum.photos/seed/cliffs/1400/1000.jpg",  title: "Ocean Cliffs",         category: "Nature" },
  { src: "https://picsum.photos/seed/dunes/800/600.jpg",   full: "https://picsum.photos/seed/dunes/1400/1000.jpg",   title: "Desert Dunes",         category: "Travel" },
  { src: "https://picsum.photos/seed/aurora/800/600.jpg",  full: "https://picsum.photos/seed/aurora/1400/1000.jpg",  title: "Northern Lights",      category: "Travel" },
  { src: "https://picsum.photos/seed/coastal/800/600.jpg", full: "https://picsum.photos/seed/coastal/1400/1000.jpg", title: "Coastal Town",         category: "Travel" },
  { src: "https://picsum.photos/seed/stag/800/600.jpg",    full: "https://picsum.photos/seed/stag/1400/1000.jpg",    title: "Wild Stag",            category: "Animals" },
  { src: "https://picsum.photos/seed/bird/800/600.jpg",    full: "https://picsum.photos/seed/bird/1400/1000.jpg",    title: "Bird in Flight",       category: "Animals" },
  { src: "https://picsum.photos/seed/facade/800/600.jpg",  full: "https://picsum.photos/seed/facade/1400/1000.jpg",  title: "Modern Facade",        category: "Architecture" },
  { src: "https://picsum.photos/seed/bridge/800/600.jpg",  full: "https://picsum.photos/seed/bridge/1400/1000.jpg",  title: "Old Bridge",           category: "Architecture" },
  { src: "https://picsum.photos/seed/coffee/800/600.jpg",  full: "https://picsum.photos/seed/coffee/1400/1000.jpg",  title: "Morning Coffee",       category: "Lifestyle" },
  { src: "https://picsum.photos/seed/city/800/600.jpg",    full: "https://picsum.photos/seed/city/1400/1000.jpg",    title: "City Nights",          category: "Lifestyle" },
];

/* ============================================
   2. STATE
============================================ */
let activeCategory = "All";
let searchTerm = "";
let filtered = images; // currently visible images (used by lightbox too)
let lightboxIndex = 0;

/* ============================================
   3. DOM REFERENCES
============================================ */
const grid = document.getElementById("grid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbTitle = document.getElementById("lbTitle");
const lbCategory = document.getElementById("lbCategory");
const lbCounter = document.getElementById("lbCounter");

/* ============================================
   4. RENDER GALLERY
   Rebuilds the grid from the filtered list.
   Each card gets a small stagger delay so they
   fade in one after another.
============================================ */
function renderGallery() {
  grid.innerHTML = "";

  filtered.forEach((item, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.animationDelay = `${i * 45}ms`;
    card.dataset.index = i; // position inside the filtered list

    card.innerHTML = `
      <div class="card-img">
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <div class="card-overlay">
          <span class="view-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            View Image
          </span>
        </div>
      </div>
      <div class="card-meta">
        <span class="card-category">${item.category}</span>
        <h3 class="card-title">${item.title}</h3>
      </div>
    `;

    grid.appendChild(card);
  });

  // Show / hide the "no results" message
  emptyState.hidden = filtered.length !== 0;
}

/* ============================================
   5. SEARCH + CATEGORY FILTER (work together)
============================================ */
function applyFilters() {
  filtered = images.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;

    const text = (item.title + " " + item.category).toLowerCase();
    const matchesSearch = text.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  renderGallery();
}

// Search input
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  applyFilters();
});

// Category buttons
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeCategory = btn.dataset.category;
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });
});

/* ============================================
   6. LIGHTBOX
   Open, close, navigate, and populate.
============================================ */
function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function updateLightbox() {
  const item = filtered[lightboxIndex];
  lbImage.src = item.full;
  lbImage.alt = item.title;
  lbTitle.textContent = item.title;
  lbCategory.textContent = item.category;
  lbCounter.textContent = `${lightboxIndex + 1} / ${filtered.length}`;
}

function showPrev() {
  lightboxIndex = (lightboxIndex - 1 + filtered.length) % filtered.length;
  updateLightbox();
}

function showNext() {
  lightboxIndex = (lightboxIndex + 1) % filtered.length;
  updateLightbox();
}

// Delegate card clicks to open lightbox
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  openLightbox(parseInt(card.dataset.index, 10));
});

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", showPrev);
document.getElementById("lbNext").addEventListener("click", showNext);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

/* ============================================
   7. SCROLL REVEAL
============================================ */
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ============================================
   8. HAMBURGER MENU
============================================ */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

/* ============================================
   9. INITIAL RENDER
============================================ */
renderGallery();