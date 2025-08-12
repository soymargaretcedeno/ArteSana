// Simple, editable team data
// Equipo (nombres, roles y rutas locales). Guarda las fotos en assets/team/ con estos nombres.
window.teamMembers = [
  { name: 'Angely Vargas', role: 'PPT, Código y Script', photo: 'fotos de nosotros/angely-vargas.jpg' },
  { name: 'Anais Abrego', role: 'PPT', photo: 'fotos de nosotros/anais-abrego.jpg' },
  { name: 'Margaret Cedeño', role: 'PPT', photo: 'fotos de nosotros/aleanys-gomez.jpg' },
  { name: 'Jesus Cano', role: 'Código', photo: 'fotos de nosotros/Jesus.png' },
  { name: 'Randol Aparicio', role: 'Código', photo: 'fotos de nosotros/randol-aparicio.jpg' },
  { name: 'Aleanys Gomez', role: 'PPT y Script', photo: 'fotos de nosotros/margaret-cedeno.jpg' },
  { name: 'Kachtlyen Mojica', role: 'PPT', photo: 'fotos de nosotros/keacktlin final.jpg' },
  { name: 'Ana Solis', role: 'Código', photo: 'fotos de nosotros/ana-solis.jpg' },
  { name: 'Noemi Pandales', role: 'PPT', photo: 'fotos de nosotros/noemi-pandales.jpg' },
];

function createTeamCard(member) {
  const src = encodeURI(member.photo);
  const altJpeg = encodeURI(member.photo.replace(/\.jpg$/i, '.jpeg'));
  const altJpg = encodeURI(member.photo.replace(/\.jpeg$/i, '.jpg'));
  const altPng = encodeURI(member.photo.replace(/\.(jpe?g)$/i, '.png'));
  const altDouble = encodeURI(member.photo.replace(/\.jpg$/i, '.jpg.jpeg'));
  return `
    <div class="team-card" data-member="${member.name}">
      <img class="team-avatar" src="${src}" alt="${member.name}"
        data-alt1="${altJpeg}"
        data-alt2="${altJpg}"
        data-alt3="${altPng}"
        data-alt4="${altDouble}"
        onerror="if(!this.dataset.tried1){this.dataset.tried1='1'; this.src=this.dataset.alt1;}
                 else if(!this.dataset.tried2){this.dataset.tried2='1'; this.src=this.dataset.alt2;}
                 else if(!this.dataset.tried3){this.dataset.tried3='1'; this.src=this.dataset.alt3;}
                 else if(!this.dataset.tried4){this.dataset.tried4='1'; this.src=this.dataset.alt4;}
                 else { this.onerror=null; this.src='assets/ArteSana_logo.png'; }">
      <h5 class="team-name">${member.name}</h5>
      <small class="team-role">${member.role
        .replace(/\bCódigo\b/g, (m)=> window.translations?.[localStorage.getItem('lang')||'es']?.role_code || m)
        .replace(/\bPPT\b/g, (m)=> window.translations?.[localStorage.getItem('lang')||'es']?.role_ppt || m)
        .replace(/\bScript\b/g, (m)=> window.translations?.[localStorage.getItem('lang')||'es']?.role_script || m)}</small>
    </div>`;
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function renderTeamCarousel(rootId = 'team-carousel-root') {
  const root = document.getElementById(rootId);
  if (!root) return;

  const members = window.teamMembers || [];
  const perSlide = 3; // 3 por slide en md+
  const slides = chunkArray(members, perSlide);

  const slideHtml = slides
    .map((group, slideIdx) => `
      <div class="carousel-item ${slideIdx === 0 ? 'active' : ''}">
        <div class="row g-4 justify-content-center">
          ${group
            .map(
              (m) => `
                <div class="col-10 col-sm-6 col-md-4 d-flex">
                  ${createTeamCard(m)}
                </div>`
            )
            .join('')}
        </div>
      </div>`)
    .join('');

  root.innerHTML = `
    <div id="teamCarouselDyn" class="carousel slide team-carousel" data-bs-ride="false" data-bs-interval="false" data-bs-pause="hover">
      <div class="carousel-inner">${slideHtml}</div>
      <button class="carousel-control-prev" type="button" data-bs-target="#teamCarouselDyn" data-bs-slide="prev">
        <span class="team-arrow" aria-hidden="true">‹</span>
        <span class="visually-hidden">${window.translations?.[localStorage.getItem('lang')||'es']?.team_previous || 'Anterior'}</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#teamCarouselDyn" data-bs-slide="next">
        <span class="team-arrow" aria-hidden="true">›</span>
        <span class="visually-hidden">${window.translations?.[localStorage.getItem('lang')||'es']?.team_next || 'Siguiente'}</span>
      </button>
    </div>`;

  // Animación sutil al mostrar tarjetas
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    },
    { threshold: 0.2 }
  );

  root.querySelectorAll('.team-card').forEach((card) => {
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String(Math.floor(Math.random() * 120) + 30));
    observer.observe(card);
  });

  // Re-render roles when language changes
  window.addEventListener('languageChanged', () => renderTeamCarousel(rootId), { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTeamCarousel();
});


