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
  const nextLabel = document.getElementById('nextLabel');
  const nextDate = document.getElementById('nextDate');
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

  function renderNext(){
    const next = future()[0];
    if(next){
      nextLabel.textContent = 'NEXT INFORMATION';
      nextDate.textContent = next.dateLabel;
    }else{
      nextLabel.textContent = 'ALL INFORMATION RELEASED';
      nextDate.textContent = 'CLOSED';
    }
  }

  function renderReleases(){
    releaseList.innerHTML = '';
    releases.forEach(r => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `release-row${r.published ? '' : ' future'}`;
      if(!r.published){ btn.disabled = true; btn.setAttribute('aria-disabled','true'); }
      btn.innerHTML = `
        <span class="release-num">${escapeHtml(r.number)}</span>
        <span class="release-main">
          <span class="release-head"><span class="release-date">${escapeHtml(r.dateLabel)}</span><span class="release-name">${escapeHtml(r.name)}</span></span>
          <span class="release-sub">${escapeHtml(r.teaser || '')}</span>
        </span>
        <span class="release-open">${r.published ? 'OPEN' : 'NEXT'}</span>`;
      if(r.published) btn.addEventListener('click', () => openRelease(r.id, true));
      releaseList.appendChild(btn);
    });
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
    if(modalKicker) modalKicker.hidden = false;
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
    if(modalKicker) modalKicker.hidden = false;
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
    openRelease(id, false);
  }

  turnButton.addEventListener('click', playGacha);
  if(aboutButton) aboutButton.addEventListener('click', () => openAbout(true));
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
  window.addEventListener('hashchange', openHash);

  renderReleases();
  renderNext();
  syncMachine();
  openHash();
})();
