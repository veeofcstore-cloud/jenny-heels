/* ============================================
   LOVEE JENI HEELS – main.js  (clean rebuild)
   ============================================ */

'use strict';

/* ════════════════════════════════════════════
   CONFIG — JANGAN UBAH KECUALI DIPERLUKAN
   ════════════════════════════════════════════ */
var WA_NUMBER        = '628161318281';
var PRICE_PER        = 105000;

var EJS_PUBLIC_KEY   = 'YBhKMzK9VBIn1p3Se';
var EJS_SERVICE_ID   = 'service_lovee999';
var EJS_TEMPLATE_ID  = 'template_r57sw0p';
var EJS_TO_EMAIL     = 'vee.ofc.store@gmail.com';

/* ════════════════════════════════════════════
   INIT EMAILJS — polling sampai SDK siap
   ════════════════════════════════════════════ */
var _ejsInit = false;
function tryInitEJS() {
  if (typeof emailjs !== 'undefined' && !_ejsInit) {
    emailjs.init({ publicKey: EJS_PUBLIC_KEY });
    _ejsInit = true;
  } else if (!_ejsInit) {
    setTimeout(tryInitEJS, 300);
  }
}
setTimeout(tryInitEJS, 600);

/* ════════════════════════════════════════════
   META PIXEL helper
   ════════════════════════════════════════════ */
function px(event, data) {
  try { if (typeof fbq === 'function') fbq('track', event, data || {}); } catch(e) {}
}

/* ════════════════════════════════════════════
   NAVBAR scroll effect
   ════════════════════════════════════════════ */
