(() => {
  const circles = () => Array.isArray(window.CYNS_CIRCLES) ? window.CYNS_CIRCLES : [];
  const cfg = () => window.CYNS_RALLY_CONFIG || {thresholds:[5,10,15],rewardLabel:'BONUS POSTCARD GACHA ×1'};
  const key = name => `cyns:rally:v1:${name}`;
  const readSet = name => new Set(JSON.parse(localStorage.getItem(key(name)) || '[]'));
  const saveSet = (name,set) => localStorage.setItem(key(name), JSON.stringify([...set]));
  const myList = () => readSet('myList');
  const gets = () => readSet('gets');
  const claimed = () => readSet('claimed');
  let mountEl = null;
  let view = 'map';

  const esc = (v='') => String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function progressText(){
    const count = gets().size;
    const next = cfg().thresholds.find(n => n > count);
    return next ? `<strong>${count} / ${next} GET</strong><br>NEXT BONUS あと${next-count}` : `<strong>${count} GET</strong><br>POSTCARD RALLY COMPLETE!`;
  }

  function circleCard(c){
    const saved = myList().has(c.id); const got = gets().has(c.id);
    const links = [c.x ? `<a href="${esc(c.x)}" target="_blank" rel="noopener">X</a>`:'', c.pixiv ? `<a href="${esc(c.pixiv)}" target="_blank" rel="noopener">pixiv</a>`:''].filter(Boolean).join(' / ');
    return `<article class="rally-circle${c.rally ? ' is-rally':''}" data-circle="${esc(c.id)}">
      <div class="rally-circle-head"><div><div class="rally-space">${esc(c.space)} ${saved?'♥ ':''}${got?'✓':''}</div><div>${esc(c.circle)}</div><div style="font-size:9px;color:#777">${esc(c.name||'')}</div></div><div>${c.rally?'POSTCARD':''}</div></div>
      ${c.image ? `<img src="${esc(c.image)}" alt="" style="width:100%;margin-top:10px">`:''}
      ${c.categories?.length ? `<div style="margin-top:8px;font-size:9px">${c.categories.map(esc).join(' / ')}</div>`:''}
      ${c.comment ? `<p style="font-size:10px;line-height:1.7">${esc(c.comment)}</p>`:''}
      ${links ? `<div style="font-size:10px">${links}</div>`:''}
      <div class="rally-actions">
        <button class="rally-btn ${saved?'is-on':''}" data-action="save" data-id="${esc(c.id)}">${saved?'♥ SAVED':'♡ MY LIST'}</button>
        ${c.rally ? `<button class="rally-btn ${got?'is-on':''}" data-action="get" data-id="${esc(c.id)}">${got?'✓ GET!':'POSTCARD GET'}</button>`:''}
      </div>
    </article>`;
  }

  function renderMap(){
    const data = circles();
    if(!data.length) return `<div class="rally-map"><div style="text-align:center;color:#777">MAP / CIRCLE DATA<br><small>スペース発表後に公開</small></div></div>`;
    // Production-ready fallback list. Replace this area with the final SVG island map when space IDs are fixed.
    const bySpace = [...new Set(data.map(c=>c.space))];
    return `<div class="rally-map" style="display:block"><div class="rally-list">${bySpace.map(space=>{
      const group = data.filter(c=>c.space===space); const rally = group.some(c=>c.rally); const saved = group.some(c=>myList().has(c.id)); const gotCount = group.filter(c=>gets().has(c.id)).length; const rallyCount = group.filter(c=>c.rally).length;
      return `<button class="rally-circle ${rally?'is-rally':''}" data-open-space="${esc(space)}" style="width:100%;text-align:left;cursor:pointer"><div class="rally-circle-head"><strong>${esc(space)}</strong><span>${saved?'♥ ':''}${gotCount ? `✓${rallyCount>1?` ${gotCount}/${rallyCount}`:''}`:''}</span></div></button>`;
    }).join('')}</div></div>`;
  }

  function renderList(filterSaved=false){
    let data = circles();
    if(filterSaved) data = data.filter(c => myList().has(c.id));
    return `<div class="rally-list">${data.length ? data.map(circleCard).join('') : '<div class="rally-map">まだ登録はありません。</div>'}</div>`;
  }

  function renderBonus(){
    const count = gets().size, cl = claimed();
    return cfg().thresholds.map(n=>{
      const ready = count >= n, done = cl.has(String(n));
      return `<div class="reward-card ${ready&&!done?'is-ready':''}"><strong>${n} GET ${done?'✓ CLAIMED':ready?'BONUS READY!':''}</strong><div style="margin-top:5px">${esc(cfg().rewardLabel)}</div>${ready&&!done?`<div style="font-size:9px;margin-top:7px">本部でこの画面を見せてね</div><div class="redeem-track" data-threshold="${n}"><div class="redeem-label">SLIDE TO REDEEM →</div><button class="redeem-thumb" type="button" aria-label="Slide to redeem">→</button></div>`:''}</div>`;
    }).join('') + `<div class="rally-note">ラリーの進捗はこの端末のブラウザに保存されます。イベント中は同じ端末・同じブラウザをご利用ください。</div>`;
  }

  function render(){
    if(!mountEl) return;
    mountEl.innerHTML = `<div class="rally-shell"><div class="rally-progress">${progressText()}</div><div class="rally-tabs"><button class="rally-tab ${view==='map'?'is-active':''}" data-view="map">MAP</button><button class="rally-tab ${view==='list'?'is-active':''}" data-view="list">MY LIST</button><button class="rally-tab ${view==='bonus'?'is-active':''}" data-view="bonus">BONUS</button></div><div class="rally-view">${view==='map'?renderMap():view==='list'?renderList(true):renderBonus()}</div><div class="rally-note">MAPで参加サークルを探して、ポストカードをもらったらGET！ 5 / 10 / 15 GETでBONUS GACHA。♡ MY LISTはお買い物メモにも使えます。CUSTOM SET購入は参加条件ではありません。</div></div>`;
    bind();
  }

  function toggle(name,id){const s=readSet(name); s.has(id)?s.delete(id):s.add(id); saveSet(name,s); render();}

  function bind(){
    mountEl.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;render();}));
    mountEl.querySelectorAll('[data-action="save"]').forEach(b=>b.addEventListener('click',()=>toggle('myList',b.dataset.id)));
    mountEl.querySelectorAll('[data-action="get"]').forEach(b=>b.addEventListener('click',()=>toggle('gets',b.dataset.id)));
    mountEl.querySelectorAll('[data-open-space]').forEach(b=>b.addEventListener('click',()=>{
      const items=circles().filter(c=>c.space===b.dataset.openSpace); mountEl.querySelector('.rally-view').innerHTML=`<button class="rally-btn" id="rallyBack">← MAP</button><div class="rally-list" style="margin-top:8px">${items.map(circleCard).join('')}</div>`; bind(); const back=mountEl.querySelector('#rallyBack'); if(back) back.addEventListener('click',render);
    }));
    mountEl.querySelectorAll('.redeem-track').forEach(track=>bindSlider(track));
  }

  function bindSlider(track){
    const thumb=track.querySelector('.redeem-thumb'); let dragging=false,startX=0,startLeft=4; const max=()=>Math.max(4,track.clientWidth-thumb.offsetWidth-4);
    const move=x=>{const left=Math.max(4,Math.min(max(),startLeft+x-startX));thumb.style.left=`${left}px`; if(left>=max()-3){const s=claimed();s.add(String(track.dataset.threshold));saveSet('claimed',s);dragging=false;render();}};
    const down=e=>{dragging=true;startX=e.clientX ?? e.touches?.[0]?.clientX ?? 0;startLeft=parseFloat(getComputedStyle(thumb).left)||4;thumb.setPointerCapture?.(e.pointerId)};
    thumb.addEventListener('pointerdown',down); thumb.addEventListener('pointermove',e=>{if(dragging)move(e.clientX)}); thumb.addEventListener('pointerup',()=>dragging=false); thumb.addEventListener('pointercancel',()=>dragging=false);
  }

  window.CYNS_RALLY = { mount(el){mountEl=el;view='map';render();} };
})();
