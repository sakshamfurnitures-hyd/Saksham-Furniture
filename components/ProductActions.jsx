"use client";
import {useEffect,useState} from 'react';
import {Heart,Share2} from 'lucide-react';
export default function ProductActions({name,category,compact=false}){
 const key=category+'|'+name;
 const [saved,setSaved]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem('sf-wishlist-v1')||'[]').includes(key))}catch{}},[key]);
 function toggle(e){e.preventDefault();e.stopPropagation();try{const list=JSON.parse(localStorage.getItem('sf-wishlist-v1')||'[]');const next=list.includes(key)?list.filter(v=>v!==key):[...list,key];localStorage.setItem('sf-wishlist-v1',JSON.stringify(next));setSaved(next.includes(key));if(next.includes(key)&&localStorage.getItem('sf-tracking')==='yes')window.gtag?.('event','add_to_wishlist',{items:[{item_name:name,item_category:category}]});setMessage(next.includes(key)?'Saved to wishlist':'Removed from wishlist')}catch{setMessage('Wishlist unavailable')}}
 async function share(e){e.preventDefault();e.stopPropagation();const url=window.location.origin+'/product?category='+encodeURIComponent(category)+'&name='+encodeURIComponent(name);try{if(navigator.share){await navigator.share({title:name+' | Saksham Furniture',url});return}if(navigator.clipboard){await navigator.clipboard.writeText(url);setMessage('Link copied');return}window.prompt('Copy product link',url)}catch(err){if(err?.name!=='AbortError')window.prompt('Copy product link',url)}}
 return <div className={'sf-image-actions '+(compact?'sf-image-actions-small':'')} onClick={e=>e.stopPropagation()}><button type="button" onClick={toggle} title={saved?'Remove from wishlist':'Add to wishlist'} aria-label={saved?'Remove from wishlist':'Add to wishlist'}><Heart size={compact?16:20} fill={saved?'#ba8640':'none'} color={saved?'#ba8640':'#123e31'}/></button><button type="button" onClick={share} title="Share product" aria-label="Share product"><Share2 size={compact?16:20}/></button>{message&&<span role="status" className="sf-action-message" onClick={e=>{e.preventDefault();e.stopPropagation();setMessage('')}}>{message}</span>}</div>
}
