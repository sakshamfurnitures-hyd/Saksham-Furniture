import {sanityClient} from './sanity'
import {clean,number,photo} from './catalogue'
export async function getSanityProducts(){
 const records=await sanityClient.fetch(`*[_type == "product" && !(_id in path("drafts.**"))]{..., "photos": images[].asset->url}`)
 if(!Array.isArray(records)) throw Error('Invalid catalogue')
 const cat=p=>clean(clean(p.sourceCategory)==='teakwood-sofa'&&clean(p.category)==='sofa'?'teakwood-sofa':p.category)
 const key=p=>cat(p)+'|'+String(p.name).trim().toLowerCase()
 const mains=records.filter(p=>p.variants?.length)
 const covered=p=>mains.some(m=>key(m)===key(p)&&m.imageUrl&&m.imageUrl===p.imageUrl&&m.variants.some(v=>String(v.size||'').trim().toLowerCase()===String(p.size||'').trim().toLowerCase()&&String(v.storage||'').trim().toLowerCase()===String(p.storage||'').trim().toLowerCase()))
 return records.filter(p=>p.name && !p.archivedVariant && !['inactive','hidden','draft'].includes(String(p.status).toLowerCase()) && (p.variants?.length||!covered(p))).flatMap(p=>{
 const category=cat(p), images=(p.photos||[]).filter(Boolean), image=images[0]||photo(p.imageUrl,category)
 const common={id:p.productId||p._id,name:p.name,category,image,images,description:p.description||'',material:p.material||'',featured:p.featured?'yes':'no',status:p.status||'active'}
 const variants=(p.variants?.length?p.variants:[p]).filter(v=>number(v.price)>0).map(v=>({...common,size:v.size||'',storage:v.storage||'',price:number(v.price),mrp:number(v.mrp),material:v.material||common.material,offer_label:v.offerLabel||'',offer_active:v.offerActive??p.offerActive??true}))
 if(!variants.length)return []
 return [{...common,...variants[0],variants}]
 })
}
