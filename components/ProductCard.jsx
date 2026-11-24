import ProductActions from './ProductActions';
import SafeProductImage from './SafeProductImage';
import Link from 'next/link';
import {money,photo,productPath,number} from '../lib/catalogue';
export default function ProductCard({product:p}){
 const mrp=number(p.mrp),price=number(p.price),active=!/^(no|false|0|off)$/i.test(String(p.offer_active||'yes'));
 const discount=active&&mrp>price&&price>0?Math.round((mrp-price)/mrp*100):0;
 return <div className="group relative overflow-hidden rounded-xl border border-forest/10 bg-white shadow-sm hover:shadow-xl transition-all"><div className="sf-product-image relative"><ProductActions name={p.name} category={p.category} compact/><Link href={productPath(p)} aria-label={'View '+p.name}><SafeProductImage src={p.image} category={p.category} alt={p.name} className="group-hover:scale-105 transition-transform duration-300"/></Link></div><Link href={productPath(p)} className="block p-3 md:p-4"><h3 className="text-forest text-sm md:text-base font-semibold line-clamp-2 min-h-10">{p.name}</h3><div className="flex flex-wrap gap-2 items-center mt-2"><span className="text-gold font-bold text-lg">{money(p.price)}</span>{discount>0&&<><span className="text-xs line-through text-gray-500">{money(mrp)}</span><span className="sf-discount">{discount}% OFF</span></>}</div><span className="text-forest text-xs font-semibold mt-2 inline-block">View Details →</span></Link></div>
}
