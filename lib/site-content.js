import {cache} from 'react'
import {sanityClient} from './sanity'
import {categories as defaults} from './categories'
export const getSiteContent=cache(async()=>{
 try{
 const data=await sanityClient.fetch(`{"banners": *[_type=="banner" && !(_id in path("drafts.**"))]|order(order asc){_id,title,active,category,start,end,"image":desktop.asset->url,"mobile":mobile.asset->url},"categories": *[_type=="furnitureCategory" && !(_id in path("drafts.**"))]|order(order asc){title,code,active,order,"image":image.asset->url},"settings": *[_type=="siteSettings" && !(_id in path("drafts.**"))]|order(_updatedAt desc)[0]}`)
 const map=new Map(defaults.map(([title,code],order)=>[code,{title,code,order}]))
 for(const c of data.categories||[])if(c.code)map.set(c.code,{...map.get(c.code),...c})
 const categories=[...map.values()].filter(c=>c.active!==false).sort((a,b)=>(a.order??99)-(b.order??99)).map(c=>[c.title,c.code,c.image])
 const now=Date.now(); const banners=data.banners?.length?data.banners.filter(b=>b.active!==false&&b.image&&(!b.start||Date.parse(b.start)<=now)&&(!b.end||Date.parse(b.end)>now)).map(b=>({...b,slug:b.category||'bed'})):null
 return {categories,banners,settings:data.settings||{}}
 }catch(e){return {categories:defaults,banners:null,settings:{}}}
})
