/* =====================================================================
   MỞ ĐẦU — màn tải → tường hoa xoay → phong bì → hoa bung → mở sổ.
   Vẽ trên một canvas phủ màn hình; hoa và bướm đều là ảnh trong assets/.
   ===================================================================== */
(() => {
  'use strict';
  const { $, TAU, rng, reduce } = window.Gift;
  const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeIn = t => t * t * t;
  const easeBack = t => t <= 0 ? 0 : t >= 1 ? 1 : 1 + 2.6 * Math.pow(t - 1, 3) + 1.6 * Math.pow(t - 1, 2);
  const angDiff = (a, b) => { let d = a - b; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
  const isDark = () => getComputedStyle(document.documentElement).getPropertyValue('--is-dark').trim() === '1';

  /* ---------- ảnh dùng cho tường hoa ---------- */
  const PHOTO = ['roses3', 'wildRose', 'peonyHot', 'peonyWc', 'peonyPale', 'peonySticker', 'carnation', 'pinkgold', 'pinklily', 'pinkBlossom', 'azalea', 'dahliaBlue', 'blueWc'];
  const PAINTED = ['hong-1', 'hong-2', 'hong-3', 'hong-4', 'hong-5', 'hong-6', 'hong-7', 'hong-8', 'cam-chuong-1', 'cam-chuong-2', 'cam-chuong-3', 'hoa-muc-1', 'hoa-muc-2', 'hoa-muc-3', 'dong-tien-1', 'dong-tien-2'];
  const ROSE = ['roses3', 'wildRose', 'hong-1', 'hong-2', 'hong-3', 'hong-4', 'hong-5', 'hong-6', 'hong-7', 'hong-8'];
  const CENTER = 'hongTam';   // bông hồng giữa tường hoa (assets/hoa/hongTam.webp, đã căn tâm sẵn)
  const BIG = ['roses3', 'peonyHot', 'peonyWc', 'peonySticker', 'carnation', 'dahliaBlue'];
  /* bướm: top = xoè cánh nhìn từ trên (ax = vị trí thân), còn lại nhìn ngang (ax, ay = gốc cánh; face -1 đầu quay trái) */
  const BUTTERFLIES = [
    { f:'tim-1', top:true, ax:.563 }, { f:'tim-2', top:true, ax:.41 }, { f:'tim-3', top:true, ax:.56 },
    { f:'tim-4', ax:.2, ay:.8, face:-1 }, { f:'tim-5', ax:.6, ay:.7, face:1 }, { f:'tim-6', ax:.43, ay:.8, face:-1 }, { f:'tim-7', ax:.6, ay:.8, face:1 },
    { f:'vang-1', top:true, ax:.567 }, { f:'vang-2', top:true, ax:.416 }, { f:'vang-3', top:true, ax:.558 },
    { f:'vang-4', ax:.18, ay:.8, face:-1 }, { f:'vang-5', ax:.62, ay:.8, face:1 }, { f:'vang-6', ax:.37, ay:.8, face:-1 }, { f:'vang-7', ax:.62, ay:.82, face:1 },
    { f:'xanh-1', top:true, ax:.52 }, { f:'xanh-2', ax:.4, ay:.8, face:-1 }, { f:'xanh-3', ax:.36, ay:.78, face:-1 }
  ];
  const path = k => PAINTED.includes(k) ? `assets/hoa-ve/${k}.webp` : `assets/hoa/${k}.webp`;
  const loadImg = src => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });

  const cv = $('fx'), g = cv.getContext('2d'), envBtn = $('envBtn');
  let W = 0, H = 0, DPR = 1;
  const phone = () => Math.min(W, H) < 520;
  function size(){
    DPR = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* ---------- hoa: { img, r } với r = "bán kính" của bông hoa tính theo pixel ảnh ---------- */
  const flowers = [], idx = { photo:[], rose:[], big:[], all:[], center:-1 }, bfImgs = [];
  async function loadAll(onp){
    const keys = [...PHOTO, ...PAINTED], total = keys.length + BUTTERFLIES.length + 1; let done = 0;
    const tick = () => onp(++done / total);
    await Promise.all([
      ...keys.map(async k => {
        const img = await loadImg(path(k)); tick();
        if (!img) return;
        const i = flowers.push({ img, r:PAINTED.includes(k) ? img.width / 2.3 : Math.max(img.width, img.height) / 2.1 }) - 1;
        idx.all.push(i);
        if (PHOTO.includes(k)) idx.photo.push(i);
        if (ROSE.includes(k)) idx.rose.push(i);
        if (BIG.includes(k)) idx.big.push(i);
      }),
      (async () => {   // bông giữa: ảnh vuông, tâm hoa nằm đúng giữa ảnh nên xoay tròn đều
        const img = await loadImg(path(CENTER)); tick();
        if (img) idx.center = flowers.push({ img, r:img.width / 2.15 }) - 1;
      })(),
      ...BUTTERFLIES.map(async b => { const im = await loadImg(`assets/buom/${b.f}.webp`); tick(); if (im) bfImgs.push(Object.assign({ im }, b)); })
    ]);
  }
  function drawFlower(i, x, y, rad, rot, a){
    const f = flowers[i], k = rad / f.r, w = f.img.width * k, h = f.img.height * k, e = Math.max(w, h) * .71;
    if (x + e < 0 || y + e < 0 || x - e > W || y - e > H) return;          // ngoài màn hình thì bỏ qua
    g.setTransform(DPR, 0, 0, DPR, x * DPR, y * DPR); g.rotate(rot); g.globalAlpha = a;
    g.drawImage(f.img, -w / 2, -h / 2, w, h);
    g.setTransform(DPR, 0, 0, DPR, 0, 0); g.globalAlpha = 1;
  }

  /* ---------- tường hoa: các vòng tròn đồng tâm xoay ngược chiều nhau ---------- */
  function makeRings(cx, cy, seed){
    const R = rng(seed), rb = clamp(Math.max(W, H) / 9, 62, 160), s = rb * 1.15;
    const maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) + rb * .6;
    const any = list => list[Math.floor(R() * list.length)];
    const pick = () => { const r = R(); return r < .6 && idx.photo.length ? any(idx.photo) : r < .88 && idx.rose.length ? any(idx.rose) : any(idx.all); };
    const rings = [];
    for (let i = 0; i * s <= maxR + s; i++){
      const r = i * s, n = i ? Math.max(6, Math.round(TAU * r / (rb * 1.2))) : 1;
      const pat = R() < .5 ? [pick(), pick()] : [pick(), pick(), pick()];
      const ring = { i, r, w:(i % 2 ? -1 : 1) * (.06 + .025 * R()) * (i ? 1 : .6), a0:R() * TAU, items:[], fill:[] };
      const baseRot = R() * TAU;
      for (let k = 0; k < n; k++) ring.items.push({
        a:k * TAU / n + (R() - .5) * .12, rad:i ? rb * (.98 + R() * .3) : rb * 1.35,
        f:i ? pat[k % pat.length] : (c => idx.center >= 0 ? idx.center : c)(any(idx.big.length ? idx.big : idx.all)),
        rot:baseRot + k * TAU / n, spin:i ? (R() - .5) * .25 : .7, dr:(R() - .5) * s * .14, j:R()   // bông giữa xoay đều ~9 giây một vòng
      });
      if (i){
        const m = Math.max(5, Math.round(TAU * (r - s / 2) / (rb * .8))), fp = [pick(), pick()];
        for (let k = 0; k < m; k++) ring.fill.push({ a:(k + .5) * TAU / m, rad:rb * (.55 + R() * .15), f:fp[k % 2], rot:R() * TAU, spin:(R() - .5) * .3, dr:0, j:R() });
      }
      rings.push(ring);
    }
    return { cx, cy, rings, s, maxR };
  }
  // opt(ring, item, x, y, isFill, angle) → { x, y, s, a } hoặc null để ẩn
  function drawRings(L, T, opt){
    const one = (ring, it, isFill) => {
      const r = isFill ? ring.r - L.s / 2 : ring.r + it.dr, ang = it.a + ring.a0 + ring.w * T;
      const st = opt(ring, it, L.cx + Math.cos(ang) * r, L.cy + Math.sin(ang) * r, isFill, ang);
      if (st && st.s > 0 && st.a > 0) drawFlower(it.f, st.x, st.y, it.rad * st.s, it.rot + it.spin * T + ring.w * T, st.a);
    };
    for (let ri = L.rings.length - 1; ri >= 0; ri--) for (const it of L.rings[ri].fill) one(L.rings[ri], it, true);
    for (let ri = L.rings.length - 1; ri >= 0; ri--) for (const it of L.rings[ri].items) one(L.rings[ri], it, false);
  }
  function pushOut(L, x0, y0, ang, q){
    const dx = x0 - L.cx, dy = y0 - L.cy, d = Math.hypot(dx, dy), p = q * L.maxR * .9;
    return { x:x0 + (d > 1 ? dx / d : Math.cos(ang)) * p, y:y0 + (d > 1 ? dy / d : Math.sin(ang)) * p };
  }
  const baseFill = a => { if (a <= 0) return; g.globalAlpha = a; g.fillStyle = isDark() ? '#3a2433' : '#f6dfe4'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; };

  /* ---------- bướm ---------- */
  let BF = [], bfLeaving = false, bfBag = [];
  const pickBF = () => {   // xáo đều để đợt nào cũng đủ tím / vàng / xanh, bướm xoè cánh xuất hiện nhiều hơn
    if (!bfBag.length){
      bfBag = bfImgs.flatMap(b => b.top ? [b, b] : [b]);
      for (let i = bfBag.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [bfBag[i], bfBag[j]] = [bfBag[j], bfBag[i]]; }
    }
    return bfBag.pop();
  };
  function spawnBF(n){
    if (!bfImgs.length || reduce()) return;
    bfLeaving = false;
    const k = Math.min(W, H) / 700 + .45, now = performance.now();
    for (let i = 0; i < n; i++){
      const m = pickBF();
      BF.push({ m, x:Math.random() * W, y:Math.random() * H, a:Math.random() * TAU, sp:(50 + Math.random() * 50) * k,
        s:(15 + Math.random() * 14) * k * (m.top ? 1 : .9), ph:Math.random() * TAU, fl:11 + Math.random() * 5, born:now + i * 140 });
    }
  }
  const wingOpen = ph => Math.pow(.5 + .5 * Math.sin(ph), .75);     // 1 = xoè hết, 0 = khép
  function drawBF(b, t, alpha){
    const { m } = b, im = m.im, iw = im.width, ih = im.height, ph = t * b.fl + b.ph, o = wingOpen(ph);
    g.save(); g.translate(b.x, b.y - Math.cos(ph) * b.s * .07); g.globalAlpha = alpha;
    if (m.top){
      // nhìn từ trên: tách hai cánh ở thân, mỗi cánh co lại quanh thân như đang gập lên
      const w = b.s * 2.7, h = w * ih / iw, sx = m.ax * iw, kx = .1 + .9 * o, lw = m.ax * w, y0 = -h * .58;
      g.rotate(b.a + Math.PI / 2 + Math.sin(t * .9 + b.ph) * .12);
      g.drawImage(im, 0, 0, sx, ih, -lw * kx, y0, lw * kx, h);
      g.drawImage(im, sx, 0, iw - sx, ih, 0, y0, (w - lw) * kx, h);
      const bs = iw * .028, bw = w * .028;                                 // thân giữ nguyên độ rộng
      g.drawImage(im, sx - bs, 0, bs * 2, ih, -bw, y0, bw * 2, h);
    } else {
      // nhìn ngang: cánh khép mở quanh gốc cánh, đầu quay theo hướng bay
      const w = b.s * 2.5, h = w * ih / iw, dir = Math.cos(b.a) >= 0 ? 1 : -1;
      g.rotate(Math.sin(b.a) * .3 * dir);
      g.scale(dir * m.face, 1);
      g.scale(1 + (1 - o) * .06, .3 + .7 * o);
      g.drawImage(im, -m.ax * w, -m.ay * h, w, h);
    }
    g.restore();
  }
  function updBF(dt, t, now){
    for (let i = BF.length - 1; i >= 0; i--){
      const b = BF[i];
      if (now < b.born) continue;
      if (bfLeaving){ b.a += angDiff(-Math.PI / 2 + (b.x > W / 2 ? .5 : -.5), b.a) * Math.min(1, dt * 2); b.sp *= 1 + dt * .8; }
      else {
        b.a += Math.sin(t * .9 + b.ph) * dt * 1.4;
        if (b.x < 30 || b.x > W - 30 || b.y < 30 || b.y > H - 30) b.a += angDiff(Math.atan2(H / 2 - b.y, W / 2 - b.x), b.a) * Math.min(1, dt * 2.5);
      }
      b.x += Math.cos(b.a) * b.sp * dt; b.y += Math.sin(b.a) * b.sp * dt;
      if (bfLeaving && (b.y < -90 || b.x < -90 || b.x > W + 90)){ BF.splice(i, 1); continue; }
      drawBF(b, t, clamp((now - b.born) / 600));
    }
  }

  /* ---------- các màn ---------- */
  let stage = 'loading', running = true, lastF = 0;
  let L1 = null, wallT0 = 0, envShown = false, TX = 4.4, envQueued = false;   // TX: lúc tường hoa tản ra
  let L2 = null, burstT0 = 0, scT0 = 0, origin = null, envHidden = false;

  function startWall(){
    stage = 'wall'; $('sLoad').classList.remove('on');
    L1 = makeRings(W / 2, H / 2, 21); wallT0 = performance.now();
    spawnBF(phone() ? 9 : 12);
  }
  function drawWall(now){
    const T = (now - wallT0) / 1000;
    baseFill(T < TX ? clamp((T - .3) / 1) : 1 - clamp((T - TX - .3) / .8));
    if (!envShown && T > 1.6){ envShown = true; $('sEnv').classList.add('on'); }
    if (T > TX) bfLeaving = true;
    drawRings(L1, T, (ring, it, x, y, isFill, ang) => {
      let s = easeBack(clamp((T - (ring.i * .13 + it.j * .12 + (isFill ? .12 : 0))) / .7)), a = 1;
      if (s <= 0) return null;
      if (T > TX){
        const q = easeIn(clamp((T - TX - ring.i * .06 - it.j * .12) / .85));
        if (q >= 1) return null;
        ({ x, y } = pushOut(L1, x, y, ang, q)); s *= 1 + q * .5; a = 1 - q;
      }
      return { x, y, s, a };
    });
    if (T > TX + (envQueued ? 1.45 : 2.3)){ stage = 'env'; L1 = null; if (envQueued) openEnv(); }
  }
  function openEnv(){
    stage = 'opening'; envBtn.classList.add('open');
    setTimeout(startBurst, reduce() ? 50 : 750);
  }
  // chạm phong bì khi tường hoa còn đang hiện: hoa tản ra ngay rồi mở luôn
  envBtn.addEventListener('click', () => {
    if (stage === 'env') openEnv();
    else if (stage === 'wall' && !envQueued){ envQueued = true; TX = Math.min(TX, Math.max((performance.now() - wallT0) / 1000, 1.9)); }
  });
  function startBurst(){
    const r = envBtn.getBoundingClientRect();
    origin = { x:r.left + r.width / 2, y:r.top + r.height * .3 };
    L2 = makeRings(W / 2, H / 2, 77); burstT0 = performance.now(); stage = 'burst';
    spawnBF(phone() ? 8 : 10);
  }
  function drawBurst(now){
    const T = (now - burstT0) / 1000, Ts = stage === 'scatter' ? (now - scT0) / 1000 : 0;
    baseFill(stage === 'scatter' ? 1 - clamp(Ts / .7) : clamp((T - 1) / .8));
    if (!envHidden && T > 1.4){ envHidden = true; $('sEnv').classList.remove('on'); window.Gift.showBook(); }
    drawRings(L2, T, (ring, it, x0, y0, isFill, ang) => {
      const p = easeOut(clamp((T - (ring.i * .1 + it.j * .18 + (isFill ? .15 : 0))) / 1.05));
      if (p <= 0) return null;
      let x = lerp(origin.x, x0, p), y = lerp(origin.y, y0, p), s = lerp(.12, 1, p), a = clamp(p * 4);
      if (stage === 'cover') s *= 1 + .025 * Math.sin(T * 1.4 + it.j * 6);
      if (stage === 'scatter'){
        const q = easeIn(clamp((Ts - ring.i * .05 - it.j * .1) / .8));
        if (q >= 1) return null;
        ({ x, y } = pushOut(L2, x, y, ang, q)); s *= 1 + q * .5; a *= 1 - q;
      }
      return { x, y, s, a };
    });
    if (stage === 'burst' && T > L2.rings.length * .1 + 1.48){
      stage = 'cover';
      setTimeout(() => { stage = 'scatter'; scT0 = performance.now(); bfLeaving = true; }, reduce() ? 300 : 1300);
    }
    if (stage === 'scatter' && Ts > 1.9) openBook();
  }
  function openBook(){
    stage = 'book'; running = false; BF = [];
    g.clearRect(0, 0, W, H); cv.style.display = 'none';
    window.Gift.openBook();
  }

  function frame(now){
    if (!running) return;
    const dt = Math.min(.05, lastF ? (now - lastF) / 1000 : 0), t = now / 1000;
    lastF = now;
    g.clearRect(0, 0, W, H);
    if (stage === 'wall') drawWall(now);
    else if (stage === 'burst' || stage === 'cover' || stage === 'scatter') drawBurst(now);
    if (BF.length) updBF(dt, t, now);
    requestAnimationFrame(frame);
  }

  async function boot(){
    if (location.hash === '#so'){                      // link…/#so: bỏ qua mở đầu, vào thẳng cuốn sổ (để xem thử)
      $('sLoad').classList.remove('on'); running = false; cv.style.display = 'none';
      window.Gift.showBook(); window.Gift.openBook(); return;
    }
    const bar = $('ldBar'), setP = p => { bar.style.width = Math.round(p * 100) + '%'; };
    size(); setP(.06);
    await loadAll(p => setP(.06 + p * .82));
    await Promise.race([document.fonts ? document.fonts.ready : null, new Promise(r => setTimeout(r, 2500))]);
    setP(1);
    await new Promise(r => setTimeout(r, reduce() ? 0 : 450));
    startWall();
  }
  addEventListener('resize', size);
  requestAnimationFrame(frame);
  boot();
})();
