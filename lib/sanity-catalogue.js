
import { sanityClient } from './sanity'
import { clean, number, photo } from './catalogue'

const query = `*[
  _type == "product" &&
  !(_id in path("drafts.**"))
]{
  _id, productId, name, category, imageUrl,
  "sanityImage": images[0].asset->url,
  size, storage, price, mrp, material,
  description, status, offerLabel, offerActive,
  variants
}`

function convertVariant(v, product) {
  return {
    id: product.productId,
    name: product.name,
    category: clean(product.category),
    size: v.size || '',
    storage: v.storage || '',
    price: number(v.price),
    mrp: number(v.mrp),
    material: v.material || product.material || '',
    image: product.sanityImage || photo(product.imageUrl, product.category),
    offer_label: v.offerLabel || '',
    offer_active: v.offerActive || false,
  }
}

export async function getSanityProducts() {
  const records = await sanityClient.fetch(query)

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('Sanity catalogue empty')
  }

  const groupedIds = new Set()

  // Each grouped product has four variants.
  for (const p of records) {
    if (Array.isArray(p.variants) && p.variants.length > 0) {
      groupedIds.add(p._id)
    }
  }

  const products = records
    .filter(p => p.name && number(p.price) > 0)
    .filter(p => {
      // The four old variant rows are still in Sanity.
      // Keep grouped main documents and exclude old rows
      // using matching category, name and image URL.
      if (groupedIds.has(p._id)) return true

      return !records.some(main =>
        groupedIds.has(main._id) &&
        main._id !== p._id &&
        String(main.name).trim().toLowerCase() ===
          String(p.name).trim().toLowerCase() &&
        clean(main.category) === clean(p.category) &&
        String(main.imageUrl || '') === String(p.imageUrl || '')
      )
    })
    .map(p => {
      const variants = Array.isArray(p.variants) && p.variants.length
        ? p.variants.map(v => convertVariant(v, p))
        : [convertVariant(p, p)]

      const base =
        variants.find(v =>
          /queen/i.test(v.size) &&
          /without|no storage|non.storage/i.test(v.storage)
        ) ||
        variants.reduce((a, b) =>
          number(a.price) <= number(b.price) ? a : b
        )

      return {
        ...base,
        id: p.productId || p._id,
        name: p.name,
        category: clean(p.category),
        image: p.sanityImage || photo(p.imageUrl, p.category),
        description: p.description || '',
        material: p.material || '',
        status: p.status || '',
        featured: 'no',
        variants,
        slug: encodeURIComponent(p.name),
      }
    })

  return products
}
