const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
let D = Store.get(), tab = 'dash';
const TABS = [['dash', 'fa-chart-pie', 'Dashboard'], ['prof', 'fa-user', 'Profile'], ['proj', 'fa-folder-open', 'Projects'], ['svc', 'fa-layer-group', 'Services'], ['set', 'fa-gear', 'Settings']];
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 2200); }
function save(m = 'Saved') { Store.set(D); if (!window.milonAuth.currentUser) return toast('Please log in again.'); MILON_FIREBASE_SAVE(D).then(() => toast(m + ' — published live')).catch(e => { console.error(e); toast('Save failed: check Firestore Rules / connection'); }); }

/* login */
$('#login').onsubmit = async e => { e.preventDefault(); const btn = $('#login').querySelector('button[type=submit],button:not([type])'); if (btn) btn.disabled = true; try { await milonAuth.signInWithEmailAndPassword($('#u').value.trim(), $('#pw').value); D = await MILON_FIREBASE_LOAD(); Store.set(D); boot(); } catch (err) { console.error(err); toast(err.code === 'auth/invalid-credential' ? 'Email or password is incorrect.' : 'Login failed. Check Firebase Authentication setup.'); } finally { if (btn) btn.disabled = false; } };
async function boot() {
  if (!milonAuth.currentUser) return;
  $('#auth').style.display = 'none'; $('#app').style.display = 'grid'; D = await MILON_FIREBASE_LOAD(); go(tab);
}
milonAuth.onAuthStateChanged(user => { if (user) boot(); });
function go(t) {
  tab = t;
  $('#side').innerHTML = `<div class="logo"><img src="${esc(D.profile.photo)}" alt=""><span>Admin</span></div>` +
    TABS.map(x => `<button class="tb ${x[0] === t ? 'on' : ''}" data-t="${x[0]}"><i class="fa-solid ${x[1]}"></i>${x[2]}</button>`).join('') +
    `<a class="tb out" href="index.html" target="_blank" style="margin-top:auto"><i class="fa-solid fa-arrow-up-right-from-square"></i><span>View site</span></a>` +
    `<button class="tb out" id="lo"><i class="fa-solid fa-right-from-bracket"></i><span>Log out</span></button>`;
  $$('.tb[data-t]').forEach(b => b.onclick = () => go(b.dataset.t));
  $('#lo').onclick = () => { milonAuth.signOut().then(() => location.reload()); };
  $('#ttl').textContent = TABS.find(x => x[0] === t)[2];
  ({ dash, prof, proj: () => list('projects', 'Add project', PF), svc: () => list('services', 'Add service', SF), set })[t]();
}

