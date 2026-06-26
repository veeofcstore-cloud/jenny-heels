/* ============================================
   LOVEE JENI HEELS – main.js
   Deferred · Lean · No dependencies
   ============================================ */

'use strict';

/* ════════════════════════════════════════════════
   ██████  CONFIG — ISI DI SINI
   ════════════════════════════════════════════════
   Langkah:
   1. Daftar di https://emailjs.com (gratis)
   2. Tambah Gmail Service → catat Service ID
   3. Buat Template → catat Template ID
   4. Dashboard → Account → catat Public Key
   5. Paste ketiga nilai di bawah ini
   ════════════════════════════════════════════════ */

const WA_NUMBER = '628161318281';   // Nomor WA bisnis (jangan diubah)
const PRICE_PER = 105000;           // Harga per pasang (jangan diubah)

/* ── EMAILJS CONFIG ── */
const EMAILJS_PUBLIC_KEY   = 'YBhKMzK9VBIn1p3Se';     // contoh: 'abc123XYZxyz'
const EMAILJS_SERVICE_ID   = 'service_lovee999';     // contoh: 'service_abc123'
const EMAILJS_TEMPLATE_ID  = 'template_r57sw0p';    // contoh: 'template_xyz789'
const EMAILJS_TO           = 'vee.ofc.store@gmail.com';       // email tujuan backup

/* ── Init EmailJS saat SDK siap ── */
(function initEmailJS() {
  const tryInit = () => {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      console.log('[LOVEE] EmailJS ready ✅');
    } else {
      setTimeout(tryInit, 200); // coba lagi setiap 200ms sampai SDK load
    }
  };
  setTimeout(tryInit, 500);
})();

/* ── META PIXEL shorthand ── */
function px(event, data) {
  if (typeof fbq === 'function') fbq('track', event, data || {});
}

/* ══════════════════════════════════
   NAVBAR – scroll class
══════════════════════════════════ */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
})();

