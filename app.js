const tabs=[...document.querySelectorAll('[data-recipe]')];
let recipes;
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function selectRecipe(index,focus=false){
  try{
    recipes ||= await fetch('receitas-amostra.json').then(r=>{if(!r.ok)throw Error('Receitas indisponíveis');return r.json()});
    const r=recipes[index];
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1});
    if(focus)tabs[index].focus();
    const panel=document.querySelector('#recipe-panel');panel.setAttribute('aria-labelledby',tabs[index].id);
    panel.innerHTML=`<p class="eyebrow">${escapeHTML(r.category.toUpperCase())}</p><h3>${escapeHTML(r.name)}</h3><p class="recipe-meta">${r.active} min de preparo${r.wait?' + '+r.wait+' min de espera/forno':''} · ${escapeHTML(r.yield_)} · estimativa</p><div class="recipe-columns"><div><h4>Ingredientes</h4><ul>${r.ingredients.map(i=>'<li>'+escapeHTML(i)+'</li>').join('')}</ul></div><div><h4>Como preparar</h4><ol>${r.steps.map(s=>'<li>'+escapeHTML(s)+'</li>').join('')}</ol></div></div><p class="recipe-tip">${escapeHTML(r.note)}</p>`;
  }catch(error){document.querySelector('#recipe-panel').innerHTML='<h3>Não foi possível abrir esta receita.</h3><p>Atualize a página e tente novamente.</p>'}
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectRecipe(index));tab.addEventListener('keydown',e=>{let next;if(['ArrowDown','ArrowRight'].includes(e.key))next=(index+1)%tabs.length;else if(['ArrowUp','ArrowLeft'].includes(e.key))next=(index-1+tabs.length)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectRecipe(next,true)}})});
fetch('oferta.json').then(r=>r.json()).then(offer=>{
 if(offer.checkout_url&&offer.ready){document.querySelectorAll('.checkout').forEach(a=>{a.href=offer.checkout_url;a.rel='noopener';a.target='_blank'});document.querySelector('#checkout-status').textContent='Compra processada pela Cakto. Confira o preço, os meios de pagamento e as condições no checkout.';}
}).catch(()=>{});