window.addEventListener('scroll', function() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ════════════════════════════════════════════
   HERO PARALLAX (desktop only)
   ════════════════════════════════════════════ */
window.addEventListener('scroll', function() {
  if (window.innerWidth < 601) return;
  var img = document.getElementById('heroImg');
  if (!img || window.scrollY > window.innerHeight) return;
  img.style.transform = 'translateY(' + (window.scrollY * 0.12) + 'px)';
}, { passive: true });

/* ════════════════════════════════════════════
   COLOR PICKER
   ════════════════════════════════════════════ */
var IMGS = {
  cream:   { webp: 'assets/product-cream.webp',   jpg: 'assets/product-cream.jpg',   label: 'Light Cream' },
  biscuit: { webp: 'assets/product-biscuit.webp', jpg: 'assets/product-biscuit.jpg', label: 'Biscuit' },
  black:   { webp: 'assets/product-black.webp',   jpg: 'assets/product-black.jpg',   label: 'Hitam' },
  detail:  { webp: 'assets/heel-detail.webp',     jpg: 'assets/heel-detail.jpg',     label: 'Detail Heel' },
};

function pickColor(btn) {
  document.querySelectorAll('.cpick').forEach(function(b) {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  swapMainImg(btn.dataset.c);
  var sel = document.getElementById('fwarna');
  if (sel && btn.dataset.l) sel.value = btn.dataset.l;
}

function pickThumb(el, color) {
  document.querySelectorAll('.thumb').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  swapMainImg(color);
}

function swapMainImg(color) {
  var data = IMGS[color];
  if (!data) return;
  var mainImg = document.getElementById('imgMain');
  var srcWebp = document.getElementById('srcWebp');
  var tag     = document.getElementById('colorTag');
  if (!mainImg) return;
  mainImg.style.opacity = '0';
  setTimeout(function() {
    if (srcWebp) srcWebp.srcset = data.webp;
    mainImg.src = data.jpg;
    mainImg.alt = 'LOVEE JENI Heels ' + data.label;
    if (tag) tag.textContent = data.label;
    mainImg.style.transition = 'opacity .25s ease';
    mainImg.style.opacity = '1';
  }, 140);
  document.querySelectorAll('.thumb').forEach(function(t) {
    t.classList.toggle('active', t.alt === data.label);
  });
}

/* Sync form warna select → color picker */
document.addEventListener('DOMContentLoaded', function() {
  var sel = document.getElementById('fwarna');
  if (!sel) return;
  var MAP = { 'Light Cream': 'cream', 'Biscuit': 'biscuit', 'Hitam': 'black' };
  sel.addEventListener('change', function() {
    var c = MAP[this.value];
    if (!c) return;
    var btn = document.querySelector('.cpick[data-c="' + c + '"]');
    if (btn) pickColor(btn);
  });
});

/* ════════════════════════════════════════════
   QTY CONTROL
   ════════════════════════════════════════════ */
function chQty(delta) {
  var inp = document.getElementById('qty');
  if (!inp) return;
  var v = (parseInt(inp.value) || 1) + delta;
  v = Math.max(1, Math.min(10, v));
  inp.value = v;
  updateTotal();
}

function updateTotal() {
  var q = parseInt(document.getElementById('qty') && document.getElementById('qty').value) || 1;
  var fmt = function(n) { return 'Rp ' + n.toLocaleString('id-ID'); };
  var tH = document.getElementById('tHarga');
  var tF = document.getElementById('tFinal');
  if (tH) tH.textContent = fmt(q * PRICE_PER);
  if (tF) tF.textContent = fmt(q * PRICE_PER);
}

/* ════════════════════════════════════════════
   EKSPEDISI LOGO PICKER
   ════════════════════════════════════════════ */
function pickEksp(btn) {
  document.querySelectorAll('.eksp-card').forEach(function(c) { c.classList.remove('active'); });
  btn.classList.add('active');
  var h = document.getElementById('ekspedisiVal');
  if (h) h.value = btn.dataset.val;
}

/* ════════════════════════════════════════════
   PAYMENT LOGO PICKER
   ════════════════════════════════════════════ */
function pickPay(btn) {
  document.querySelectorAll('.pay-logo-btn').forEach(function(b) {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');

  var type = btn.dataset.pay;
  var panels = { bca: 'payInfoBCA', bsi: 'payInfoBSI', gopay: 'payInfoGopay' };

  Object.keys(panels).forEach(function(t) {
    var el = document.getElementById(panels[t]);
    if (!el) return;
    if (t === type) {
      el.classList.remove('hidden');
      el.style.animation = 'payFadeIn .25s ease';
    } else {
      el.classList.add('hidden');
    }
  });

  var inp = document.getElementById('payVal');
  if (inp) inp.value = type;
}

/* ════════════════════════════════════════════
   COPY NUMBER
   ════════════════════════════════════════════ */
function copyNum(text, btn) {
  var orig = btn.textContent;
  var done = function() {
    btn.textContent = '✓ Tersalin!';
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--dark)';
    setTimeout(function() {
      btn.textContent = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(done).catch(function() {
      fallbackCopy(text); done();
    });
  } else {
    fallbackCopy(text); done();
  }
}
function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
}

/* ════════════════════════════════════════════
   SUBMIT ORDER → WA + EMAIL BACKUP
   ════════════════════════════════════════════ */
function submitOrder() {
  var g = function(id) { return document.getElementById(id); };

  var nama   = g('nama')   ? g('nama').value.trim()   : '';
  var wa     = g('wa')     ? g('wa').value.trim()     : '';
  var alamat = g('alamat') ? g('alamat').value.trim() : '';
  var warna  = g('fwarna') ? g('fwarna').value        : '';
  var ukuran = g('fukuran')? g('fukuran').value       : '';
  var qty    = parseInt(g('qty') ? g('qty').value : '1') || 1;
  var eksp   = g('ekspedisiVal') ? g('ekspedisiVal').value : 'JNE REG';
  var pay    = g('payVal')       ? g('payVal').value       : 'bca';

  var orderID   = 'JENI-' + Date.now().toString(36).toUpperCase();
  var orderTime = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  var PAY_LABEL = {
    bca:   'Transfer BCA — Rek. 6822029325 (Muhammad Kurniawan SE)',
    bsi:   'Transfer BSI — Rek. 7332718511 (Musdalifah Lestari)',
    gopay: 'GoPay — 0816-1318-281 (Muhammad Kurniawan)',
  };

  var errors = [];
  if (!nama)   errors.push('• Nama lengkap');
  if (!wa)     errors.push('• Nomor WhatsApp');
  if (!alamat) errors.push('• Alamat lengkap');
  if (!warna)  errors.push('• Warna produk');
  if (!ukuran) errors.push('• Ukuran sepatu');

  if (errors.length) {
    alert('Mohon lengkapi data berikut:\n\n' + errors.join('\n'));
    return;
  }

  var total = qty * PRICE_PER;
  var fmtRp = function(n) { return 'Rp ' + n.toLocaleString('id-ID'); };

  /* Pixel */
  px('Purchase', {
    value: total / 1000,
    currency: 'IDR',
    content_name: 'LOVEE JENI Heels',
    content_ids: ['JENI-' + warna.replace(/\s+/g, '-').toUpperCase()],
    content_type: 'product',
    num_items: qty,
  });

  /* Email backup — silent background */
  setTimeout(function() {
    if (!_ejsInit || typeof emailjs === 'undefined') return;
    emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, {
      to_email:   EJS_TO_EMAIL,
      order_id:   orderID,
      order_time: orderTime,
      nama:       nama,
      wa:         wa,
      alamat:     alamat,
      produk:     'LOVEE JENI Heels',
      warna:      warna,
      ukuran:     ukuran,
      qty:        String(qty),
      ekspedisi:  eksp,
      pembayaran: PAY_LABEL[pay],
      total:      fmtRp(total),
    }).then(
      function() { console.log('[LOVEE] Backup email sent ✅'); },
      function(e) { console.warn('[LOVEE] Email failed:', e); }
    );
  }, 400);

  /* WhatsApp */
  var msg = [
    'Halo LOVEE! Saya mau pesan:',
    '',
    '👠 *LOVEE JENI Heels*',
    '🎨 Warna    : ' + warna,
    '📏 Ukuran   : ' + ukuran,
    '📦 Qty      : ' + qty + ' pasang',
    '💰 Total    : ' + fmtRp(total) + ' (belum termasuk ongkir)',
    '🚚 Ekspedisi: ' + eksp,
    '💳 Bayar via: ' + PAY_LABEL[pay],
    '',
    '📋 *Data Penerima:*',
    'Nama   : ' + nama,
    'WA     : ' + wa,
    'Alamat : ' + alamat,
    '',
    'ID Order: ' + orderID,
    'Mohon konfirmasi ongkir & rekening ya. Terima kasih! 🙏'
  ].join('\n');

  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
}

/* ════════════════════════════════════════════
   VIDEO PLAYER
   ════════════════════════════════════════════ */
function playVideo() {
  var vid     = document.getElementById('promoVideo');
  var overlay = document.getElementById('videoOverlay');
  if (!vid) return;

  if (vid.paused) {
    vid.muted = false;
    var p = vid.play();
    if (p !== undefined) {
      p.catch(function() {
        vid.muted = true;
        vid.play();
      });
    }
    if (overlay) overlay.classList.add('hidden');
    px('ViewContent', { content_name: 'LOVEE JENI Heels — Video', content_type: 'product' });
  } else {
    vid.pause();
    if (overlay) overlay.classList.remove('hidden');
  }
}

/* Autoplay muted saat video masuk viewport */
document.addEventListener('DOMContentLoaded', function() {
  var vid = document.getElementById('promoVideo');
  if (!vid || !window.IntersectionObserver) return;

  var started = false;
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !started) {
        vid.muted = true;
        var p = vid.play();
        if (p !== undefined) {
          p.then(function() { started = true; }).catch(function() {});
        }
      } else if (!e.isIntersecting) {
        vid.pause();
        started = false;
      }
    });
  }, { threshold: 0.5 });

  obs.observe(vid);
});

