const API=process.env.GOOGLE_SHEETS_API_URL||'https://script.google.com/macros/s/AKfycbyN490oB-oX7vb7RsPKrMazJHXoxC2Fl820isPc22HsAkewKUpthtiC2BKsL3HlqjbD/exec';
export const categoryLabels={'bed':'Beds','sagwan-bed':'Sagwan Wood Bed','upholstery-bed':'Upholstery Bed','sofa':'Sofas','teakwood-sofa':'Teakwood Sofas','dining':'Dining','mattress':'Mattress','dressing-table':'Dressing Table','chairs':'Chairs','wardrobe':'Wardrobe'};
export const categoryImages={'bed':'bed.webp','sagwan-bed':'category-sagwan-bed.webp','upholstery-bed':'category-upholstery-bed.webp','sofa':'sofa.webp','teakwood-sofa':'category-teakwood-sofa.webp','dining':'dining.webp','mattress':'mattress.webp','dressing-table':'category-dressing-table.webp','chairs':'category-chairs.webp','wardrobe':'category-wardrobe.webp'};
export function clean(v){v=String(v||'').toLowerCase().trim();return /teak[ -]?wood[ -]?sofa|teak[ -]?sofa|sagwan[ -]?sofa/.test(v)?'teakwood-sofa':/sagwan|teak wood bed|teakwood bed/.test(v)?'sagwan-bed':/upholst|fabric bed|cushion bed/.test(v)?'upholstery-bed':/dressing|dresser|vanity table/.test(v)?'dressing-table':/wardrobe|almirah|cupboard/.test(v)?'wardrobe':/chair|seating chair/.test(v)?'chairs':/bed|cot/.test(v)?'bed':v.includes('sofa')?'sofa':v.includes('dining')?'dining':v.includes('mattress')?'mattress':v||'other'}
export function number(v){return Number(String(v??'').replace(/[^0-9.]/g,''))||0}
export function money(v){return '₹'+number(v).toLocaleString('en-IN')}
export function photo(url,c){
 const u=String(url||'').trim();
 const id=u.match(/drive\.google\.com\/file\/d\/([\w-]+)/i)?.[1]
   ||u.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?[^#]*[?&]id=([\w-]+)/i)?.[1]
   ||u.match(/[?&]id=([\w-]+)/i)?.[1];
 if(id)return 'https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1200';
 return /^https?:\/\//i.test(u)?u:'/assets/'+(categoryImages[clean(c)]||'bed.webp');
}
const value=(r,...keys)=>{const normalized=Object.fromEntries(Object.entries(r||{}).map(([k,v])=>[String(k).toLowerCase().replace(/[^a-z0-9]/g,''),v]));for(const k of keys){const v=normalized[String(k).toLowerCase().replace(/[^a-z0-9]/g,'')];if(v!==undefined&&v!==null&&String(v).trim()!=='')return v}return ''};
const truthy=v=>/^(yes|true|1|y|best selling|bestselling)$/i.test(String(v||'').trim());
const normalizeRow=r=>{const mrp=value(r,'mrp','original price','original_price');const offer=value(r,'offer price','offer_price','offerprice','price','starting price');const price=number(offer)>0?offer:mrp;return {id:value(r,'id'),name:String(value(r,'name','product_name','product name','title')).trim(),category:clean(value(r,'category')),price,mrp,offer_label:value(r,'offer_label'),offer_active:value(r,'offer_active'),image:value(r,'image_url','image url','image'),size:value(r,'size'),storage:value(r,'storage'),material:value(r,'material'),description:value(r,'description','details'),status:value(r,'status'),featured:truthy(value(r,'best selling','best_selling','bestselling','featured'))?'yes':'no'};};
let lastGood=null,lastSuccess=0,inflight=null;
const FRESH_MS=60_000;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function fetchCatalogue(){let error;for(let attempt=0;attempt<3;attempt++){try{
 const response=await fetch(API,{cache:'no-store',signal:AbortSignal.timeout(18000)});
 if(!response.ok)throw new Error('Sheet API HTTP '+response.status);
 const data=await response.json();
 if(data&&data.error)throw new Error('Sheet API error');
 const rows=Array.isArray(data)?data:Array.isArray(data.products)?data.products:Array.isArray(data.data)?data.data:Array.isArray(data.rows)?data.rows:null;
 if(!rows)throw new Error('Unexpected catalogue API format');
 const products=rows.map(normalizeRow).filter(p=>p.name&&number(p.price)>0&&!['inactive','hidden','draft'].includes(String(p.status).toLowerCase().trim()));
 // A suddenly empty API response must not erase a previously valid catalogue.
 if(!products.length&&lastGood?.length)throw new Error('Unexpected empty catalogue');
 lastGood=products;lastSuccess=Date.now();return products;
 }catch(e){error=e;if(attempt<2)await delay(450*(attempt+1));}}
 console.error('Catalogue fetch failed after retries:',error?.message);
 if(lastGood)return lastGood;
 throw new Error('CATALOGUE_TEMPORARILY_UNAVAILABLE');
}
export async function getProducts(){if(lastGood&&Date.now()-lastSuccess<FRESH_MS)return lastGood;if(!inflight)inflight=fetchCatalogue().finally(()=>{inflight=null});return inflight;}

export async function getCatalogueState() {
  try {
    const products = await getWebsiteProducts()
    return { products, unavailable: false }
  } catch (error) {
    console.error('Catalogue unavailable:', error.message)
    return { products: [], unavailable: true }
  }
}


export function groupProducts(rows) {
  const groups = new Map()

  for (const p of rows) {
    const key = p.category + '|' + p.name.toLowerCase()

    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(p)
  }

  return [...groups.values()].map(items => {
    const variants = items.flatMap(p =>
      Array.isArray(p.variants) && p.variants.length
        ? p.variants
        : [p]
    )

    const base =
      variants.find(p =>
        /queen/i.test(String(p.size)) &&
        /without\s*storage|no\s*storage|non[ -]?storage/i.test(
          String(p.storage)
        )
      ) ||
      variants.reduce((a, b) =>
        number(b.price) < number(a.price) ? b : a,
        variants[0]
      )

    return {
      ...items[0],
      ...base,
      variants,
      slug: encodeURIComponent(items[0].name),
    }
  })
}

export function productPath(p){return '/product?category='+encodeURIComponent(p.category)+'&name='+encodeURIComponent(p.name)}
export function orderLink(p,customize=false){const url='https://sakshamfurniture.in'+productPath(p)+'&preview='+encodeURIComponent(String(p.id||p.image||p.name).slice(0,80));const msg=[customize?'Hello Saksham Furniture, I want to customize this product:':'Hello Saksham Furniture, I want to order this product:', 'Product: '+p.name,p.size?'Size: '+p.size:'',p.storage?'Storage: '+p.storage:'',p.material?'Material: '+p.material:'',number(p.mrp)>number(p.price)?'MRP: '+money(p.mrp):'','Offer Price: '+money(p.price),'Product photo and details: '+url,customize?'Please share customization options for size, material, colour and design.':'Please confirm availability and delivery.'].filter(Boolean).join('\n');return 'https://wa.me/918523001836?text='+encodeURIComponent(msg)}

export async function getWebsiteProducts() {
  try {
    const { getSanityProducts } = await import('./sanity-catalogue')
    const products = await getSanityProducts()
    if (products.length) return products
  } catch (error) {
    console.error('Sanity unavailable, using Google Sheets:', error.message)
  }
  return getProducts()
}

