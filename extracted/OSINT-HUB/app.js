const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let resources=[], selected='ALL';
async function init(){
  try{
    const source = await OSINTHub.catalog();
    const d = source.resources ? source : (() => {
      const resources = flatten(source);
      const cats = [...new Set(resources.flatMap(x=>x.categories||[]))].filter(Boolean).sort((a,b)=>a.localeCompare(b));
      return {resources, resource_count: resources.length, category_count: cats.length, categories: cats};
    })();
    resources=d.resources||[];
    $('toolCount').textContent=Number(d.resource_count||resources.length).toLocaleString();
    $('catCount').textContent=Number(d.category_count||0).toLocaleString();
    renderCats(d.categories||[]); render();
  }catch(e){
    $('toolCount').textContent='0'; $('catCount').textContent='0';
    $('grid').innerHTML=`<div class="empty">Could not load the bundled catalog.<br><small>${esc(e.message)}</small></div>`;
  }
}
function flatten(node,path=[]){
  const children=node.children||[];
  if(!children.length)return [{...node,category:path.at(-1)||'Other',categories:path}];
  const next=node.name?[...path,node.name]:path;
  return children.flatMap(child=>flatten(child,next));
}
function renderCats(cats){
 const box=$('categories');
 box.innerHTML=`<button class="cat active" data-cat="ALL">ALL RESOURCES</button>`+cats.map(c=>`<button class="cat" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
 box.querySelectorAll('.cat').forEach(b=>b.onclick=()=>{selected=b.dataset.cat;box.querySelectorAll('.cat').forEach(x=>x.classList.toggle('active',x===b));render()});
}
function render(){
 const q=$('q').value.trim().toLowerCase();
 let list=resources.filter(x=>{const hay=[x.name,x.description,x.bestFor,x.input,x.output,...(x.categories||[])].join(' ').toLowerCase();return (selected==='ALL'||(x.categories||[]).includes(selected))&&(!q||hay.includes(q));});
 if($('sort').value==='status') list.sort((a,b)=>String(a.status).localeCompare(String(b.status))||String(a.name).localeCompare(String(b.name)));
 else list.sort((a,b)=>String(a.name).localeCompare(String(b.name)));
 $('empty').hidden=list.length>0;
 $('grid').innerHTML=list.slice(0,500).map(card).join('');
}
function card(x){
 const price=x.pricing?`<span class="badge">${esc(x.pricing)}</span>`:'';
 const status=x.status==='live'?'<span class="badge live">LIVE</span>':`<span class="badge">${esc(x.status||'unknown')}</span>`;
 return `<article class="tool"><div class="tooltop"><h3>${esc(x.name)}</h3>${status}</div><div class="badges">${price}${x.localInstall?'<span class="badge">LOCAL</span>':''}${x.api?'<span class="badge">API</span>':''}</div><p>${esc(x.description||x.bestFor||'No description available.')}</p><div class="toolfoot"><span>${esc(x.category||'Other')}</span>${x.url?`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">OPEN ↗</a>`:''}</div></article>`;
}
$('q').addEventListener('input',render); $('sort').addEventListener('change',render); init();