/* ════════════════════════════════════════════
   COUNTDOWN TIMER
   ════════════════════════════════════════════ */
(function() {
  var ch = document.getElementById('ch');
  var cm = document.getElementById('cm');
  var cs = document.getElementById('cs');
  if (!ch) return;

  var KEY = 'lovee_cd_end';
  var end;
  try { end = parseInt(localStorage.getItem(KEY)) || 0; } catch(e) { end = 0; }
  if (!end || end < Date.now()) {
    end = Date.now() + 23 * 3600000 + 59 * 60000;
    try { localStorage.setItem(KEY, end); } catch(e) {}
  }

  function tick() {
    var diff = Math.max(0, end - Date.now());
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    ch.textContent = String(h).padStart(2, '0');
    cm.textContent = String(m).padStart(2, '0');
    cs.textContent = String(s).padStart(2, '0');
    if (diff === 0) {
      end = Date.now() + 23 * 3600000 + 59 * 60000;
      try { localStorage.setItem(KEY, end); } catch(e) {}
    }
  }
  tick();
  setInterval(tick, 1000);
})();

/* ════════════════════════════════════════════
   STOCK COUNTER (urgency cosmetic)
   ════════════════════════════════════════════ */
(function() {
  var el  = document.getElementById('stockNum');
  var el2 = document.getElementById('bannerStock');
  if (!el) return;
  var n = 14;
  setInterval(function() {
    if (n > 3 && Math.random() < 0.04) {
      n--;
      el.textContent  = n;
      if (el2) el2.textContent = n;
    }
  }, 7500);
})();

