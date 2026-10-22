const $ = s => document.querySelector(s);
const D = Store.get(); D.views = (D.views || 0) + 1; Store.set(D);
const { profile: p, contact: c } = D;
document.title = `${p.name} | ${p.role}`;
$('#fav').href = p.favicon;
$('#navPic').src = $('#heroPic').src = p.photo;
$('#navName').textContent = p.name; $('#chipName').textContent = p.name; $('#chipRole').textContent = p.role;
$('#badge').textContent = p.badge; $('#l1').textContent = p.line1; $('#l2').textContent = p.line2; $('#bio').textContent = p.bio;
const hi = 'Hi Milon, I want to start a website project.';
$('#heroWa').href = $('#ctaWa').href = waLink(D, hi);
$('#stats').innerHTML = D.stats.map(s => `<div><b data-n="${+s.v}" data-s="${esc(s.s)}">0${esc(s.s)}</b><span>${esc(s.l)}</span></div>`).join('');
$('#mq').innerHTML = [...D.tech, ...D.tech].map(t => `<span>${esc(t)}</span>`).join('');
$('#svc').innerHTML = D.services.map(s => `<article class="card"><div class="ic"><i class="${esc(s.icon)}"></i></div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><a class="text-link service-cta" href="#contact" data-service="${esc(s.title)}">Discuss this service <i class="fa-solid fa-arrow-right"></i></a></article>`).join('');
$('#cl').innerHTML =
  `<a href="mailto:${esc(c.email)}"><i class="fa-solid fa-envelope"></i>${esc(c.email)}</a>` +
  `<a href="tel:${esc(c.phone.replace(/[^+\d]/g, ''))}"><i class="fa-solid fa-phone"></i>${esc(c.phone)}</a>` +
  `<span class="contact-location"><i class="fa-solid fa-location-dot"></i>${esc(c.location)}</span>` +
  D.socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener"><i class="${esc(s.icon)}"></i>${esc(s.name)}</a>`).join('');
$('#foot').textContent = p.footer;