/* image upload: resized and compressed in the browser */
function pickImage(cb, max = 1100) { toast('For live image uploads, configure Cloudinary first. You can paste a hosted image URL in the field.'); const url = prompt('Paste a public image URL (for example, a Cloudinary image URL):'); if (url && /^https:\/\//i.test(url.trim())) cb(url.trim()); else if (url) toast('Please use a public HTTPS image URL.'); }
const fld = (l, id, v = '', type = 'text') => `<div class="fld"><label>${l}</label>${type === 'area' ? `<textarea id="${id}">${esc(v)}</textarea>` : `<input id="${id}" type="${type}" value="${esc(v)}">`}</div>`;
const imgFld = (l, id, v) => `<div class="fld"><label>${l}</label><div class="up"><img id="${id}-pv" src="${esc(v)}" alt=""><button type="button" class="btn sm" data-up="${id}"><i class="fa-solid fa-upload"></i> Upload</button></div><input id="${id}" value="${esc(v)}" placeholder="or paste an image URL"></div>`;
function wireUploads(root = document) { root.querySelectorAll('[data-up]').forEach(b => b.onclick = () => pickImage(u => { $('#' + b.dataset.up).value = u; $('#' + b.dataset.up + '-pv').src = u; }, b.dataset.up === 'f-favicon' ? 128 : 1100)); }
const val = id => $('#' + id).value.trim();

function dash() {
  $('#view').innerHTML = `<div class="met"><div><b>${D.views || 0}</b><span>Page views</span></div><div><b>${D.projects.length}</b><span>Projects</span></div><div><b>${D.services.length}</b><span>Services</span></div></div>
  <div class="pan"><h3>Quick actions</h3><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn p sm" onclick="go('proj')">Manage projects</button><button class="btn sm" onclick="go('prof')">Edit profile</button><a class="btn sm" href="index.html" target="_blank">Open live site</a></div></div>
  <div class="pan"><h3>Important: publishing and security</h3><p style="color:var(--mut);font-size:.92rem">Portfolio content is connected to Firebase Authentication and Cloud Firestore. Publish writes require the Firestore Rules to allow your admin UID. For screenshots, paste public HTTPS image URLs until Cloudinary upload is configured.</p></div>`;
}
function prof() {
  const p = D.profile, c = D.contact;
  $('#view').innerHTML = `<form id="pf"><div class="pan"><h3>Identity and images</h3><div class="cols"><div>${imgFld('Your photo', 'f-photo', p.photo)}</div><div>${imgFld('Favicon', 'f-favicon', p.favicon)}</div></div>
  <div class="cols">${fld('Name', 'f-name', p.name)}${fld('Role', 'f-role', p.role)}${fld('Status badge', 'f-badge', p.badge)}${fld('Headline line 1', 'f-l1', p.line1)}${fld('Headline line 2', 'f-l2', p.line2)}</div>
  ${fld('Short bio', 'f-bio', p.bio, 'area')}${fld('Footer text', 'f-foot', p.footer)}</div>
  <div class="pan"><h3>Contact (used by Order Now buttons)</h3><div class="cols">${fld('Email', 'c-email', c.email)}${fld('Phone', 'c-phone', c.phone)}${fld('WhatsApp number, digits only', 'c-wa', c.whatsapp)}${fld('Location', 'c-loc', c.location)}</div></div>
  <div class="pan"><h3>Social links</h3>${fld('One per line: Name | icon classes | URL', 'soc', D.socials.map(s => `${s.name} | ${s.icon} | ${s.url}`).join('\n'), 'area')}</div>
  <div class="pan"><h3>Tech strip and stats</h3>${fld('Tech names, comma separated', 'tech', D.tech.join(', '))}${fld('Stats, one per line: number | suffix | label', 'stats', D.stats.map(s => `${s.v} | ${s.s} | ${s.l}`).join('\n'), 'area')}</div>
  <button class="btn p">Save profile</button></form>`;
  wireUploads();
  $('#pf').onsubmit = e => { e.preventDefault();
    Object.assign(D.profile, { photo: val('f-photo'), favicon: val('f-favicon'), name: val('f-name'), role: val('f-role'), badge: val('f-badge'), line1: val('f-l1'), line2: val('f-l2'), bio: val('f-bio'), footer: val('f-foot') });
    Object.assign(D.contact, { email: val('c-email'), phone: val('c-phone'), whatsapp: val('c-wa'), location: val('c-loc') });
    D.socials = val('soc').split('\n').map(l => l.split('|').map(x => x.trim())).filter(a => a[2]).map((a, i) => ({ id: 's' + i, name: a[0], icon: a[1], url: a[2] }));
    D.tech = val('tech').split(',').map(x => x.trim()).filter(Boolean);
    D.stats = val('stats').split('\n').map(l => l.split('|').map(x => x.trim())).filter(a => a[0]).map(a => ({ v: +a[0] || 0, s: a[1] || '', l: a[2] || '' }));
    save('Profile saved'); };
}

/* generic list + modal editor for projects and services */
const PF = [['title', 'Project title'], ['category', 'Category (e.g. Business, E-commerce, Web App)'], ['img', 'Cover screenshot / project image', 'img'], ['gallery', 'Additional screenshot URLs, one per line', 'area'], ['desc', 'Short project description', 'area'], ['problem', 'Problem / project goal', 'area'], ['features', 'Key features, one per line', 'area'], ['tech', 'Technology stack'], ['live', 'Live demo URL', 'url'], ['github', 'Public source code URL (optional)', 'url'], ['caseStudy', 'Case study / implementation notes', 'area'], ['outcome', 'Verified outcome (optional; no invented metrics)', 'area'], ['msg', 'Order Now message (optional)', 'area']];
const SF = [['title', 'Title'], ['icon', 'Font Awesome icon classes, e.g. fa-solid fa-code'], ['desc', 'Description', 'area']];
function list(key, addLabel, fields) {
  const items = D[key];
  $('#view').innerHTML = `<button class="btn p sm" id="add" style="margin-bottom:18px"><i class="fa-solid fa-plus"></i> ${addLabel}</button>` +
    (items.length ? items.map((x, i) => `<div class="row">${x.img ? `<img src="${esc(x.img)}" alt="">` : `<i class="${esc(x.icon)}" style="font-size:1.4rem;width:44px;text-align:center"></i>`}<div class="t"><b>${esc(x.title)}</b><small>${esc(x.category || x.desc || '').slice(0, 70)}</small></div>
      <button class="btn sm" data-m="${i}" title="Move up"><i class="fa-solid fa-arrow-up"></i></button><button class="btn sm" data-e="${i}"><i class="fa-solid fa-pen"></i></button><button class="btn sm dg" data-d="${i}"><i class="fa-solid fa-trash"></i></button></div>`).join('') : '<p style="color:var(--mut)">Nothing here yet. Add your first item.</p>');
  $('#add').onclick = () => edit(key, fields, -1);
  $$('[data-e]').forEach(b => b.onclick = () => edit(key, fields, +b.dataset.e));
  $$('[data-m]').forEach(b => b.onclick = () => { const i = +b.dataset.m; if (i) { [items[i - 1], items[i]] = [items[i], items[i - 1]]; save('Order updated'); list(key, addLabel, fields); } });
  $$('[data-d]').forEach(b => b.onclick = () => { if (confirm('Delete this item?')) { items.splice(+b.dataset.d, 1); save('Deleted'); list(key, addLabel, fields); } });
}
function edit(key, fields, i) {
  const x = i < 0 ? {} : D[key][i];
  $('#mf').innerHTML = `<h2 style="margin-bottom:16px">${i < 0 ? 'Add' : 'Edit'} item</h2>` + fields.map(f => f[2] === 'img' ? imgFld(f[1], 'm-' + f[0], x[f[0]] || '') : fld(f[1], 'm-' + f[0], x[f[0]] || '', f[2] || 'text')).join('') +
    `<div style="display:flex;gap:10px"><button class="btn p">Save</button><button type="button" class="btn" id="cx">Cancel</button></div>`;
  $('#mod').classList.add('on'); wireUploads($('#mf'));
  if (key === 'projects' && $('#m-gallery')) {
    const galleryField = $('#m-gallery').closest('.fld');
    const upload = document.createElement('button'); upload.type = 'button'; upload.className = 'btn sm'; upload.style.marginTop = '8px'; upload.innerHTML = '<i class="fa-solid fa-images"></i> Upload extra screenshots';
    const note = document.createElement('small'); note.className = 'helper'; note.textContent = 'Paste public HTTPS image URLs for live publishing. Cloudinary upload integration can be added after you create a free Cloudinary account.';
    galleryField.append(upload, note);
    upload.onclick = () => {
      const picker = document.createElement('input'); picker.type = 'file'; picker.accept = 'image/*'; picker.multiple = true;
      picker.onchange = async () => {
        const files = [...(picker.files || [])].slice(0, 6); if (!files.length) return;
        const urls = [];
        for (const file of files) {
          const url = await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => { const image = new Image(); image.onload = () => { const scale = Math.min(1, 800 / image.width); const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height); resolve(canvas.toDataURL('image/jpeg', .65)); }; image.onerror = () => resolve(''); image.src = reader.result; }; reader.readAsDataURL(file); });
          if (url) urls.push(url);
        }
        const existing = val('m-gallery').split('\n').map(v => v.trim()).filter(Boolean);
        $('#m-gallery').value = [...existing, ...urls].join('\n'); toast('Screenshots added. Save the project to keep them.');
      };
      picker.click();
    };
  }
  $('#cx').onclick = () => $('#mod').classList.remove('on');
  $('#mf').onsubmit = e => { e.preventDefault(); const o = { id: x.id || key[0] + Date.now() }; fields.forEach(f => o[f[0]] = val('m-' + f[0]));
    if (i < 0) D[key].push(o); else D[key][i] = o; save(); $('#mod').classList.remove('on'); go(tab); };
}

function set() {
  $('#view').innerHTML = `<div class="pan"><h3>Admin account</h3><p style="color:var(--mut)">Admin login is managed securely by Firebase Authentication. Change your password through Firebase Console → Authentication → Users.</p></div>
  <div class="pan"><h3>Backup</h3><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn sm" id="ex"><i class="fa-solid fa-download"></i> Export backup</button><button class="btn sm" id="im"><i class="fa-solid fa-file-import"></i> Import backup</button><button class="btn sm dg" id="rs"><i class="fa-solid fa-rotate-left"></i> Reset to defaults</button></div></div>`;
  $('#ex').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' })); a.download = 'portfolio-backup.json'; a.click(); };
  $('#im').onclick = () => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.json'; i.onchange = () => { const r = new FileReader(); r.onload = () => { try { D = { ...D, ...JSON.parse(r.result) }; save('Imported'); go('dash'); } catch { toast('Invalid backup file'); } }; r.readAsText(i.files[0]); }; i.click(); };
  $('#rs').onclick = () => { if (confirm('Reset everything to defaults?')) { Store.reset(); D = Store.get(); toast('Reset done'); go('dash'); } };
}
boot();
