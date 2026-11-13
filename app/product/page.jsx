import ProductGallery from '../../components/ProductGallery';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';import Footer from '../../components/Footer';import VariantSelector from '../../components/VariantSelector';import Link from 'next/link';import {getProducts,groupProducts,clean,photo,money,categoryLabels} from '../../lib/catalogue';
async function lookup(params){const products=groupProducts(await getProducts());return products.find(p=>p.category===clean(params.category)&&p.name.toLowerCase()===String(params.name||'').toLowerCase())}
export async function generateMetadata({searchParams}){const params=await searchParams;const p=await lookup(params);if(!p)return {title:'Furniture Product | Saksham Furniture'};const title=p.name+' | '+money(p.price)+' | Saksham Furniture';const description=[p.description,p.material,p.size,'Factory-direct furniture in Hyderabad.'].filter(Boolean).join(' • ').slice(0,250);const image=photo(p.image,p.category);return {title,description,openGraph:{title,description,type:'website',images:[{url:image,alt:p.name}]},twitter:{card:'summary_large_image',title,description,images:[image]}}}
export default async function Product({searchParams}){
 const params=await searchParams;
 const p=await lookup(params);
 const allProducts=p?groupProducts(await getProducts()):[];
 const related=p?allProducts.filter(item=>item.category===p.category&&item.name!==p.name).slice(0,4):[];
 return <><Header/><main className="sf-product-detail mx-auto py-6 md:py-10 min-h-[55vh]">
 {!p?<div><h1 className="text-3xl font-bold text-forest">Product not found</h1><p className="mt-4">The product may have been updated in Google Sheets.</p><Link href="/category" className="inline-block mt-5 text-gold font-bold">Browse furniture →</Link></div>:<>
 <nav className="text-xs text-charcoal/60 mb-5"><Link href="/">Home</Link> / <Link href={'/category?category='+p.category}>{categoryLabels[p.category]||'Furniture'}</Link> / {p.name}</nav>
 <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
 <ProductGallery images={p.variants.map(v=>photo(v.image,p.category))} category={p.category} name={p.name}/>
 <div className="min-w-0"><p className="text-gold uppercase text-xs tracking-widest font-semibold">Saksham Furniture • Factory Direct</p><h1 className="text-2xl md:text-4xl font-semibold text-forest mt-3">{p.name}</h1>
 <VariantSelector variants={p.variants} productName={p.name}/>
 <p className="text-xs text-charcoal/60 mt-4">Confirm stock, final price and delivery with our team.</p>
 <Link href={'/category?category='+p.category} className="inline-block mt-6 text-forest underline">← Back to {categoryLabels[p.category]||'Furniture'}</Link></div></div>{related.length>0&&<section className="mt-12 mb-8" aria-label="Related products"><div className="flex justify-between items-center gap-3 mb-5"><h2 className="text-xl md:text-2xl font-bold text-forest">Related Products</h2><Link href={'/category?category='+p.category} className="text-sm font-semibold text-gold">View All →</Link></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">{related.map(item=><ProductCard key={item.category+'-'+item.name} product={item}/>)}</div></section>}</>}
 </main><Footer/></>
}
