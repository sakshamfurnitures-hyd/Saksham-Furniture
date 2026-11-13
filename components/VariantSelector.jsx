"use client";
import {useMemo,useState} from 'react';
import {money,orderLink} from '../lib/catalogue';

export default function VariantSelector({variants,productName}){
  const preferred=variants.find(v=>/queen/i.test(String(v.size))&&/without\s*storage|no\s*storage|non[ -]?storage/i.test(String(v.storage)))||variants[0];
  const [chosen,setChosen]=useState(()=>Math.max(0,variants.indexOf(preferred)));
  const p=variants[chosen]||variants[0];
  const sizes=useMemo(()=>[...new Set(variants.map(v=>String(v.size||'').trim()).filter(Boolean))],[variants]);
  const storages=useMemo(()=>[...new Set(variants.map(v=>String(v.storage||'').trim()).filter(Boolean))],[variants]);
  const showSize=sizes.length>1,showStorage=storages.length>1;
  function choose(field,value){
    let match=variants.findIndex(v=>String(v[field]||'').trim()===value && (!((field==='size'&&showStorage)||(field==='storage'&&showSize)) || String(v[field==='size'?'storage':'size']||'').trim()===String(p[field==='size'?'storage':'size']||'').trim()));
    if(match<0)match=variants.findIndex(v=>String(v[field]||'').trim()===value);
    if(match>=0)setChosen(match);
  }
  return <div className="mt-5">
    {(showSize||showStorage)&&<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {showSize&&<label className="block text-forest font-semibold">Size<select aria-label="Bed size" value={String(p.size||'').trim()} onChange={e=>choose('size',e.target.value)} className="mt-2 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-forest">{sizes.map(v=><option key={v} value={v}>{v}</option>)}</select></label>}
      {showStorage&&<label className="block text-forest font-semibold">Storage<select aria-label="Storage option" value={String(p.storage||'').trim()} onChange={e=>choose('storage',e.target.value)} className="mt-2 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-forest">{storages.map(v=><option key={v} value={v}>{v}</option>)}</select></label>}
    </div>}
    {variants.length>1&&!showSize&&!showStorage&&<label className="block text-forest font-semibold">Available options<select aria-label="Product variant" value={chosen} onChange={e=>setChosen(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-forest/20 bg-white px-4 py-3 text-forest">{variants.map((v,i)=><option key={i} value={i}>{[v.size,v.storage,v.material].filter(Boolean).join(' • ')||'Standard'} — {money(v.price)}</option>)}</select></label>}
    <div className="flex flex-wrap items-center gap-3 mt-5"><p className="text-3xl font-bold text-gold">{money(p.price)}</p>{Number(String(p.mrp||'').replace(/[^0-9.]/g,''))>Number(String(p.price||'').replace(/[^0-9.]/g,''))&&!/^(no|false|0|off)$/i.test(String(p.offer_active||'yes'))&&<><span className="line-through text-gray-500">{money(p.mrp)}</span><span className="sf-discount">{Math.round((Number(String(p.mrp).replace(/[^0-9.]/g,''))-Number(String(p.price).replace(/[^0-9.]/g,'')))/Number(String(p.mrp).replace(/[^0-9.]/g,''))*100)}% OFF</span></>}</div>{p.offer_label&&<p className="text-sm text-gold mt-1">{p.offer_label}</p>}
    <p className="text-sm text-charcoal/70 mt-2">{[p.size,p.storage,p.material].filter(Boolean).join(' • ')}</p>
    <div className="sf-buy-actions mt-5"><a href="https://maps.app.goo.gl/y8erCiw8RFza2jdm8" target="_blank" rel="noopener noreferrer" className="sf-buy-action"><span aria-hidden="true">⌂</span> Visit Store</a><a href="tel:+918523001836" className="sf-buy-action"><span aria-hidden="true">☎</span> Buy on Phone</a><a href={orderLink(p)} target="_blank" rel="noopener noreferrer" className="sf-buy-action"><span aria-hidden="true">◉</span> WhatsApp</a></div>
    {p.description&&<section className="mt-7 border-t border-forest/10 pt-5"><h2 className="text-lg font-semibold text-forest mb-2">Product Description</h2><p className="text-charcoal/70 leading-7 whitespace-pre-line break-words">{p.description}</p></section>}
    <section className="mt-6 border-t border-forest/10 pt-5"><h2 className="text-lg font-semibold text-forest mb-3">Product Specifications</h2><dl className="text-sm divide-y divide-forest/10 border border-forest/10 rounded-xl overflow-hidden">{[['Material',p.material],['Size',p.size],['Storage',p.storage]].filter(([,v])=>String(v||'').trim()).map(([k,v])=><div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-3"><dt className="font-semibold text-forest">{k}</dt><dd className="text-charcoal/80 break-words">{v}</dd></div>)}</dl></section>
  </div>;
}
