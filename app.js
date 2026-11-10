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
  let modalReturnTarget = null;

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
  function uniqueById(items){
    const seen = new Set();
    return items.filter(item => {
      if(!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  function releaseCardHtml(r){
    const media = r.thumbnail
      ? `<img src="${escapeHtml(r.thumbnail)}" alt="${escapeHtml(r.thumbnailAlt || r.title || r.name || '')}">`
      : `<span class="release-thumb-empty" aria-hidden="true"></span>`;

    return `
      <button
        class="release-card"
        type="button"
        data-release-id="${escapeHtml(r.id)}"
        aria-label="${escapeHtml(`${r.dateLabel || ''} ${r.name || r.title || ''}`.trim())}"
      >
        <span class="release-thumb">
          ${media}
          <span class="release-card-copy">
            <span class="release-card-date">${escapeHtml(r.dateLabel || '')}</span>
            <strong class="release-card-name">${escapeHtml(r.name || r.title || 'INFORMATION')}</strong>
          </span>
        </span>
        ${r.pinned ? '<span class="release-card-pin" aria-label="Pinned">PIN</span>' : ''}
      </button>`;
  }

  function firstReleasePanel(){
    const pub = publishedNewest();
    const pinned = pub
      .filter(r => r.pinned)
      .sort((a,b) => (Number(a.pinOrder)||999) - (Number(b.pinOrder)||999));

    // PIN 1〜3は最上段3枠を最優先で固定。
    // pinned:true の公開済み情報を pinOrder 順に並べ、
    // 最初の3件をトップ行へ置く。
    const pinnedTop = pinned.slice(0,3);

    // 2段目以降は、
    // 最新OPEN → 4件目以降のPIN → その他OPEN
    // の順で埋める。重複は自動除外。
    const fillers = uniqueById([
      pub[0] || null,
      ...pinned.slice(3),
      ...pub
    ]).filter(item => !pinnedTop.some(pin => pin.id === item.id));

    return [...pinnedTop, ...fillers].slice(0,6);
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
              ${page.map(r => releaseCardHtml(r)).join('')}
            </div>
          </div>`).join('')}
      </div>
      ${renderCarouselDots(pages.length)}
      <button class="release-all-button" id="releaseAllButton" type="button">OPEN ALL</button>`;

    releaseList.querySelectorAll('.release-card').forEach(btn => {
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
                : `<span class="release-thumb-empty" aria-hidden="true"></span>`}
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
      btn.addEventListener('click', () => openRelease(btn.dataset.allReleaseId, true, 'all'));
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

  function openRelease(id, updateHash=true, returnTarget=null){
    if(modalKicker){ modalKicker.hidden = false; modalKicker.textContent = 'RELEASED INFORMATION'; }
    const r = releases.find(x => x.id === id && x.published);
    if(!r) return false;
    activeId = r.id;
    modalReturnTarget = returnTarget;
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

    // OPEN ALLから個別告知を開いた場合は、
    // モーダル自体を閉じずにOPEN ALLへ戻る。
    if(modalReturnTarget === 'all' && activeId !== 'all'){
      modalReturnTarget = null;
      openAllReleases(true);
      return;
    }

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    activeId = null;
    modalReturnTarget = null;
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