/* projects: exactly two buttons, Live View and Order Now */
const cats = ['All', ...new Set(D.projects.map(x => x.category))];
function drawProjects(cat = 'All') {
  $('#filters').innerHTML = cats.map(k => `<button class="fl ${k === cat ? 'on' : ''}" data-c="${esc(k)}">${esc(k)}</button>`).join('');
  $('#pg').innerHTML = D.projects.filter(x => cat === 'All' || x.category === cat).map((x, i) => `
   <article class="pc"><div class="pi"><img loading="lazy" decoding="async" src="${esc(x.img || '')}" alt="${esc(x.title)} screenshot"><span class="tag">${esc(x.category)}</span>${x.featured ? '<span class="featured-tag">FEATURED</span>' : ''}</div>
    <div class="pb"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><span class="tech">${esc(x.tech)}</span>
     <div class="pbtn"><a class="btn" href="${esc(x.live || '#contact')}" ${x.live ? 'target="_blank" rel="noopener noreferrer"' : ''}><i class="fa-solid fa-arrow-up-right-from-square"></i> ${x.live ? 'Live View' : 'Ask about project'}</a>
     <a class="btn p" href="${esc(waLink(D, x.msg || `Hi Milon, I want to discuss a project like: ${x.title}`))}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i> Start similar</a></div>
     ${(x.problem || x.features || x.caseStudy || x.gallery || x.github || x.outcome) ? `<button type="button" class="project-details" data-project="${esc(x.id)}">Explore case study <i class="fa-solid fa-arrow-right"></i></button>` : ''}</div></article>`).join('');
  tilt();
}
$('#filters').addEventListener('click', e => { const b = e.target.closest('.fl'); if (b) drawProjects(b.dataset.c); });
function tilt() {
  if (matchMedia('(hover:none)').matches) return;
  document.querySelectorAll('.pc').forEach(el => {
    el.onmousemove = e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`; };
    el.onmouseleave = () => el.style.transform = '';
  });
}
drawProjects();

// Project case-study dialog: content comes from the editable admin project records.
const detailDialog = document.createElement('dialog');
detailDialog.className = 'project-dialog';
detailDialog.setAttribute('aria-label', 'Project case study');
detailDialog.innerHTML = '<button class="dialog-close" type="button" aria-label="Close project details"><i class="fa-solid fa-xmark"></i></button><div class="dialog-content"></div>';
document.body.appendChild(detailDialog);
detailDialog.querySelector('.dialog-close').addEventListener('click', () => detailDialog.close());
detailDialog.addEventListener('click', e => { if (e.target === detailDialog) detailDialog.close(); });
$('#pg').addEventListener('click', e => {
  const trigger = e.target.closest('[data-project]'); if (!trigger) return;
  const project = D.projects.find(x => x.id === trigger.dataset.project); if (!project) return;
  const lines = value => String(value || '').split('\n').map(s => s.trim()).filter(Boolean);
  const gallery = lines(project.gallery).map((src, i) => `<img loading="lazy" src="${esc(src)}" alt="${esc(project.title)} screenshot ${i + 1}">`).join('');
  const features = lines(project.features).map(item => `<li>${esc(item)}</li>`).join('');
  detailDialog.querySelector('.dialog-content').innerHTML = `<p class="eyebrow">PROJECT CASE STUDY · ${esc(project.category || 'PROJECT')}</p><h2>${esc(project.title)}</h2><p class="dialog-lead">${esc(project.desc || '')}</p>${project.img ? `<img class="dialog-cover" src="${esc(project.img)}" alt="${esc(project.title)} project preview">` : ''}${project.problem ? `<h3>Goal & challenge</h3><p>${esc(project.problem)}</p>` : ''}${features ? `<h3>Key features</h3><ul>${features}</ul>` : ''}${project.tech ? `<h3>Technology stack</h3><p class="tech">${esc(project.tech)}</p>` : ''}${project.caseStudy ? `<h3>Implementation notes</h3><p>${esc(project.caseStudy)}</p>` : ''}${project.outcome ? `<h3>Outcome</h3><p>${esc(project.outcome)}</p>` : ''}${gallery ? `<h3>More screenshots</h3><div class="dialog-gallery">${gallery}</div>` : ''}<div class="dialog-actions">${project.live ? `<a class="btn" href="${esc(project.live)}" target="_blank" rel="noopener noreferrer">Live demo <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}${project.github ? `<a class="btn" href="${esc(project.github)}" target="_blank" rel="noopener noreferrer">Source code <i class="fa-brands fa-github"></i></a>` : ''}<a class="btn p" href="${esc(waLink(D, project.msg || `Hi Milon, I want to discuss a project like: ${project.title}`))}" target="_blank" rel="noopener noreferrer">Discuss a similar project</a></div>`;
  detailDialog.showModal();
});

/* motion: counters, reveal, scroll bar, cursor glow, mobile menu */
document.querySelectorAll('[data-n]').forEach(el => {
  const n = +el.dataset.n, s = el.dataset.s, t0 = performance.now();
  (function f(t) { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + s; if (k < 1) requestAnimationFrame(f); })(t0);
});
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));
addEventListener('scroll', () => $('#bar').style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%', { passive: true });
addEventListener('pointermove', e => { const g = $('#glow'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }, { passive: true });
const menu = $('#menu'), links = $('#links');
function closeMenu() { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation menu'); menu.innerHTML = '<i class="fa-solid fa-bars"></i>'; }
menu.onclick = () => { const opened = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(opened)); menu.setAttribute('aria-label', opened ? 'Close navigation menu' : 'Open navigation menu'); menu.innerHTML = `<i class="fa-solid ${opened ? 'fa-xmark' : 'fa-bars'}"></i>`; };
links.onclick = e => { if (e.target.closest('a')) closeMenu(); };
document.addEventListener('click', e => { const link = e.target.closest('[data-service]'); if (!link) return; const select = $('#inq-type'); const title = link.dataset.service.toLowerCase(); const match = title.includes('business') ? 'Business website' : title.includes('e-commerce') ? 'E-commerce store' : title.includes('full-stack') ? 'Full-stack web application' : title.includes('admin') ? 'Admin dashboard' : 'Other'; if (select) select.value = match; });
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// The form never pretends to submit to a server: it prepares a WhatsApp message for the visitor to review and send.
$('#inquiry').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    'Hi Milon, I would like to discuss a project.',
    '',
    `Name: ${data.get('name')}`,
    `Email: ${data.get('email')}`,
    `Project type: ${data.get('type')}`,
    `Estimated budget: ${data.get('budget')}`,
    `Timeline: ${data.get('timeline')}`,
    '',
    `Project details: ${data.get('details')}`
  ].join('\n');
  const url = waLink(D, message);
  $('#form-note').textContent = 'WhatsApp is opening with your draft. Review it there and press Send to contact me.';
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) location.href = url;
});