/* ══════════════════════════════════
   HERO PARALLAX (desktop only, passive)
══════════════════════════════════ */
(function () {
  const img = document.getElementById('heroImg');
  if (!img || window.matchMedia('(max-width:600px)').matches) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      img.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════
   COLOR PICKER
══════════════════════════════════ */
const IMGS = {
  cream:   { webp: 'assets/product-cream.webp',   jpg: 'assets/product-cream.jpg',   label: 'Light Cream' },
  biscuit: { webp: 'assets/product-biscuit.webp', jpg: 'assets/product-biscuit.jpg', label: 'Biscuit' },
  black:   { webp: 'assets/product-black.webp',   jpg: 'assets/product-black.jpg',   label: 'Hitam' },
  detail:  { webp: 'assets/heel-detail.webp',     jpg: 'assets/heel-detail.jpg',     label: 'Detail Heel' },
};

function pickColor(btn) {
  document.querySelectorAll('.cpick').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  const c = btn.dataset.c;
  swapMainImg(c);

  // Sync warna select di form
  const sel = document.getElementById('fwarna');
  if (sel && btn.dataset.l) sel.value = btn.dataset.l;
}

function pickThumb(el, color) {
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  swapMainImg(color);
}

function swapMainImg(color) {
  const data = IMGS[color];
  if (!data) return;
  const mainImg  = document.getElementById('imgMain');
  const srcWebp  = document.getElementById('srcWebp');
  const tag      = document.getElementById('colorTag');

  mainImg.style.opacity = '0';
  setTimeout(() => {
    if (srcWebp) srcWebp.srcset = data.webp;
    mainImg.src = data.jpg;
    mainImg.alt = 'LOVEE JENI Heels ' + data.label;
    if (tag) tag.textContent = data.label;
    mainImg.style.opacity = '1';
    mainImg.style.transition = 'opacity .25s ease';
  }, 140);

  // Sync thumb highlight
  document.querySelectorAll('.thumb').forEach(t => {
    t.classList.toggle('active', t.alt === data.label);
  });
}

/* ══════════════════════════════════
   FORM SYNC – warna select ↔ color picker
══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('fwarna');
  if (!sel) return;
  const MAP = { 'Light Cream': 'cream', 'Biscuit': 'biscuit', 'Hitam': 'black' };
  sel.addEventListener('change', function () {
    const c = MAP[this.value];
    if (!c) return;
    const btn = document.querySelector(`.cpick[data-c="${c}"]`);
    if (btn) pickColor(btn);
  });
});

/* ══════════════════════════════════
   QTY CONTROL
══════════════════════════════════ */
function chQty(delta) {
  const inp = document.getElementById('qty');
  let v = (parseInt(inp.value) || 1) + delta;
  v = Math.max(1, Math.min(10, v));
  inp.value = v;
  updateTotal();
}

function updateTotal() {
  const q   = parseInt(document.getElementById('qty')?.value) || 1;
  const fmt = n => 'Rp ' + n.toLocaleString('id-ID');
  const tH  = document.getElementById('tHarga');
  const tF  = document.getElementById('tFinal');
  if (tH) tH.textContent = fmt(q * PRICE_PER);
  if (tF) tF.textContent = fmt(q * PRICE_PER);
}

/* ══════════════════════════════════
   PAYMENT TAB SWITCHER
══════════════════════════════════ */
/* ══════════════════════════════════
   PAYMENT LOGO PICKER (unified)
══════════════════════════════════ */
function pickPay(btn) {
  // Update button states
  document.querySelectorAll('.pay-logo-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  const type = btn.dataset.pay;

  // Show correct info panel with smooth transition
  const panels = { bca: 'payInfoBCA', bsi: 'payInfoBSI', gopay: 'payInfoGopay' };
  Object.keys(panels).forEach(t => {
    const el = document.getElementById(panels[t]);
    if (!el) return;
    if (t === type) {
      el.classList.remove('hidden');
      el.style.animation = 'payFadeIn .25s ease';
    } else {
      el.classList.add('hidden');
    }
  });

  // Update hidden input for WA message
  const inp = document.getElementById('payVal');
  if (inp) inp.value = type;
}

// Keep showPay as alias for backward compat
function showPay(type) { 
  const btn = document.querySelector(\`.pay-logo-btn[data-pay="\${type}"]\`);
  if (btn) pickPay(btn);
}

/* ══════════════════════════════════
   COPY NUMBER
══════════════════════════════════ */
function copyNum(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Tersalin!';
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--dark)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✓ Tersalin!';
    setTimeout(() => btn.textContent = 'Salin', 2000);
  });
}

/* ══════════════════════════════════
   ORDER SUBMIT → WhatsApp
══════════════════════════════════ */
function submitOrder() {
  const g  = id => document.getElementById(id);
  const nama    = g('nama')?.value.trim();
  const wa      = g('wa')?.value.trim();
  const alamat  = g('alamat')?.value.trim();
  const warna   = g('fwarna')?.value;
  const ukuran  = g('fukuran')?.value;
  const qty     = parseInt(g('qty')?.value) || 1;
  const eksp    = document.getElementById('ekspedisiVal')?.value || 'JNE REG';
  const pay     = document.getElementById('payVal')?.value || 'bca';
  const orderID = 'JENI-' + Date.now().toString(36).toUpperCase();
  const orderTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const PAY_LABEL = {
    bca:   'Transfer BCA — Rek. 6822029325 (Muhammad Kurniawan SE)',
    bsi:   'Transfer BSI — Rek. 7332718511 (Musdalifah Lestari)',
    gopay: 'GoPay — 0816-1318-281 (Muhammad Kurniawan)',
  };

  // ── VALIDASI ─────────────────────────────────────────
  const errors = [];
  if (!nama)   errors.push('• Nama lengkap');
  if (!wa)     errors.push('• Nomor WhatsApp');
  if (!alamat) errors.push('• Alamat lengkap');
  if (!warna)  errors.push('• Warna produk');
  if (!ukuran) errors.push('• Ukuran sepatu');

  if (errors.length) {
    alert('Mohon lengkapi data berikut:\n\n' + errors.join('\n'));
    return;
  }

  const total  = qty * PRICE_PER;
  const fmtRp  = n => 'Rp ' + n.toLocaleString('id-ID');

  // ── PIXEL PURCHASE ────────────────────────────────────
  px('Purchase', {
    value: total / 1000,
    currency: 'IDR',
    content_name: 'LOVEE JENI Heels',
    content_ids: ['JENI-' + warna.replace(/\s+/, '-').toUpperCase()],
    content_type: 'product',
    num_items: qty,
  });

  // ── BACKUP EMAIL via EmailJS ──────────────────────────
  // Dikirim silent di background — tidak mengganggu alur order
  sendOrderEmail({
    order_id:    orderID,
    order_time:  orderTime,
    nama, wa, alamat, warna, ukuran,
    qty:         String(qty),
    ekspedisi:   eksp,
    pembayaran:  PAY_LABEL[pay],
    total:       fmtRp(total),
  });

  // ── BUKA WHATSAPP ─────────────────────────────────────
  const msg =
`Halo LOVEE! Saya mau pesan:

👠 *LOVEE JENI Heels*
🎨 Warna    : ${warna}
📏 Ukuran   : ${ukuran}
📦 Qty      : ${qty} pasang
💰 Total    : ${fmtRp(total)} (belum termasuk ongkir)
🚚 Ekspedisi: ${eksp}
💳 Bayar via: ${PAY_LABEL[pay]}

📋 *Data Penerima:*
Nama   : ${nama}
WA     : ${wa}
Alamat : ${alamat}

ID Order: ${orderID}
Mohon konfirmasi rekening / info ongkir ya. Terima kasih! 🙏`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ══════════════════════════════════
   EMAILJS — BACKUP ORDER
   Kirim data order ke vee.ofc.store@gmail.com
   silent di background (tidak block WA redirect)
══════════════════════════════════ */
function sendOrderEmail(params) {
  // Pastikan EmailJS sudah siap
  const send = () => {
    if (typeof emailjs === 'undefined') return; // SDK belum load, skip

    emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email:   EMAILJS_TO,
        order_id:   params.order_id,
        order_time: params.order_time,
        nama:       params.nama,
        wa:         params.wa,
        alamat:     params.alamat,
        produk:     'LOVEE JENI Heels',
        warna:      params.warna,
        ukuran:     params.ukuran,
        qty:        params.qty,
        ekspedisi:  params.ekspedisi,
        pembayaran: params.pembayaran,
        total:      params.total,
      }
    ).then(
      () => console.log('[LOVEE] Order backup email sent ✅'),
      (err) => console.warn('[LOVEE] Email backup failed:', err)
    );
  };

  // Delay 300ms agar tidak mengganggu WA redirect
  setTimeout(send, 300);
}

/* ══════════════════════════════════
   COUNTDOWN TIMER
══════════════════════════════════ */
(function () {
  const ch = document.getElementById('ch');
  const cm = document.getElementById('cm');
  const cs = document.getElementById('cs');
  if (!ch) return;

  const KEY = 'lovee_cd_end';
  let end = parseInt(localStorage.getItem(KEY)) || 0;
  if (!end || end < Date.now()) {
    end = Date.now() + 23 * 3600000 + 59 * 60000;
    localStorage.setItem(KEY, end);
  }

  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    ch.textContent = String(h).padStart(2, '0');
    cm.textContent = String(m).padStart(2, '0');
    cs.textContent = String(s).padStart(2, '0');
    if (diff === 0) {
      end = Date.now() + 23 * 3600000 + 59 * 60000;
      localStorage.setItem(KEY, end);
    }
  }
  tick();
  setInterval(tick, 1000);
})();

/* ══════════════════════════════════
   STOCK COUNTER (cosmetic urgency)
══════════════════════════════════ */
(function () {
  const el = document.getElementById('stockNum');
  if (!el) return;
  let n = 14;
  setInterval(() => {
    if (n > 3 && Math.random() < 0.04) {
      el.textContent = --n;
    }
  }, 7500);
})();

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
(function () {
  const items = document.querySelectorAll(
    '.feat, .occ, .tcard, .faq__item, .section-title, .eyebrow, .section-desc'
  );
  items.forEach((el, i) => {
    el.classList.add('reveal');
    const mod = i % 3;
    if (mod === 1) el.classList.add('rv1');
    if (mod === 2) el.classList.add('rv2');
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════
   SOCIAL PROOF POPUP
══════════════════════════════════ */
(function () {
  const popup = document.getElementById('spPopup');
  const textEl = document.getElementById('spText');
  if (!popup || !textEl) return;

  const proofs = [
    'Aulia dari Jakarta baru memesan Biscuit ukuran 38',
    'Sinta dari Bandung baru memesan Light Cream ukuran 37',
    'Dewi dari Surabaya baru memesan Hitam ukuran 39',
    'Rani dari Medan baru memesan Biscuit ukuran 36',
    'Maya dari Yogyakarta baru memesan Light Cream ukuran 38',
    'Lina dari Semarang baru memesan Hitam ukuran 40',
    'Fitri dari Makassar baru memesan Biscuit ukuran 37',
    'Nadia dari Depok baru memesan Light Cream ukuran 39',
  ];

  let idx = 0;
  function showProof() {
    textEl.textContent = proofs[idx % proofs.length];
    popup.classList.add('show');
    setTimeout(() => { popup.classList.remove('show'); }, 5000);
    idx++;
  }

  // First popup after 8s, then every 25s
  setTimeout(() => {
    showProof();
    setInterval(showProof, 25000);
  }, 6000);
})();

/* ══════════════════════════════════
   SYNC BANNER STOCK WITH HERO STOCK
══════════════════════════════════ */
(function () {
  const heroEl  = document.getElementById('stockNum');
  const bannerEl = document.getElementById('bannerStock');
  if (!heroEl || !bannerEl) return;
  const obs = new MutationObserver(() => {
    bannerEl.textContent = heroEl.textContent;
  });
  obs.observe(heroEl, { childList: true });
})();

/* ══════════════════════════════════
   VIDEO PLAYER
══════════════════════════════════ */
function playVideo() {
  const vid     = document.getElementById('promoVideo');
  const overlay = document.getElementById('videoOverlay');
  if (!vid) return;

  if (vid.paused) {
    vid.muted = false;  // unmute on explicit play
    vid.play().catch(() => {
      vid.muted = true;
      vid.play();       // fallback: play muted if autoplay blocked
    });
    overlay.classList.add('hidden');
    // Pixel: video viewed = high-intent signal
    px('ViewContent', {
      content_name: 'LOVEE JENI Heels — Video',
      content_type: 'product',
    });
  } else {
    vid.pause();
    overlay.classList.remove('hidden');
  }
}

// Autoplay muted when video enters viewport (silent background loop)
(function () {
  const vid = document.getElementById('promoVideo');
  if (!vid) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        vid.muted = true;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, { threshold: 0.4 });
  obs.observe(vid);
})();

/* ══════════════════════════════════
   STICKY MOBILE CTA
══════════════════════════════════ */
(function () {
  const cta  = document.getElementById('stickyCta');
  const hero = document.getElementById('top');
  if (!cta || !hero) return;

  // Only on mobile
  if (window.matchMedia('(min-width:901px)').matches) return;

  document.body.classList.add('has-sticky');

  const obs = new IntersectionObserver(entries => {
    const heroGone = !entries[0].isIntersecting;
    cta.classList.toggle('visible', heroGone);
    cta.setAttribute('aria-hidden', heroGone ? 'false' : 'true');
  }, { threshold: 0.1 });

  obs.observe(hero);

  // Hide when user reaches order form (they don't need the CTA anymore)
  const orderSection = document.getElementById('order');
  if (orderSection) {
    const obsOrder = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        cta.classList.remove('visible');
      }
    }, { threshold: 0.2 });
    obsOrder.observe(orderSection);
  }
})();

/* ══════════════════════════════════
   EKSPEDISI LOGO PICKER
══════════════════════════════════ */
function pickEksp(btn) {
  document.querySelectorAll('.eksp-card').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const hiddenInput = document.getElementById('ekspedisiVal');
  if (hiddenInput) hiddenInput.value = btn.dataset.val;
}
