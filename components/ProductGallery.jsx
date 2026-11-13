"use client";
import {useState} from 'react';
import SafeProductImage from './SafeProductImage';
import ProductActions from './ProductActions';
export default function ProductGallery({images,category,name}){
 const photos=[...new Set((images||[]).filter(Boolean))];
 const [active,setActive]=useState(0);
 const src=photos[Math.min(active,photos.length-1)]||'';
 return <div className="w-full min-w-0">
  <div className="relative"><ProductActions name={name} category={category}/><div className="block w-full overflow-hidden rounded-2xl border border-forest/10 bg-white">
   <div className="aspect-square w-full"><SafeProductImage src={src} category={category} alt={name} priority className="w-full h-full object-contain"/></div>
  </div></div>
  {photos.length>1&&<div className="mt-3 flex flex-wrap gap-2">{photos.map((url,i)=><button key={url} type="button" onClick={()=>setActive(i)} aria-label={`View photo ${i+1}`} aria-pressed={active===i} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white border-2 ${active===i?'border-gold':'border-forest/10'}`}><SafeProductImage src={url} category={category} alt={`${name} photo ${i+1}`} className="w-full h-full object-contain"/></button>)}</div>}

 </div>
}
