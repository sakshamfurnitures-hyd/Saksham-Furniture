// Server-only: Google Places API (New). Never expose the API key in client code.
const MAPS_URL = 'https://maps.app.goo.gl/xgejacoV8shzLoXr9';
export {MAPS_URL};
export async function getGoogleReviews(){
  const key=process.env.GOOGLE_PLACES_API_KEY;
  const placeId=process.env.GOOGLE_PLACE_ID;
  if(!key||!placeId)return {configured:false,reviews:[],mapsUrl:MAPS_URL};
  try{
    const response=await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,{
      headers:{'X-Goog-Api-Key':key,'X-Goog-FieldMask':'displayName,rating,userRatingCount,reviews,googleMapsUri'},
      next:{revalidate:3600},signal:AbortSignal.timeout(8000)
    });
    if(!response.ok)throw new Error(`Google Places HTTP ${response.status}`);
    const data=await response.json();
    return {configured:true,rating:typeof data.rating==='number'?data.rating:null,count:typeof data.userRatingCount==='number'?data.userRatingCount:null,mapsUrl:data.googleMapsUri||MAPS_URL,reviews:(data.reviews||[]).map(r=>({name:r.authorAttribution?.displayName||'Google customer',photo:r.authorAttribution?.photoUri||null,profileUrl:r.authorAttribution?.uri||null,rating:r.rating||0,text:r.originalText?.text||r.text?.text||'',date:r.relativePublishTimeDescription||''})).filter(r=>r.text)};
  }catch(e){console.error('Google reviews temporarily unavailable:',e.message);return {configured:true,unavailable:true,reviews:[],mapsUrl:MAPS_URL};}
}
