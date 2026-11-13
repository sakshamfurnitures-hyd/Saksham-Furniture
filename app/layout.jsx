import './globals.css';import PWARegister from '../components/PWARegister';
export const metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://sakshamfurniture.in'),title:'Saksham Furniture | Premium Furniture in Hyderabad',description:'Premium furniture at factory-direct prices in Hyderabad.',icons:{icon:'/icon.svg',apple:'/app-icon-192.png'},manifest:'/manifest.webmanifest',applicationName:'Saksham Furniture'};
export const viewport={themeColor:'#173D36',width:'device-width',initialScale:1};
export default function RootLayout({children}){return <html lang="en"><body><PWARegister/>{children}</body></html>}
