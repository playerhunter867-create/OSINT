const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TYPES={USERNAME:{placeholder:'Enter a username…',hint:'USERNAME → Sherlock engine, with a public-link fallback when no API is configured.',modules:['Sherlock']},EMAIL:{placeholder:'Enter an email address…',hint:'EMAIL → validation + public research launchers.',modules:['Email search resources','Breach-awareness resources']},DOMAIN:{placeholder:'example.org',hint:'DOMAIN → public DNS / certificate / archive resources.',modules:['DNS & WHOIS','Certificate Transparency','Web Archives']},IP:{placeholder:'203.0.113.10',hint:'IP address',modules:['IP Intelligence','ASN / BGP','Reverse DNS']},PHONE:{placeholder:'+49 151 12345678',hint:'PHONE → public research launchers; no private-data bypass.',modules:['Phone research resources','Country / numbering data']}};
let type='USERNAME',session=[],busy=false;
const sid='OS-'+new Date().toISOString().replace(/\D/g,'').slice(0,14)+'-'+Math.random().toString(36).slice(2,6).toUpperCase(); $('sessionId').textContent=sid;
function setType(next){type=next;document.querySelectorAll('.type-tab').forEach(b=>b.classList.toggle('active',b.dataset.type===type));$('target').placeholder=TYPES[type].placeholder;$('moduleHint').textContent=TYPES[type].hint;renderModules()}
document.querySelectorAll('.type-tab').forEach(b=>b.onclick=()=>setType(b.dataset.type));
function renderModules(){$('modules').innerHTML=TYPES[type].modules.map((m,i)=>`<div class="module-row"><span class="module-index">${String(i+1).padStart(2,'0')}</span><div><b>${esc(m)}</b><small>${type==='USERNAME'?'Integrated engine / public-link fallback':'Public-resource launcher'}</small></div><span class="module-state">${type==='USERNAME'&&i===0?'READY':'LAUNCHER'}</span></div>`).join('')}
function validTarget(v){if(!v)return 'Enter a target first.';if(type==='USERNAME'&&(/\s/.test(v)||v.length>64))return 'Username must not contain whitespace and must be ≤64 characters.';if(type==='EMAIL'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))return 'Enter a valid email format.';if(type==='DOMAIN'&&!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(v))return 'Enter a domain such as example.org.';if(type==='IP'&&!/^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/.test(v))return 'Enter an IPv4 address.';if(type==='PHONE'&&!/^\+?[0-9 ()-]{7,24}$/.test(v))return 'Enter a phone number using digits, spaces, +, ( ) or -.';return ''}
async function run(){if(busy)return;const target=$('target').value.trim(),err=validTarget(target);if(err){$('status').innerHTML=`<div class="notice" style="color:var(--warn)">${esc(err)}</div>`;return}busy=true;$('run').disabled=true;$('progress').style.display='block';$('results').innerHTML='';$('status').innerHTML=`<div class="notice">Initializing ${esc(type)} workflow for <b>${esc(target)}</b>…</div>`;try{if(type==='USERNAME')await runSherlock(target);else showCatalogLaunchers(target)}catch(e){$('status').innerHTML=`<div class="notice" style="color:var(--danger)">ERROR: ${esc(e.message)}</div>`}finally{busy=false;$('run').disabled=false;$('progress').style.display='none'}}
async function runSherlock(target){
  try{
    const d=await OSINTHub.api(`/api/username/${encodeURIComponent(target)}`,45000);
    $('checked').textContent=d.checked;$('found').textContent=d.found;
    const rows=(d.results||[]).filter(x=>x.status==='CLAIMED');
    $('status').innerHTML=`<div class="result-head"><b>${esc(d.username)}</b><span class="status CLAIMED">${d.found} CLAIMED / ${d.checked} CHECKED</span></div>`;
    $('results').innerHTML=rows.length?rows.map(x=>resultRow(x.site,x.url,'CLAIMED',true)).join(''):'<div class="empty">No claimed profiles were returned.</div>';
    rows.forEach(x=>saveItem({type:'USERNAME',target,source:'Sherlock',name:x.site,url:x.url,status:x.status}));
  }catch(apiError){
    const rows=await OSINTHub.publicUsernameLinks(target,120);
    $('checked').textContent=rows.length;$('found').textContent='—';
    $('status').innerHTML='<div class="notice">Live Sherlock API is unavailable. Showing public profile links generated from the bundled site definitions; opening a link does not confirm that the username exists there.</div>';
    $('results').innerHTML=rows.length?rows.map(x=>resultRow(x.site,x.url,'PUBLIC LINK',false)).join(''):'<div class="empty">No compatible public profile links were generated.</div>';
    rows.forEach(x=>saveItem({type:'USERNAME',target,source:'Public link',name:x.site,url:x.url,status:'LINK'}));
  }
  renderSession();
}
function showCatalogLaunchers(target){
  $('checked').textContent='—';
  $('found').textContent='—';

  if(type==='PHONE'){
    $('status').innerHTML=`<div class="notice">Phone-number lookup is not performed by this static GitHub Pages dashboard. No result has been found or confirmed. The app does not query private databases, and entering a number will not automatically identify a person.</div>`;
    $('results').innerHTML=`<div class="empty">Static mode: live phone lookup requires a separately deployed, authorized backend. You can use this dashboard for input validation and lawful public-data research, but this page will not present a web search page as if it were a scan result.</div>`;
    renderSession();
    return;
  }

  const urls={
    EMAIL:[['Google search',`https://www.google.com/search?q=${encodeURIComponent('"'+target+'"')}`],['Have I Been Pwned','https://haveibeenpwned.com/']],
    DOMAIN:[['Google search',`https://www.google.com/search?q=${encodeURIComponent('site:'+target)}`],['crt.sh',`https://crt.sh/?q=${encodeURIComponent(target)}`],['Internet Archive',`https://web.archive.org/web/*/${encodeURIComponent(target)}/*`]],
    IP:[['Shodan',`https://www.shodan.io/host/${encodeURIComponent(target)}`],['AbuseIPDB',`https://www.abuseipdb.com/check/${encodeURIComponent(target)}`],['BGPView',`https://bgpview.io/ip/${encodeURIComponent(target)}`]]
  };

  $('status').innerHTML=`<div class="notice">No invasive automatic lookup is performed for ${esc(type)}. The resources below are external public resources; opening them is a separate action and does not confirm that any result exists.</div>`;
  $('results').innerHTML=(urls[type]||[]).map(x=>resultRow(x[0],x[1],'LAUNCH',false)).join('');
  (urls[type]||[]).forEach(x=>saveItem({type,target,source:'Launcher',name:x[0],url:x[1],status:'LAUNCH'}));
  renderSession();
}
function resultRow(name,url,status,saveOnOpen){return `<div class="result"><div><a href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-open="${saveOnOpen?'1':'0'}">${esc(name)}</a><div class="result-url">${esc(url)}</div></div><span class="status ${esc(status).replace(/\s+/g,'_')}">${esc(status)}</span></div>`}
function saveItem(item){const key=[item.type,item.target,item.source,item.name].join('|');if(session.some(x=>x.key===key))return;session.unshift({...item,key,time:new Date().toISOString()});if(session.length>100)session=session.slice(0,100);localStorage.setItem('osint_session',JSON.stringify(session));$('sessionCount').textContent=session.length}
function renderSession(){$('sessionItems').innerHTML=session.length?session.slice(0,20).map(x=>`<div class="session-item"><span class="session-dot"></span><div><b>${esc(x.name)}</b><small>${esc(x.type)} · ${esc(x.target)}</small></div></div>`).join(''):'<div class="notice">No saved items.</div>'; $('sessionCount').textContent=session.length}
$('results').addEventListener('click',e=>{const a=e.target.closest('a[data-open]');if(!a)return;$('opened').textContent=Number($('opened').textContent||0)+1;saveItem({type,target:$('target').value.trim(),source:'Open',name:a.textContent,url:a.href,status:'OPENED'});renderSession()});
$('run').onclick=run;$('target').addEventListener('keydown',e=>{if(e.key==='Enter')run()});$('clear').onclick=()=>{$('target').value='';$('results').innerHTML='';$('status').innerHTML='<div class="notice">Awaiting a target.</div>'};$('wipe').onclick=()=>{session=[];localStorage.removeItem('osint_session');renderSession()};$('export').onclick=()=>{const blob=new Blob([JSON.stringify({sessionId:sid,exportedAt:new Date().toISOString(),items:session},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${sid}.json`;a.click();URL.revokeObjectURL(a.href)};try{session=JSON.parse(localStorage.getItem('osint_session')||'[]')}catch{session=[]}renderModules();renderSession();
