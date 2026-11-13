"use client";
import {useEffect,useState} from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import {Heart,Trash2} from 'lucide-react';
export default function Wishlist(){
 const [items,setItems]=useState([]);
 function load(){try{setItems(JSON.parse(localStorage.getItem('sf-wishlist-v1')||'[]'))}catch{setItems([])}}
 useEffect(()=>{load();window.addEventListener('storage',load);return ()=>window.removeEventListener('storage',load)},[]);
 function remove(key){const next=items.filter(x=>x!==key);localStorage.setItem('sf-wishlist-v1',JSON.stringify(next));setItems(next)}
 return <><Header/><main className="sf-category-main mx-auto py-8 min-h-[55vh]"><h1 className="text-3xl font-semibold text-forest flex items-center gap-2"><Heart/> My Wishlist</h1><p className="text-charcoal/60 mt-2 mb-6">Your saved Saksham Furniture products on this device.</p>{items.length?<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{items.map(key=>{const [category,...rest]=key.split('|');const name=rest.join('|');return <div key={key} className="flex items-center justify-between gap-3 border border-forest/15 rounded-xl bg-white p-4"><Link className="text-forest font-semibold underline-offset-4 hover:underline" href={'/product?category='+encodeURIComponent(category)+'&name='+encodeURIComponent(name)}>{name}</Link><button onClick={()=>remove(key)} aria-label={'Remove '+name} className="shrink-0 text-forest p-2 border rounded-full"><Trash2 size={18}/></button></div>})}</div>:<div className="bg-white border rounded-xl p-8 text-center"><p>No saved products yet.</p><Link href="/category" className="inline-block mt-4 bg-forest text-white rounded-full px-5 py-3">Browse Furniture</Link></div>}</main><Footer/></>
}
