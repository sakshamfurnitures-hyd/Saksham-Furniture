"use client";
import {useEffect,useMemo,useState} from 'react';
import {categoryImages,clean} from '../lib/catalogue';

function imageCandidates(src){
 const u=String(src||'').trim();
 const id=u.match(/drive\.google\.com\/file\/d\/([\w-]+)/i)?.[1]
   ||(u.includes('drive.google.com')?u.match(/[?&]id=([\w-]+)/i)?.[1]:null);
 if(!id)return u?[u]:[];
 const key=encodeURIComponent(id);
 // Try different Google Drive endpoints/sizes before reporting a failed photo.
 return [...new Set([
   `https://drive.google.com/thumbnail?id=${key}&sz=w1200`,
   `https://drive.google.com/thumbnail?id=${key}&sz=w800`,
   `https://lh3.googleusercontent.com/d/${key}=w1200`,
   `https://drive.google.com/uc?export=view&id=${key}`
 ])];
}
export default function SafeProductImage({src,category,alt,priority=false,className=''}){
 const fallback='/assets/'+(categoryImages[clean(category)]||'bed.webp');
 const candidates=useMemo(()=>imageCandidates(src),[src]);
 const [index,setIndex]=useState(0);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{setIndex(0);setFailed(false)},[src]);
 const current=candidates[index]||(!src?fallback:'');
 const onError=()=>{
  if(index+1<candidates.length){setIndex(i=>i+1);return;}
  console.warn('Saksham Furniture: product image could not load', {src,alt});
  setFailed(true);
 };
 // Never show an unrelated category photo when a product's actual Drive image fails.
 if(failed)return <div role="img" aria-label={`${alt||'Product'} photo temporarily unavailable`} className={`sf-photo-retry ${className}`}><button type="button" onClick={()=>{setIndex(0);setFailed(false)}} aria-label="Retry loading product photo">Retry photo</button></div>;
 return <img src={current} alt={alt||'Saksham Furniture product'} loading={priority?'eager':'lazy'} decoding="async" className={className} onError={onError}/>;
}
