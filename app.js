const target=document.getElementById('target');
const tools=document.getElementById('tools');
const title=document.getElementById('tools-title');
const hint=document.getElementById('hint');
let type='username';

const catalog={
 username:[
  ['Google','Публичный веб-поиск',q=>`https://www.google.com/search?q=${encodeURIComponent('"'+q+'"')}`],
  ['GitHub','Публичные профили',q=>`https://github.com/${encodeURIComponent(q)}`],
  ['Reddit','Публичные профили',q=>`https://www.reddit.com/user/${encodeURIComponent(q)}/`],
  ['Keybase','Публичный профиль',q=>`https://keybase.io/${encodeURIComponent(q)}`]
 ],
 domain:[
  ['Google','Публичный поиск по домену',q=>`https://www.google.com/search?q=${encodeURIComponent('site:'+q)}`],
  ['crt.sh','Публичные сертификаты',q=>`https://crt.sh/?q=${encodeURIComponent(q)}`],
  ['Internet Archive','История публичных страниц',q=>`https://web.archive.org/web/*/${encodeURIComponent(q)}/*`],
  ['DNSdumpster','Открыть инструмент',()=>`https://dnsdumpster.com/`]
 ],
 ip:[
  ['Shodan','Публичная информация об IP',q=>`https://www.shodan.io/host/${encodeURIComponent(q)}`],
  ['AbuseIPDB','Репутационная информация',q=>`https://www.abuseipdb.com/check/${encodeURIComponent(q)}`],
  ['BGPView','Сетевая информация',q=>`https://bgpview.io/ip/${encodeURIComponent(q)}`],
  ['Google','Публичный веб-поиск',q=>`https://www.google.com/search?q=${encodeURIComponent(q)}`]
 ]
};

function valid(){
 const q=target.value.trim();
 if(!q) return '';
 if(type==='username') return q.replace(/^@/,'').replace(/\s+/g,'');
 if(type==='domain') return q.replace(/^https?:\/\//,'').split('/')[0];
 if(type==='ip') return q;
}
function render(){
 const q=valid();
 const names={username:'USERNAME — ПУБЛИЧНЫЕ ИНСТРУМЕНТЫ',domain:'DOMAIN — ПУБЛИЧНЫЕ ИНСТРУМЕНТЫ',ip:'IP — ПУБЛИЧНЫЕ ИНСТРУМЕНТЫ'};
 title.textContent=names[type];
 tools.innerHTML='';
 if(!q){
  hint.textContent='Сначала введите запрос — затем выберите нужный сервис.';
  return;
 }
 hint.textContent='Нажмите кнопку: выбранный публичный сервис откроется в новой вкладке.';
 for(const [name,desc,url] of catalog[type]){
   const a=document.createElement('a');
   a.className='tool'; a.target='_blank'; a.rel='noopener noreferrer';
   a.href=url(q);
   a.innerHTML=`${name}<small>${desc}</small>`;
   tools.appendChild(a);
 }
}
document.querySelectorAll('.type').forEach(b=>b.addEventListener('click',()=>{
 type=b.dataset.type;
 document.querySelectorAll('.type').forEach(x=>x.classList.toggle('active',x===b));
 render();
}));
target.addEventListener('input',render);
render();