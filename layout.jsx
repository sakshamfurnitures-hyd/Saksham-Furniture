import './globals.css';import PWARegister from '../components/PWARegister';
export const metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://sakshamfurniture.in'),title:'Saksham Furniture | Premium Furniture in Hyderabad',description:'Premium furniture at factory-direct prices in Hyderabad.',icons:{icon:[{url:'/favicon.ico'},{url:'/favicon-32.png',sizes:'32x32',type:'image/png'},{url:'/favicon-48.png',sizes:'48x48',type:'image/png'}],apple:'/app-icon-180.png'},manifest:'/manifest.webmanifest',applicationName:'Saksham Furniture'};
export const viewport={themeColor:'#173D36',width:'device-width',initialScale:1};
export default function RootLayout({children}){return <html lang="en"><body><PWARegister/>{children}</body></html>}
