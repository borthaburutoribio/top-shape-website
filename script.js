// Menú mobile
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  const close = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// Compartir
const share = document.getElementById('share');
if (share) {
  const label = share.innerHTML;
  share.addEventListener('click', async () => {
    try {
      if (navigator.share) { await navigator.share({ title: document.title, url: location.href }); return; }
      await navigator.clipboard.writeText(location.href);
      share.textContent = 'Link copiado';
      setTimeout(() => { share.innerHTML = label; }, 2200);
    } catch (e) { /* canceló */ }
  });
}

// Abierto / cerrado ahora (hora de Buenos Aires)
const HOURS = { 0: null, 1: [8, 23], 2: [8, 23], 3: [8, 23], 4: [8, 23], 5: [8, 23], 6: [10, 18] };
const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function nowBA() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), h: Number(get('hour')) + Number(get('minute')) / 60 };
}
function paint() {
  const { day, h } = nowBA();
  const dot = document.getElementById('dot');
  const txt = document.getElementById('status-text');
  const today = HOURS[day];
  if (today && h >= today[0] && h < today[1]) {
    dot.className = 'dot is-open'; txt.textContent = `Abierto ahora · hasta las ${today[1]}`;
  } else {
    dot.className = 'dot is-closed';
    let i = today && h < today[0] ? 0 : 1;
    while (!HOURS[(day + i) % 7]) i++;
    const d = (day + i) % 7;
    const when = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DAYS[d]}`;
    txt.textContent = `Cerrado · abre ${when} a las ${HOURS[d][0]}`;
  }
  document.querySelectorAll('.day-row').forEach(r => {
    const ds = r.dataset.day;
    const isToday = ds === '1-5' ? day >= 1 && day <= 5 : Number(ds) === day;
    r.classList.toggle('is-today', isToday);
    const now = r.querySelector('.now');
    if (now) now.style.left = `${Math.min(Math.max((h - 6) / 18, 0), 1) * 100}%`;
  });
}
paint();
setInterval(paint, 60000);
