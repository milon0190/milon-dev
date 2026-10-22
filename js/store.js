/* Shared data layer: index.html and admin.html read the same store */
const KEY = 'MILON_PRO_V6', SESSION = 'MILON_ADMIN_V6';
const DEFAULTS = {
  profile: {
    name: 'MD MILON MIA', role: 'Full-Stack Web Developer', badge: 'Open for new projects',
    line1: 'Business websites', line2: 'built to convert.',
    bio: 'I design and code fast, secure, mobile-first websites and web apps for businesses. Custom code only: React, Supabase and clean admin panels you can manage yourself.',
    photo: 'assets/milon.jpg', favicon: 'favicon.svg',
    footer: '© 2026 MD MILON MIA. All rights reserved.'
  },
  contact: { email: 'milon019065@gmail.com', phone: '+880 1606-643107', whatsapp: '8801606643107', location: 'Jamalpur, Bangladesh' },
  socials: [
    { id: 's1', name: 'GitHub', icon: 'fa-brands fa-github', url: 'https://github.com/milon0190' },
    { id: 's2', name: 'Facebook', icon: 'fa-brands fa-facebook-f', url: 'https://facebook.com/mdmilon0044' }
  ],
  stats: [{ v: 100, s: '%', l: 'Mobile friendly' }, { v: 24, s: '/7', l: 'Fast support' }, { v: 3, s: '+', l: 'Live projects' }],
  tech: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vite', 'Supabase', 'Node.js', 'SEO', 'GitHub', 'Vercel'],
  services: [
    { id: 'v1', icon: 'fa-solid fa-laptop-code', title: 'Custom business websites', desc: 'Hand-coded, fast and responsive sites that make your brand look established.' },
    { id: 'v2', icon: 'fa-solid fa-layer-group', title: 'Full-stack web apps', desc: 'React frontends with Supabase or Node backends, auth and databases included.' },
    { id: 'v3', icon: 'fa-solid fa-cart-shopping', title: 'E-commerce stores', desc: 'Product catalogs, carts and order flows built for local and global buyers.' },
    { id: 'v4', icon: 'fa-solid fa-sliders', title: 'Admin panels', desc: 'Manage content, orders and images yourself. No coding needed after delivery.' }
  ],
  projects: [
    { id: 'p1', title: 'OFFO Shop', category: 'E-commerce', tech: 'React, Vite, Supabase', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?fit=crop&w=900&q=80', desc: 'A full online store with product management, orders and a private admin dashboard.', live: 'https://offo.shop', msg: '' },
    { id: 'p2', title: 'Business Website', category: 'Business', tech: 'HTML, CSS, JavaScript', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?fit=crop&w=900&q=80', desc: 'A polished company website with services, portfolio and instant WhatsApp ordering.', live: 'http://www.milon.pro.bd', msg: '' },
    { id: 'p3', title: 'Admin Dashboard', category: 'Web App', tech: 'JavaScript, Charts', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?fit=crop&w=900&q=80', desc: 'A clean control panel with analytics, content editing and image management.', live: 'http://www.milon.pro.bd', msg: '' }
  ],
  admin: { user: 'admin', pass: 'milon2026' },
  views: 0
};
const Store = {
  get() { try { const r = localStorage.getItem(KEY); return r ? { ...structuredClone(DEFAULTS), ...JSON.parse(r) } : structuredClone(DEFAULTS); } catch { return structuredClone(DEFAULTS); } },
  set(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch { return false; } },
  reset() { try { localStorage.removeItem(KEY); } catch {} }
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = (d, t) => `https://wa.me/${String(d.contact.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(t)}`;