/* ════════════════════════════════════════════
   SOCIAL PROOF POPUP
   ════════════════════════════════════════════ */
(function() {
  var popup  = document.getElementById('spPopup');
  var textEl = document.getElementById('spText');
  if (!popup || !textEl) return;

  var proofs = [
    'Aulia dari Jakarta baru memesan Biscuit ukuran 38',
    'Sinta dari Bandung baru memesan Light Cream ukuran 37',
    'Dewi dari Surabaya baru memesan Hitam ukuran 39',
    'Rani dari Medan baru memesan Biscuit ukuran 36',
    'Maya dari Yogyakarta baru memesan Light Cream ukuran 38',
    'Lina dari Semarang baru memesan Hitam ukuran 40',
    'Fitri dari Makassar baru memesan Biscuit ukuran 37',
    'Nadia dari Depok baru memesan Light Cream ukuran 39',
  ];
  var idx = 0;

  function showProof() {
    textEl.textContent = proofs[idx % proofs.length];
    popup.classList.add('show');
    idx++;
    setTimeout(function() { popup.classList.remove('show'); }, 5000);
  }

  setTimeout(function() {
    showProof();
    setInterval(showProof, 25000);
  }, 6000);
})();

/* ════════════════════════════════════════════
   STICKY MOBILE CTA
   ════════════════════════════════════════════ */
(function() {
  var cta   = document.getElementById('stickyCta');
  var hero  = document.getElementById('top');
  var order = document.getElementById('order');
  if (!cta || !hero) return;
  if (window.matchMedia('(min-width:901px)').matches) return;

  document.body.classList.add('has-sticky');

  var obsHero = new IntersectionObserver(function(entries) {
    cta.classList.toggle('visible', !entries[0].isIntersecting);
  }, { threshold: 0.1 });
  obsHero.observe(hero);

  if (order) {
    var obsOrder = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) cta.classList.remove('visible');
    }, { threshold: 0.2 });
    obsOrder.observe(order);
  }
})();

/* ════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  var items = document.querySelectorAll('.feat,.occ,.tcard,.faq__item,.section-title,.eyebrow,.section-desc');
  items.forEach(function(el, i) {
    el.classList.add('reveal');
    var mod = i % 3;
    if (mod === 1) el.classList.add('rv1');
    if (mod === 2) el.classList.add('rv2');
  });

  if (!window.IntersectionObserver) {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
});
