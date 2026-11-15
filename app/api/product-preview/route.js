import {NextResponse} from 'next/server';
import {getCatalogueState,groupProducts,clean,photo} from '../../../lib/catalogue';

export const dynamic='force-dynamic';
const MAX_IMAGE_BYTES=8_000_000;

function driveId(url){
 const s=String(url||'');
 return s.match(/drive\.google\.com\/file\/d\/([\w-]+)/i)?.[1]
   ||s.match(/[?&]id=([\w-]+)/i)?.[1]
   ||s.match(/\/d\/([\w-]+)/i)?.[1];
}
function candidates(url){
 const id=driveId(url);
 if(!id)return [url];
 // Google Drive image links are not always directly downloadable by crawlers.
 return [
  `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200`,
  `https://lh3.googleusercontent.com/d/${encodeURIComponent(id)}=w1200`,
  `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`,
 ];
}
async function retrieve(url){
 const target=new URL(url);
 if(!['https:','http:'].includes(target.protocol))throw new Error('Invalid image protocol');
 const res=await fetch(target,{redirect:'follow',cache:'no-store',signal:AbortSignal.timeout(10000),headers:{'Accept':'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8'}});
 const type=(res.headers.get('content-type')||'').split(';')[0].toLowerCase();
 if(!res.ok||!type.startsWith('image/'))throw new Error(`Image response ${res.status} (${type})`);
 if(Number(res.headers.get('content-length')||0)>MAX_IMAGE_BYTES)throw new Error('Image too large');
 const bytes=await res.arrayBuffer();
 if(!bytes.byteLength||bytes.byteLength>MAX_IMAGE_BYTES)throw new Error('Image empty or too large');
 return {bytes,type};
}
export async function GET(request){
 const {searchParams}=new URL(request.url);
 const category=clean(searchParams.get('category'));
 const name=String(searchParams.get('name')||'').trim().toLowerCase();
 const state=await getCatalogueState();
 const product=groupProducts(state.products).find(p=>p.category===category&&p.name.toLowerCase()===name);
 if(!product)return new NextResponse('Product not found',{status:404,headers:{'Cache-Control':'no-store'}});
 // Prefer the actual product photo. Never silently substitute the brand logo or a
 // different product image: that creates misleading WhatsApp link previews.
 const source=photo(product.image,product.category);
 const localFallback=source.startsWith('/assets/')?new URL(source,request.url).toString():null;
 const urls=localFallback?[localFallback]:candidates(source);
 for(const url of urls){try{
  const {bytes,type}=await retrieve(url);
  return new NextResponse(bytes,{headers:{'Content-Type':type,'Cache-Control':'public, max-age=300, s-maxage=3600','Content-Length':String(bytes.byteLength),'X-Content-Type-Options':'nosniff'}});
 }catch(e){console.warn('Product preview image source failed:',e.message)}}
 return new NextResponse('Product image temporarily unavailable',{status:503,headers:{'Cache-Control':'no-store'}});
}
