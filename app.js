(() => {
  const releases = Array.isArray(window.CYNS_RELEASES) ? window.CYNS_RELEASES : [];
  const intro = document.getElementById('intro');
  const handle = document.getElementById('handle');
  const dropBall = document.getElementById('dropBall');
  const turnButton = document.getElementById('turnButton');
  const modal = document.getElementById('modalOverlay');
  const modalPanel = document.getElementById('modalPanel');
  const modalContent = document.getElementById('modalContent');
  const modalKicker = document.getElementById('modalKicker');
  const releaseList = document.getElementById('releaseList');
  const aboutButton = document.getElementById('aboutButton');
  let running = false;
  let activeId = null;

  // Preserve v3.5.3 opening animation timing.
  requestAnimationFrame(() => {
    setTimeout(() => intro.classList.add('is-running'), 70);
    setTimeout(() => intro.classList.add('is-done'), 565);
  });

  const escapeHtml = (value='') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const openedKey = id => `cyns:release:v1:${id}:opened`;
  const isOpened = id => localStorage.getItem(openedKey(id)) === '1';
  const setOpened = id => localStorage.setItem(openedKey(id), '1');
  const published = () => releases.filter(r => r.published);
  const future = () => releases.filter(r => !r.published);

  function dateValue(r){
    const raw = String(r.sortDate || r.dateLabel || '').trim().replace(/\./g,'-');
    const normalized = /^\d{4}-\d{2}$/.test(raw) ? `${raw}-01` : raw;
    const t = Date.parse(normalized);
    return Number.isFinite(t) ? t : 0;
  }

  const publishedNewest = () => published().slice().sort((a,b) => dateValue(b) - dateValue(a));
  const futureNearest = () => future().slice().sort((a,b) => dateValue(a) - dateValue(b));

  function uniqueById(items){
    const seen = new Set();
    return items.filter(item => {
      if(!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  function releaseCardHtml(r, mode='released'){
    const isNext = mode === 'next';
    const image = r.thumbnail
      ? `<img src="${escapeHtml(r.thumbnail)}" alt="${escapeHtml(r.thumbnailAlt || r.title || r.name || '')}">`
      : `<div class="release-thumb-fallback" aria-hidden="true"><span>${escapeHtml(r.dateLabel || '')}</span><strong>${escapeHtml(r.name || r.title || 'INFORMATION')}</strong></div>`;

    return `
      <button
        class="release-card${isNext ? ' is-next' : ''}"
        type="button"
        data-release-id="${escapeHtml(r.id)}"
        ${isNext ? 'disabled aria-disabled="true"' : ''}
        aria-label="${escapeHtml(`${r.dateLabel || ''} ${r.name || r.title || ''} ${isNext ? 'NEXT' : 'OPEN'}`.trim())}"
      >
        <span class="release-thumb">${image}</span>
        <span class="release-card-status">${isNext ? 'NEXT' : 'OPEN'}</span>
        ${r.pinned && !isNext ? '<span class="release-card-pin" aria-label="Pinned">PIN</span>' : ''}
      </button>`;
  }

  function firstReleasePanel(){
    const pub = publishedNewest();
    const next = futureNearest()[0] || null;
    const pinned = pub
      .filter(r => r.pinned)
      .sort((a,b) => (Number(a.pinOrder)||999) - (Number(b.pinOrder)||999));

    return uniqueById([
      pub[0] || null,
      next,
      ...pinned,
      ...pub
    ]).slice(0,6);
  }

  function remainingReleasePanels(firstItems){
    const firstIds = new Set(firstItems.filter(Boolean).map(r => r.id));
    const remaining = publishedNewest().filter(r => !firstIds.has(r.id));
    const pages = [];
    for(let i=0;i<remaining.length;i+=6) pages.push(remaining.slice(i,i+6));
    return pages;
  }

  function renderCarouselDots(totalPages){
    if(totalPages <= 1) return '';
    return `<div class="release-dots" aria-label="Release pages">
      ${Array.from({length:totalPages},(_,i)=>`<button type="button" class="release-dot${i===0?' is-active':''}" data-release-page="${i}" aria-label="${i+1}ページ目"></button>`).join('')}
    </div>`;
  }

  function renderReleases(){
    const first = firstReleasePanel();
    const next = futureNearest()[0] || null;
    const pages = [first, ...remainingReleasePanels(first)];

    if(!pages.some(page => page.length)){
      releaseList.innerHTML = `<div class="release-empty">INFORMATION COMING SOON</div>`;
      return;
    }

    releaseList.innerHTML = `
      <div class="release-carousel" id="releaseCarousel">
        ${pages.map((page,pageIndex) => `
          <div class="release-page" data-release-page-panel="${pageIndex}">
            <div class="release-grid">
              ${page.map(r => releaseCardHtml(
                r,
                (!r.published && next && r.id===next.id) ? 'next' : 'released'
              )).join('')}
            </div>
          </div>`).join('')}
      </div>
      ${renderCarouselDots(pages.length)}
      <button class="release-all-button" id="releaseAllButton" type="button">OPEN ALL</button>`;

    releaseList.querySelectorAll('.release-card:not(.is-next)').forEach(btn => {
      btn.addEventListener('click', () => openRelease(btn.dataset.releaseId, true));
    });

    const carousel = document.getElementById('releaseCarousel');
    const dots = [...releaseList.querySelectorAll('.release-dot')];

    if(carousel && dots.length){
      let ticking = false;
      carousel.addEventListener('scroll', () => {
        if(ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const pageWidth = carousel.clientWidth || 1;
          const page = Math.round(carousel.scrollLeft / pageWidth);
          dots.forEach((dot,i)=>dot.classList.toggle('is-active', i===page));
          ticking = false;
        });
      }, {passive:true});

      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          const page = Number(dot.dataset.releasePage || 0);
          carousel.scrollTo({left: carousel.clientWidth * page, behavior:'smooth'});
        });
      });
    }

    const allButton = document.getElementById('releaseAllButton');
    if(allButton) allButton.addEventListener('click', openAllReleases);
  }

  function openAllReleases(updateHash=true){
    const items = publishedNewest();
    activeId = 'all';

    if(modalKicker){
      modalKicker.hidden = false;
      modalKicker.textContent = 'ALL INFORMATION';
    }

    const cards = items.length
      ? items.map(r => `
          <button class="release-all-card" type="button" data-all-release-id="${escapeHtml(r.id)}">
            <span class="release-all-thumb">
              ${r.thumbnail
                ? `<img src="${escapeHtml(r.thumbnail)}" alt="${escapeHtml(r.thumbnailAlt || r.title || r.name || '')}">`
                : `<span class="release-thumb-fallback"><span>${escapeHtml(r.dateLabel || '')}</span><strong>${escapeHtml(r.name || r.title || 'INFORMATION')}</strong></span>`}
            </span>
            <span class="release-all-meta">
              <strong>${escapeHtml(r.name || r.title || 'INFORMATION')}</strong>
              <small>${escapeHtml(r.dateLabel || '')}</small>
            </span>
          </button>`).join('')
      : `<p class="release-all-empty">まだ公開済みの情報はありません。</p>`;

    modalContent.innerHTML = `
      <div class="modal-heading">
        <h2 id="modalTitle">ALL INFORMATION</h2>
      </div>
      <div class="release-all-grid">${cards}</div>`;

    modalContent.querySelectorAll('[data-all-release-id]').forEach(btn => {
      btn.addEventListener('click', () => openRelease(btn.dataset.allReleaseId, true));
    });

    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    modalPanel.scrollTop = 0;
    if(updateHash) history.replaceState(null,'','#all');
  }

  function nextCapsule(){
    const pub = published();
    if(!pub.length) return null;
    return pub.find(r => !isOpened(r.id)) || pub[pub.length-1];
  }

  function syncMachine(){
    const target = nextCapsule();
    if(!target){
      const next = future()[0];
      turnButton.disabled = true;
      turnButton.textContent = 'ハンドルをまわす';
      return;
    }
    turnButton.disabled = false;
    if(isOpened(target.id)){
      turnButton.textContent = 'もう一度まわす';
    }else{
      turnButton.textContent = 'ハンドルをまわす';
    }
  }

  function bodyHtml(body){
    if(!Array.isArray(body)) return '';
    return body.map(block => {
      if(typeof block === 'string') return `<p>${escapeHtml(block)}</p>`;
      if(block && block.type === 'html') return block.html || '';
      if(block && block.type === 'list' && Array.isArray(block.items)) return `<ul>${block.items.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
      if(block && block.type === 'paragraph') return `<p>${escapeHtml(block.text || '')}</p>`;
      return '';
    }).join('');
  }

  function informationHtml(r){
    const image = r.image ? `<div class="modal-media"><img src="${escapeHtml(r.image)}" alt="${escapeHtml(r.imageAlt || '')}">${r.imageCaption ? `<div class="modal-caption">${escapeHtml(r.imageCaption)}</div>` : ''}</div>` : '';
    const cta = r.ctaText && r.ctaUrl ? `<a class="modal-action" href="${escapeHtml(r.ctaUrl)}">${escapeHtml(r.ctaText)}</a>` : '';
    return `<div class="modal-heading"><h2 id="modalTitle">${escapeHtml(r.title || r.name)}</h2><div class="modal-date">${escapeHtml(r.dateLabel)}</div></div>${image}<div class="modal-body">${bodyHtml(r.body)}</div>${cta}`;
  }

  function openAbout(updateHash=true){
    activeId = 'about';
    if(modalKicker) modalKicker.hidden = true;

    const about = window.CYNS_ABOUT || {};
    const introHtml = (about.intro || []).map(p => `<p>${p}</p>`).join('');
    const creditsHtml = (about.credits || []).map(item => {
      const content = item.href
        ? `<a href="${item.href}"${item.href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${item.value}</a>`
        : item.value;
      return `
        <div class="about-row">
          <div class="about-key">${item.label}</div>
          <div class="about-value">${content}</div>
        </div>`;
    }).join('');
    const notesHtml = (about.notes || []).map(note => `<p class="about-note"><strong>${note}</strong></p>`).join('');

    modalContent.innerHTML = `
      <div class="modal-heading">
        <h2 id="modalTitle">${about.title || 'ABOUT'}</h2>
      </div>

      <div class="modal-body">
        ${introHtml}

        <div class="about-grid">
          ${creditsHtml}
        </div>

        ${notesHtml}
      </div>`;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    modalPanel.scrollTop = 0;
    if(updateHash) history.replaceState(null,'',`#about`);
    return true;
  }

  function openRelease(id, updateHash=true){
    if(modalKicker){ modalKicker.hidden = false; modalKicker.textContent = 'RELEASED INFORMATION'; }
    const r = releases.find(x => x.id === id && x.published);
    if(!r) return false;
    activeId = r.id;
    setOpened(r.id);
    if(r.type === 'rally' && window.CYNS_RALLY){
      modalContent.innerHTML = `<div class="modal-heading"><h2 id="modalTitle">${escapeHtml(r.title || 'POSTCARD RALLY')}</h2><div class="modal-date">${escapeHtml(r.dateLabel)}</div></div><div class="modal-special" id="rallyMount"></div>`;
      window.CYNS_RALLY.mount(document.getElementById('rallyMount'));
    }else{
      modalContent.innerHTML = informationHtml(r);
    }
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    modalPanel.scrollTop = 0;
    syncMachine();
    if(updateHash) history.replaceState(null,'',`#${encodeURIComponent(r.id)}`);
    return true;
  }

  function closeModal(){
    if(!modal.classList.contains('show')) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    activeId = null;
    if(modalKicker){ modalKicker.hidden = false; modalKicker.textContent = 'RELEASED INFORMATION'; }
    if(location.hash) history.replaceState(null,'',location.pathname + location.search);
  }

  function playGacha(){
    const target = nextCapsule();
    if(running || !target) return;
    running = true;
    handle.classList.remove('turn');
    dropBall.classList.remove('drop');
    void handle.offsetWidth;
    handle.classList.add('turn');
    setTimeout(() => dropBall.classList.add('drop'), 460);
    setTimeout(() => {
      openRelease(target.id, true);
      running = false;
    }, 1320);
  }

  function openHash(){
    const id = decodeURIComponent(location.hash.replace(/^#/,''));
    if(!id) return;
    if(id === 'about'){
      openAbout(false);
      return;
    }
    if(id === 'all'){
      openAllReleases(false);
      return;
    }
    openRelease(id, false);
  }

  turnButton.addEventListener('click', playGacha);
  if(aboutButton) aboutButton.addEventListener('click', () => openAbout(true));
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
  window.addEventListener('hashchange', openHash);

  renderReleases();
  syncMachine();
  openHash();
})();
