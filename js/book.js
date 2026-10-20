/* =====================================================================
   CUỐN SỔ — dựng nội dung các trang, căn ảnh, lá bài, lật trang, phiếu cào.
   Nội dung chữ/ảnh lấy từ noi-dung.js. Mở sổ bằng Gift.openBook() (intro.js gọi).
   ===================================================================== */
(() => {
  'use strict';
  const D = window.NOI_DUNG;
  const $ = id => document.getElementById(id);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const TAU = Math.PI * 2;
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const Gift = window.Gift = { $, TAU, rng, reduce };

  /* ---------- chiều cao vùng nhìn thấy thật trên điện thoại ---------- */
  const setAppH = () => document.documentElement.style.setProperty('--app-h', innerHeight + 'px');
  setAppH();
  addEventListener('resize', setAppH);

  /* ---------- trình duyệt cũ (iOS < 16) không hiểu đơn vị cqi: đổi sang biến --cq ---------- */
  const CQI_OK = !!(window.CSS && CSS.supports && CSS.supports('width', '1cqi'));
  const cq = v => CQI_OK ? v + 'cqi' : `calc(${v} * var(--cq, 3px))`;
  if (!CQI_OK){
    const fix = v => v.replace(/(-?\d*\.?\d+)cqi/g, 'calc($1 * var(--cq, 3px))');
    const walk = rules => { for (const r of rules){
      if (r.cssRules) walk(r.cssRules);
      if (r.style) for (const p of [...r.style]){ const v = r.style.getPropertyValue(p); if (v.includes('cqi')) r.style.setProperty(p, fix(v), r.style.getPropertyPriority(p)); }
    } };
    for (const sh of document.styleSheets){ try { walk(sh.cssRules); } catch (e){ /* file:// hoặc khác nguồn */ } }
    $$('[style*="cqi"]').forEach(el => el.setAttribute('style', fix(el.getAttribute('style'))));
  }

  /* ---------- chữ ---------- */
  const TEXT = Object.assign({}, D, { bia0: D.bia[0], bia1: D.bia[1], tuAnh: 'từ ' + D.kyTen.toLowerCase() });
  $$('[data-text]').forEach(el => { const v = TEXT[el.dataset.text]; if (v != null) el.textContent = v; });
  $$('[data-html]').forEach(el => { const v = TEXT[el.dataset.html]; if (v != null) el.innerHTML = v; });
  $('firsts').innerHTML = D.lanDau.map(([t, done]) => `<li class="${done ? 'done' : ''}">${t}</li>`).join('');
  $('letterText').innerHTML = `<h2>Gửi ${D.nguoiNhan},</h2>` + D.thu.map(p => `<p>${p}</p>`).join('') + `<p class="sign">${D.loiKet}<b>${D.kyTen}</b></p>`;

  /* ---------- chữ cắt dán ---------- */
  const RFONT = ["'Lora', Georgia, serif", "'Sriracha', cursive", "'Be Vietnam Pro', sans-serif", "Georgia, serif", "'Patrick Hand', cursive", "Impact, 'Arial Black', sans-serif"];
  const RCOL = [['#f6efe0', '#1d1d22'], ['#1d1d22', '#f6efe0'], ['#f7c6d3', '#a3123a'], ['#bfe5e0', '#1e5a52'], ['#ffffff', '#c2185b'], ['#efe3c8', '#3b5a8a'], ['#e8b4c0', '#1d1d22'], ['#fbe7a1', '#7a3b0c']];
  $$('.ransom').forEach((el, k) => {
    const text = (el.textContent || '').normalize('NFC'), R = rng(97 + k * 31 + text.length);
    el.textContent = ''; el.setAttribute('aria-label', text);
    for (const ch of Array.from(text)){
      if (ch === ' '){ el.append(' '); continue; }
      const s = document.createElement('span'), c = RCOL[Math.floor(R() * RCOL.length)];
      s.textContent = ch; s.setAttribute('aria-hidden', 'true');
      s.style.cssText = `font-family:${RFONT[Math.floor(R() * RFONT.length)]};background:${c[0]};color:${c[1]};rotate:${((R() - .5) * 16).toFixed(1)}deg;font-size:${(.85 + R() * .4).toFixed(2)}em;font-weight:${R() < .5 ? 700 : 400};${R() < .35 ? 'font-style:italic;' : ''}`;
      el.appendChild(s);
    }
  });

  /* ---------- sticker & hình vẽ tay ---------- */
  const star = (fill, stroke, extra = '') => `<svg viewBox="0 0 40 40"><path d="M20 3l5 11 12 1.5-9 8.5 2.5 12L20 30l-10.5 6 2.5-12-9-8.5L15 14z" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round"/>${extra}</svg>`;
  const glitter = Array.from({ length:26 }, (_, i) => { const R = rng(i + 3); return `<circle cx="${(9 + R() * 22).toFixed(1)}" cy="${(9 + R() * 22).toFixed(1)}" r="${(.4 + R() * .8).toFixed(2)}" fill="#fff" opacity=".85"/>`; }).join('');
  const STK = {
    starRed: star('#8a1c2b', '#5e0f1c'),
    starGold: star('#f2c94c', '#b8860b'),
    glitterStar: star('#5cc0b5', '#2f8f84', glitter),
    smiley: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#f7d33c" stroke="#1d1d22" stroke-width="1.5"/><ellipse cx="14" cy="16" rx="2" ry="3" fill="#1d1d22"/><ellipse cx="26" cy="16" rx="2" ry="3" fill="#1d1d22"/><path d="M11 23q9 10 18 0" fill="none" stroke="#1d1d22" stroke-width="2" stroke-linecap="round"/></svg>`,
    rainbow: `<svg viewBox="0 0 60 40"><g fill="none" stroke-width="5" stroke-linecap="round"><path d="M8 34a22 22 0 0 1 44 0" stroke="#f28b9b"/><path d="M14 34a16 16 0 0 1 32 0" stroke="#f7c66b"/><path d="M20 34a10 10 0 0 1 20 0" stroke="#8fd3c8"/></g><g fill="#fff" stroke="#c9d3dc" stroke-width="1"><circle cx="9" cy="34" r="5"/><circle cx="14" cy="35" r="4"/><circle cx="51" cy="34" r="5"/><circle cx="46" cy="35" r="4"/></g></svg>`,
    paperclip: `<svg viewBox="0 0 20 50"><path d="M6 44V10a4 4 0 0 1 8 0v30a6 6 0 0 1-12 0V14" fill="none" stroke="#8b8f98" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    paperclipPink: `<svg viewBox="0 0 20 50"><path d="M6 44V10a4 4 0 0 1 8 0v30a6 6 0 0 1-12 0V14" fill="none" stroke="#e98aa6" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    clipPink: `<svg viewBox="0 0 30 40"><rect x="3" y="14" width="24" height="22" rx="3" fill="#f39ab4"/><path d="M8 15V6a3 3 0 0 1 6 0v9M16 15V6a3 3 0 0 1 6 0v9" fill="none" stroke="#c0c4cc" stroke-width="2"/></svg>`,
    binderBlue: `<svg viewBox="0 0 40 40"><path d="M6 18h28l-3 18H9z" fill="#3a6fd8"/><path d="M6 18h28l-1 4H7z" fill="#5d8df0"/><path d="M12 18L9 4h6l2 14M28 18l3-14h-6l-2 14" fill="none" stroke="#b9bec8" stroke-width="2"/></svg>`,
    ribbonBow: `<svg viewBox="0 0 60 50"><path d="M30 18C18 2 4 6 8 18s18 6 22 0zM30 18c12-16 26-12 22 0s-18 6-22 0z" fill="#fff" stroke="#1d1d22" stroke-width="1.6"/><path d="M30 18l-10 28M30 18l10 26" stroke="#1d1d22" stroke-width="1.6" fill="none"/><circle cx="30" cy="18" r="4" fill="#fff" stroke="#1d1d22" stroke-width="1.6"/></svg>`,
    shootingStar: `<svg viewBox="0 0 60 40"><path d="M4 30C18 26 28 20 36 12" fill="none" stroke="#1d1d22" stroke-width="1.4" stroke-dasharray="1 3" stroke-linecap="round"/><g transform="translate(32 0) scale(.6)"><path d="M20 3l5 11 12 1.5-9 8.5 2.5 12L20 30l-10.5 6 2.5-12-9-8.5L15 14z" fill="#fff" stroke="#1d1d22" stroke-width="1.4" stroke-linejoin="round"/></g></svg>`,
    planeTrail: `<svg viewBox="0 0 120 50"><path d="M4 40c14-2 18-16 30-12s4 14 16 10 22-18 38-22" fill="none" stroke="#1d1d22" stroke-width="1.5" stroke-dasharray="3 3" stroke-linecap="round"/><path d="M88 16l30-12-14 30-6-12z" fill="#fff" stroke="#1d1d22" stroke-width="1.6" stroke-linejoin="round"/><path d="M98 22l20-18" stroke="#1d1d22" stroke-width="1.4"/></svg>`,
    heartDoodle: `<svg viewBox="0 0 40 36"><path d="M20 32C6 22 2 14 5 8s12-6 15 2c3-8 12-8 15-2s-1 14-15 24z" fill="none" stroke="#1d1d22" stroke-width="1.8" stroke-linejoin="round"/><path d="M21 30C9 21 6 14 8 9" fill="none" stroke="#1d1d22" stroke-width="1"/></svg>`,
    heartsTrio: `<svg viewBox="0 0 60 50"><g fill="none" stroke="#1d1d22" stroke-width="1.6"><path d="M14 22C4 15 2 9 5 5s8-3 9 2c1-5 7-6 9-2s0 10-9 17z"/><path d="M38 30C30 24 28 19 31 16s7-2 7 2c1-4 6-5 8-2s0 8-8 14z"/><path d="M22 46C16 42 14 38 16 36s5-1 6 1c0-2 4-3 5-1s0 6-5 10z"/></g></svg>`,
    flowerDoodle: `<svg viewBox="0 0 50 50"><g fill="#fff" stroke="#1d1d22" stroke-width="1.6">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="25" cy="13" rx="7" ry="10" transform="rotate(${a} 25 25)"/>`).join('')}<circle cx="25" cy="25" r="6"/></g></svg>`,
    asterisk: `<svg viewBox="0 0 30 30"><g stroke="#1d1d22" stroke-width="3" stroke-linecap="round"><path d="M15 3v24M4 9l22 12M26 9L4 21"/></g></svg>`,
    camera: `<svg viewBox="0 0 120 80"><rect x="6" y="18" width="108" height="58" rx="8" fill="#e9e6e0" stroke="#2b2b33" stroke-width="2"/><rect x="6" y="18" width="108" height="16" rx="6" fill="#2b2b33"/><rect x="18" y="10" width="22" height="10" rx="3" fill="#2b2b33"/><circle cx="66" cy="50" r="22" fill="#2b2b33"/><circle cx="66" cy="50" r="15" fill="#4d5560"/><circle cx="66" cy="50" r="8" fill="#1b1f24"/><circle cx="61" cy="45" r="3" fill="#cfd6dd"/><rect x="94" y="24" width="12" height="6" rx="2" fill="#f2c94c"/></svg>`
  };
  $$('[data-stk]').forEach(el => { el.innerHTML = STK[el.dataset.stk] || ''; el.setAttribute('aria-hidden', 'true'); });

  /* ---------- khăn ren trái tim, gáy lò xo ---------- */
  const doily = (() => {
    const pts = [], N = 64, f = p => p.map(v => v.toFixed(1)).join(',');
    for (let i = 0; i < N; i++){
      const t = i / N * TAU, x = 16 * Math.pow(Math.sin(t), 3), y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      pts.push([100 + x * 5.6, 84 + y * 5.6]);
    }
    const poly = pts.map(f).join(' ');
    const inner = pts.map(([x, y]) => f([100 + (x - 100) * .72, 84 + (y - 84) * .72 + 4])).join(' ');
    const scal = pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5"/>`).join('');
    const holes = pts.map(([x, y]) => `<circle cx="${(100 + (x - 100) * 1.01).toFixed(1)}" cy="${(84 + (y - 84) * 1.01).toFixed(1)}" r="1.6"/>`).join('');
    return `<svg viewBox="0 0 200 190" aria-hidden="true"><defs><pattern id="lace" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0H8V8" fill="none" stroke="#fff" stroke-width="2.6"/></pattern></defs>
      <g filter="drop-shadow(0 1px 1.5px rgba(0,0,0,.18))"><g fill="#fff">${scal}</g><polygon points="${poly}" fill="url(#lace)" stroke="#fff" stroke-width="5"/></g>
      <g fill="#cfe9ec">${holes}</g><polygon points="${inner}" fill="#f6f1e8"/></svg>`;
  })();
  $$('.doily').forEach(el => { el.innerHTML = doily; });
  $$('.spiral').forEach(el => { el.innerHTML = '<i></i>'.repeat(22); el.setAttribute('aria-hidden', 'true'); });

  /* ---------- giấy viết tay & mẩu báo ---------- */
  $$('.script-paper').forEach((el, k) => {
    const R = rng(50 + k); let d = '';
    for (let line = 0; line < 9; line++){
      let x = 6 + R() * 6; const y = 12 + line * 10.5;
      d += `M${x.toFixed(1)} ${y}`;
      while (x < 92){
        const w = 2.5 + R() * 3.5, h = 3 + R() * 4;
        d += ` q${(w / 2).toFixed(1)} ${(-h).toFixed(1)} ${w.toFixed(1)} 0 q${(w / 3).toFixed(1)} ${(h * .7).toFixed(1)} ${(w * .7).toFixed(1)} ${(R() - .5).toFixed(1)}`;
        x += w * 1.7; if (R() < .12){ x += 3; d += ' m3 0'; }
      }
    }
    el.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="#3b3b44" stroke-width=".7" stroke-linecap="round" opacity=".7"/></svg>`;
  });
  {
    const W = 'những ngày nắng nhẹ phố nhỏ có hai người đi cùng nhau qua mùa mưa thư tay gửi em một chút thương mỗi sáng cà phê sữa đá hoa nở bên hiên ký ức kể lại chuyện xưa hẹn hò cuối tuần'.split(' '), R = rng(11);
    let s = '<b>Tin vui</b>';
    for (let p = 0; p < 9; p++){ s += '<span>'; for (let i = 0; i < 40; i++) s += W[Math.floor(R() * W.length)] + ' '; s += '</span> '; }
    $('news1').innerHTML = s; $('news1').setAttribute('aria-hidden', 'true');
  }

  /* ---------- bó hoa nhỏ ---------- */
  const cone = `<svg viewBox="0 0 100 70" aria-hidden="true"><path d="M6 6L94 0 58 70H44z" fill="#d9b88a"/><path d="M6 6L50 4 46 70H44z" fill="#e8cfa6"/><path d="M50 4l8 66" stroke="rgba(120,80,40,.3)" stroke-width="1"/><path d="M38 34q12 6 24 0" fill="none" stroke="#e98aa6" stroke-width="4" stroke-linecap="round"/><path d="M50 36l-10 14M50 36l9 13" stroke="#e98aa6" stroke-width="3" stroke-linecap="round"/></svg>`;
  const BQ_POS = [['6%', '0', '62%', -6], ['46%', '8%', '48%', 8], ['0', '22%', '42%', -12], ['40%', '28%', '36%', 14]];
  $$('.bq').forEach((el, k) => {
    const set = k % 2 ? ['roses3', 'carnation', 'wildRose', 'pinkBlossom'] : ['roses3', 'peonySticker', 'wildRose', 'pinkBlossom'];
    el.innerHTML = set.map((f, i) => { const [l, t, w, r] = BQ_POS[i]; return `<img class="pop" src="assets/hoa/${f}.webp" alt="" style="left:${l};top:${t};width:${w};rotate:${r}deg;--d:${(.15 + i * .18).toFixed(2)}s">`; }).join('') + cone;
  });

  /* ---------- lá bài: chữ số góc, chất vẽ SVG (mọi máy hiện giống nhau) ---------- */
  const SUIT = {
    '♥': { red:true, d:'M10 18.2C3.6 13.6.9 10 1.3 6.6 1.7 3.7 4 2 6.4 2.2c1.6.1 2.8 1 3.6 2.4.8-1.4 2-2.3 3.6-2.4 2.4-.2 4.7 1.5 5.1 4.4.4 3.4-2.3 7-8.7 11.6Z' },
    '♦': { red:true, d:'M10 1.2 17.2 10 10 18.8 2.8 10Z' },
    '♠': { red:false, d:'M10 1.2C7.6 4.6 1.4 8 1.4 12c0 2.6 2 4.3 4.4 4.3 1.3 0 2.4-.5 3.2-1.4-.2 1.6-.9 2.8-2.2 3.9h6.4c-1.3-1.1-2-2.3-2.2-3.9.8.9 1.9 1.4 3.2 1.4 2.4 0 4.4-1.7 4.4-4.3C18.6 8 12.4 4.6 10 1.2Z' },
    '♣': { red:false, d:'M10 1.6a3.9 3.9 0 0 0-3 6.4A3.9 3.9 0 1 0 8.9 14c-.2 1.9-1 3.3-2.3 4.4h6.8c-1.3-1.1-2.1-2.5-2.3-4.4a3.9 3.9 0 1 0 1.9-6A3.9 3.9 0 0 0 10 1.6Z' }
  };
  const suitIcon = s => `<svg viewBox="0 0 20 20" aria-hidden="true"><path class="suit" d="${SUIT[s].d}"/></svg>`;
  let pipId = 0;
  const pipWatercolor = s => {   // chất to ở giữa lá Át, tô kiểu màu nước
    const { d, red } = SUIT[s], id = 'wc' + (pipId++), R = rng(31 + pipId * 7);
    const [light, mid, deep] = red ? ['#ffc2cc', '#e2445f', '#9e0f2c'] : ['#a9b0c2', '#3c4252', '#11131a'];
    const blots = Array.from({ length:7 }, () => `<circle cx="${(3 + R() * 14).toFixed(1)}" cy="${(3 + R() * 14).toFixed(1)}" r="${(1.2 + R() * 2.8).toFixed(1)}" fill="${R() < .55 ? deep : light}" opacity="${(.12 + R() * .18).toFixed(2)}"/>`).join('');
    return `<svg viewBox="0 0 20 20" aria-hidden="true"><defs>
      <radialGradient id="${id}g" cx="38%" cy="32%" r="78%"><stop offset="0" stop-color="${light}"/><stop offset=".5" stop-color="${mid}" stop-opacity=".92"/><stop offset="1" stop-color="${deep}"/></radialGradient>
      <clipPath id="${id}c"><path d="${d}"/></clipPath></defs>
      <path d="${d}" fill="url(#${id}g)"/><g clip-path="url(#${id}c)">${blots}</g>
      <path d="${d}" fill="none" stroke="${deep}" stroke-width=".45" stroke-opacity=".6"/></svg>`;
  };
  const parseCard = t => { const m = String(t).replace(/[︎️\s]/g, '').match(/^(10|[2-9AJQK])([♥♦♠♣])$/u); return m ? { r:m[1], s:m[2] } : null; };
  const dressCard = (el, label, ace) => {
    const c = parseCard(label); if (!c) return;
    el.style.setProperty('--c', SUIT[c.s].red ? '#c8102e' : '#1d1d22');
    const idx = cls => `<span class="idx ${cls}" aria-hidden="true">${c.r}${suitIcon(c.s)}</span>`;
    el.insertAdjacentHTML('afterbegin', idx('tl') + idx('br') + (ace ? `<span class="pip">${pipWatercolor(c.s)}</span>` : ''));
    el.setAttribute('aria-label', c.r + c.s);
  };
  $$('#cards .card:not(.ace)').forEach((el, i) => dressCard(el, (D.laBai || [])[i]));
  $$('#cards .ace').forEach((el, i) => dressCard(el, (D.laBaiXoe || [])[i], true));

  /* ---------- ảnh: photo/01.jpg … hoặc ô trống có số ---------- */
  const KHUNG = D.khungAnh || {};
  function frameImg(el){   // giống object-fit:cover nhưng giữ điểm chủ thể ở giữa khung, có phóng to
    const im = el._im; if (!im) return;
    const spec = KHUNG[+el.dataset.n] || [], px = spec[0] ?? 50, py = spec[1] ?? 50, z = Math.max(1, +spec[2] || 1);
    const sw = el.offsetWidth, sh = el.offsetHeight, iw = im.naturalWidth, ih = im.naturalHeight;
    if (!sw || !sh || !iw || !ih){ im.classList.remove('framed'); im.style.cssText = `object-position:${px}% ${py}%`; return; }
    const A = iw / ih, S = sw / sh, W = (A > S ? A / S : 1) * z, H = (A > S ? 1 : S / A) * z;
    const cl = (v, a, b) => Math.min(b, Math.max(a, v));
    const L = cl(.5 - px / 100 * W, 1 - W, 0), T = cl(.5 - py / 100 * H, 1 - H, 0);
    im.classList.add('framed');
    im.style.cssText = `left:${(L * 100).toFixed(3)}%;top:${(T * 100).toFixed(3)}%;width:${(W * 100).toFixed(3)}%;height:${(H * 100).toFixed(3)}%`;
  }
  const reframeAll = () => $$('.ph[data-n]').forEach(frameImg);
  const camIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
  const loadPhoto = (el, list, i = 0) => {
    if (i >= list.length) return;
    const im = new Image();
    im.onload = () => {
      const put = () => { im.alt = ''; el.replaceChildren(im); el._im = im; frameImg(el); };
      im.decode ? im.decode().then(put, put) : put();   // giải mã trước để lật tới không bị chớp trắng
    };
    im.onerror = () => loadPhoto(el, list, i + 1);
    im.src = list[i];
  };
  $$('.ph[data-n]').forEach(el => {
    const n = +el.dataset.n, nn = String(n).padStart(2, '0'), own = D.anhRieng && D.anhRieng[n];
    el.innerHTML = `<span class="ph-empty">${camIcon}<b>${nn}</b></span>`;
    loadPhoto(el, own ? [own] : ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'PNG'].map(e => `${D.thuMucAnh}${nn}.${e}`));
  });

  /* =====================================================================
     LẬT TRANG
     - Màn rộng: thấy 2 trang. Điện thoại dọc: thấy 1 trang (side 'L'/'R').
     - Trước khi tờ giấy chuyển động, cả 2 mặt được đánh dấu "turning" để trình duyệt
       vẽ sẵn, rồi mới đổi góc (2 khung hình sau) → lật mượt, không giật giữa chừng.
     - Đọc lại: các tờ lật về lần lượt bằng transition-delay của CSS (đều tay).
     - Thứ tự chồng giấy (z-index) đổi đúng lúc tờ giấy dựng đứng qua gáy sổ (CSS lo).
     ===================================================================== */
  const book = $('book'), stage = $('stage'), leaves = $$('.leaf', book), NL = leaves.length, LAST = 2 * NL - 1;
  const prevBtn = $('prevBtn'), nextBtn = $('nextBtn'), bLabel = $('bLabel'), bHint = $('bHint');
  const ICON_NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  const ICON_AGAIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2-5M5 4v4h4"/></svg>';
  const S = { flips:0, side:'R', single:null, open:false, moved:false, busyUntil:0 };
  let raf = 0, lastW = 0, lastH = 0;
  const flipMs = () => (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--flip')) || 1.05) * 1000;
  const pageIndex = () => S.single ? (S.flips === 0 ? 0 : S.side === 'L' || S.flips === NL ? 2 * S.flips - 1 : 2 * S.flips) : S.flips;
  const atEnd = () => S.single ? pageIndex() === LAST : S.flips === NL;
  const restZ = (lf, i) => { lf.style.zIndex = lf.classList.contains('flipped') ? i + 1 : 20 - i; };

  function settle(lf){
    lf._busy = false;
    lf.classList.remove('turning'); lf.style.removeProperty('--delay');
  }
  function cameraShift(){
    if (S.single) return S.side === 'L' || S.flips === NL ? 25 : -25;
    return S.flips === 0 ? -25 : S.flips === NL ? 25 : 0;
  }
  // áp trạng thái S lên các tờ giấy; stagger (ms) > 0 khi đọc lại
  function commit(stagger = 0){
    const want = i => i < S.flips;
    leaves.forEach((lf, i) => { if (want(i) !== lf.classList.contains('flipped')) lf.classList.add('turning'); });
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => {
      const dur = flipMs(), back = leaves.filter((lf, i) => !want(i) && lf.classList.contains('flipped'));
      const moving = leaves.filter((lf, i) => want(i) !== lf.classList.contains('flipped'));
      if (back.length) moving.reverse();                     // lật lùi: tờ trên cùng (chỉ số lớn) đi trước
      leaves.forEach(lf => { if (!lf._busy && !moving.includes(lf)) lf.classList.remove('turning'); });
      moving.forEach((lf, k) => {
        const delay = k * stagger;
        lf._busy = true;
        lf.classList.add('turning');
        lf.style.setProperty('--delay', delay + 'ms');
        lf.classList.toggle('flipped');
        restZ(lf, leaves.indexOf(lf));                       // CSS đổi z-index ở giữa lúc lật (--flip-mid)
        clearTimeout(lf._t); lf._t = setTimeout(() => settle(lf), dur + delay + 80);
      });
      book.style.transitionDuration = (dur + Math.max(0, moving.length - 1) * stagger) + 'ms';
      book.style.transform = `translateX(${cameraShift()}%)`;
    }); });
    updateUI();
  }
  function updateUI(){
    const P = pageIndex(), end = atEnd();
    leaves.forEach((lf, i) => {
      lf.inert = !(i === S.flips || i === S.flips - 1);
      lf.classList.toggle('near', i >= S.flips - 2 && i <= S.flips + 1);
    });
    bLabel.textContent = P === 0 ? 'Bìa' : end ? 'Lá thư' : S.single ? `Trang ${P}` : `${S.flips * 2 - 1} · ${S.flips * 2}`;
    prevBtn.disabled = P === 0;
    nextBtn.setAttribute('aria-label', end ? 'Đọc lại từ đầu' : 'Trang sau');
    nextBtn.innerHTML = end ? ICON_AGAIN : ICON_NEXT;
    bHint.textContent = S.single ? 'Vuốt sang trái hoặc bấm mũi tên để lật trang' : 'Bấm mũi tên hoặc vuốt để lật trang';
    bHint.classList.toggle('off', S.moved || !S.open);
    visibleFaces().forEach(f => {
      if (!f.classList.contains('seen')) setTimeout(() => { f.classList.add('seen'); if (f.contains(ticket)) paintFoil(); }, reduce() ? 0 : 450);
      else if (f.contains(ticket)) requestAnimationFrame(paintFoil);
    });
  }
  function visibleFaces(){
    const left = S.flips > 0 ? leaves[S.flips - 1].querySelector('.back') : null;
    const right = S.flips < NL ? leaves[S.flips].querySelector('.front') : null;
    if (!S.single) return [left, right].filter(Boolean);
    return [S.side === 'L' || S.flips === NL ? left : right].filter(Boolean);
  }
  function step(d){
    if (performance.now() < S.busyUntil) return;
    if (S.single){
      const P = pageIndex() + d;
      if (P < 0 || P > LAST) return;
      S.flips = Math.floor((P + 1) / 2); S.side = P % 2 ? 'L' : 'R';
    } else {
      const n = S.flips + d;
      if (n < 0 || n > NL) return;
      S.flips = n;
    }
    S.moved = true; commit();
  }
  function restart(){
    if (performance.now() < S.busyUntil) return;
    const stagger = reduce() ? 0 : 150;
    S.busyUntil = performance.now() + flipMs() + S.flips * stagger;
    S.flips = 0; S.side = 'R'; S.moved = true;
    commit(stagger);
  }
  const next = () => atEnd() ? restart() : step(1);

  function layoutBook(){
    const cs = getComputedStyle($('sBook'));
    const W = innerWidth, H = innerHeight - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
    const hAvail = Math.max(170, H - (H <= 520 ? 70 : 118));          // chừa chỗ cho nút lật trang
    const spreadPw = Math.min(W * .47, hAvail * .72, 520);
    const wasSingle = S.single;
    S.single = spreadPw < 300 && H > W * 1.05;
    const pw = S.single ? Math.min(W * .9, hAvail * .72, 560) : spreadPw;
    book.style.setProperty('--pw', pw.toFixed(2) + 'px');
    book.style.setProperty('--ph', (pw / .72).toFixed(2) + 'px');
    if (!CQI_OK) book.style.setProperty('--cq', (pw / 100).toFixed(3) + 'px');
    if (wasSingle !== null && wasSingle !== S.single && S.single) S.side = S.flips === 0 ? 'R' : 'L';
    if (wasSingle === null || wasSingle !== S.single){         // lần đầu / đổi chế độ: đặt ngay, không hiệu ứng
      book.classList.add('instant');
      leaves.forEach((lf, i) => { clearTimeout(lf._t); lf.classList.toggle('flipped', i < S.flips); settle(lf); restZ(lf, i); });
      book.style.transform = `translateX(${cameraShift()}%)`;
      void book.offsetWidth; book.classList.remove('instant');
      updateUI();
    }
    if (Math.abs(W - lastW) > 1 || Math.abs(H - lastH) > 1){ lastW = W; lastH = H; reframeAll(); fitLetter(); }
  }

  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', next);
  document.addEventListener('keydown', e => {
    if (!S.open) return;
    if (e.key === 'ArrowRight') next(); else if (e.key === 'ArrowLeft') step(-1);
  });
  let sx0 = null, sy0 = 0;
  stage.addEventListener('pointerdown', e => { sx0 = e.isPrimary && !e.target.closest('#ticket') ? e.clientX : null; sy0 = e.clientY; });
  stage.addEventListener('pointerup', e => {
    if (sx0 === null) return;
    const dx = e.clientX - sx0, dy = e.clientY - sy0; sx0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2){ if (dx < 0) next(); else step(-1); }
  });
  stage.addEventListener('pointercancel', () => { sx0 = null; });
  let rzT = 0;
  addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(layoutBook, 120); });

  /* ---------- phiếu cào ---------- */
  const ticket = $('ticket'), foil = $('foil'), fx = foil.getContext('2d');
  let revealed = false, painted = false, drawing = false, lastP = null, moves = 0, fw = 0, fh = 0;
  function paintFoil(){
    if (revealed) return;
    const cw = foil.offsetWidth, ch = foil.offsetHeight;
    if (!cw || (painted && Math.abs(cw - fw) < 2)) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    fw = cw; fh = ch; foil.width = Math.round(fw * dpr); foil.height = Math.round(fh * dpr);
    fx.setTransform(dpr, 0, 0, dpr, 0, 0); fx.globalCompositeOperation = 'source-over';
    const gr = fx.createLinearGradient(0, 0, fw, fh);
    [[0, '#c9ccd2'], [.3, '#eef0f3'], [.55, '#b9bec6'], [.8, '#e6e8ec'], [1, '#c4c8cf']].forEach(([o, c]) => gr.addColorStop(o, c));
    fx.fillStyle = gr; fx.fillRect(0, 0, fw, fh);
    const R = rng(5);
    for (let i = 0; i < 120; i++){ fx.fillStyle = `rgba(255,255,255,${.25 + R() * .5})`; fx.beginPath(); fx.arc(R() * fw, R() * fh, .5 + R() * 1.4, 0, TAU); fx.fill(); }
    fx.fillStyle = 'rgba(60,66,80,.75)'; fx.font = `italic 600 ${Math.round(fw * .085)}px Lora, Georgia, serif`;
    fx.textAlign = 'center'; fx.textBaseline = 'middle'; fx.fillText('Cào ở đây', fw / 2, fh / 2);
    painted = true;
  }
  const foilPos = e => { const r = foil.getBoundingClientRect(); return { x:(e.clientX - r.left) * fw / r.width, y:(e.clientY - r.top) * fh / r.height }; };
  function scratchTo({ x, y }){
    fx.globalCompositeOperation = 'destination-out'; fx.lineCap = fx.lineJoin = 'round'; fx.lineWidth = fw * .14;
    fx.beginPath();
    if (lastP){ fx.moveTo(lastP.x, lastP.y); fx.lineTo(x, y); fx.stroke(); } else { fx.arc(x, y, fx.lineWidth / 2, 0, TAU); fx.fill(); }
    lastP = { x, y };
    if (++moves % 8 === 0) checkCleared();
  }
  function checkCleared(){
    const d = fx.getImageData(0, 0, foil.width, foil.height).data; let c = 0, t = 0;
    for (let i = 3; i < d.length; i += 96){ t++; if (d[i] < 100) c++; }
    if (c / t > .5) reveal();
  }
  function reveal(){
    if (revealed) return;
    revealed = true; drawing = false; ticket.classList.add('revealed');
    const b = $('burst'), cols = ['#f2d68c', '#f6a3bd', '#8fd3c8', '#ffffff']; b.innerHTML = '';
    for (let i = 0; i < 22; i++){
      const s = document.createElement('span'), a = Math.random() * TAU, d = 16 + Math.random() * 28;
      s.style.setProperty('--x', cq((Math.cos(a) * d).toFixed(1))); s.style.setProperty('--y', cq((Math.sin(a) * d).toFixed(1)));
      s.style.setProperty('--r', ((Math.random() - .5) * 80).toFixed(0) + 'deg'); s.style.animationDelay = (Math.random() * .2).toFixed(2) + 's';
      s.style.background = cols[i % cols.length]; b.appendChild(s);
    }
  }
  foil.addEventListener('pointerdown', e => { if (revealed) return; paintFoil(); drawing = true; lastP = null; foil.setPointerCapture(e.pointerId); scratchTo(foilPos(e)); });
  foil.addEventListener('pointermove', e => { if (drawing) scratchTo(foilPos(e)); });
  const stopScratch = () => { if (drawing){ drawing = false; lastP = null; if (!revealed) checkCleared(); } };
  foil.addEventListener('pointerup', stopScratch); foil.addEventListener('pointercancel', stopScratch);

  /* ---------- lá thư luôn vừa khung giấy ---------- */
  function fitLetter(){
    const el = $('letterText'); let size = 4.3;
    el.style.fontSize = cq(size);
    while (el.scrollHeight > el.clientHeight + 1 && size > 3){ size -= .1; el.style.fontSize = cq(size.toFixed(2)); }
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLetter);

  layoutBook();
  Gift.openBook = () => {
    const sb = $('sBook');
    sb.inert = false; sb.classList.add('on'); S.open = true;
    layoutBook(); fitLetter(); reframeAll(); updateUI();
    nextBtn.focus({ preventScroll:true });
  };
  Gift.showBook = () => $('sBook').classList.add('on');
})();
