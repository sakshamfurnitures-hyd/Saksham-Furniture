"use client";
import {useState,useEffect,useRef} from 'react';
import Link from 'next/link';
import {ChevronLeft,ChevronRight} from 'lucide-react';

// Original website banners are complete designs (including text and furniture).
// Do not overlay a second text layer or crop them with object-fit:cover.
const slides=[
  {image:'banner-1.webp',mobile:'banner-1-mobile.webp',slug:'bed',title:'Premium Beds'},
  {image:'banner-2.webp',mobile:'banner-2-mobile.webp',slug:'sofa',title:'Luxury Sofas'},
  {image:'banner-3.webp',mobile:'banner-3-mobile.webp',slug:'dining',title:'Dining Tables'},
  {image:'banner-4.webp',mobile:'banner-4-mobile.webp',slug:'mattress',title:'Mattresses'},
  {image:'banner-5.webp',mobile:'banner-5-mobile.webp',slug:'bed',title:'Custom Furniture'}
];
export default function HeroSlider(){
  const [current,setCurrent]=useState(0);
  const touchStartX=useRef(null);
  const onTouchStart=e=>{touchStartX.current=e.touches[0]?.clientX ?? null};
  const onTouchEnd=e=>{if(touchStartX.current===null)return;const delta=e.changedTouches[0].clientX-touchStartX.current;touchStartX.current=null;if(Math.abs(delta)>45)setCurrent(v=>(v+(delta<0?1:slides.length-1))%slides.length)};
  useEffect(()=>{const t=setInterval(()=>setCurrent(v=>(v+1)%slides.length),5000);return ()=>clearInterval(t)},[]);
  return <section className="premium-hero full-image-hero" aria-label="Furniture collections">
    <div className="premium-hero-frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {slides.map((s,i)=><Link key={s.image} href={'/category?category='+s.slug} className={'premium-hero-slide '+(current===i?'is-active':'')} aria-hidden={current!==i} tabIndex={current===i?0:-1} aria-label={'Explore '+s.title}>
        <picture><img src={'/assets/'+s.image} alt={s.title+' at Saksham Furniture'} fetchPriority={i===0?'high':'auto'} loading={i===0?'eager':'lazy'}/></picture>
      </Link>)}
      <button type="button" className="hero-prev" onClick={()=>setCurrent(v=>(v+slides.length-1)%slides.length)} aria-label="Previous slide"><ChevronLeft/></button>
      <button type="button" className="hero-next" onClick={()=>setCurrent(v=>(v+1)%slides.length)} aria-label="Next slide"><ChevronRight/></button>
      <div className="hero-dots">{slides.map((s,i)=><button type="button" aria-label={'Slide '+(i+1)} aria-current={current===i} onClick={()=>setCurrent(i)} key={s.image} className={current===i?'active':''}/>)}</div>
    </div>
  </section>
}
