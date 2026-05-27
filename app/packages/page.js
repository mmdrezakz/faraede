
import Image from "next/image";
import Link from "next/link";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import PackageSwiper from "../components/PackageSwiper";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AddToCartButton from "../components/AddToCartBtn";
import FavoriteButton from "../components/FavoriteButton";

// ایجاد Pool برای PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const metadata = {
  title: "همه پکیج‌ها | فرا ایده",
  description: "مشاهده و خرید همه پکیج‌های طراحی سایت فرا ایده",
};

async function getAllPackages() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return packages;
  } catch (error) {
    console.error("Error fetching all packages:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export default async function PackagesPage() {
  const packages = await getAllPackages();


  const schemaData = packages.map(pkg => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": pkg.title,
    "description": pkg.description,
    "image": pkg.image,
    "offers": {
      "@type": "Offer",
      "price": pkg.price,
      "priceCurrency": "IRR",
      "availability": pkg.price === "0" 
        ? "https://schema.org/ContactForAvailability" 
        : "https://schema.org/InStock"
    }
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(schemaData.length === 1 ? schemaData[0] : schemaData) 
        }}
      />
      <header className="bg-[#1d2433]">
        <Navbar />
      </header>
      
      <main className="bg-linear-to-b min-h-screen from-[#001122] to-[#002233] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-100 mb-6">
            همه پکیج‌های فرا ایده
          </h1>
          <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
            از بین پکیج‌های متنوع ما، بهترین گزینه رو برای سایت خودت انتخاب کن
          </p>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div className="bg-[#1d2433] rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-105" key={pkg.id}>
                <Link 
                  href={`/packages/${pkg.slugId}`}
                  
                  
                  >
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    width={400}
                    height={200}
                    className="rounded-xl mb-4 w-full h-48 object-cover"
                    />
                  <h2 className="text-2xl font-bold text-gray-100 mb-2">{pkg.title}</h2>
                  <p className="text-gray-400 mb-4 line-clamp-2">{pkg.description}</p>
                </Link>
                  <div className="text-[#0066ff] flex justify-between items-center gap-2 font-bold">
                    {pkg.price === "0" ? "تماس بگیرید" : `${Number(pkg.price).toLocaleString('fa-IR')} تومان`}
                    
                                  {pkg.price === "0" ? "" :(
                                      <AddToCartButton packageId={pkg.id}>
                                   <p className="text-xs md:text-sm"> افزودن به سبد خرید</p>
                                  </AddToCartButton>
                                  ) }
                  
                                <FavoriteButton  
                                  packageId={pkg.id} 
                                  />
                    
                  </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-20">
              <p className="text-2xl">در حال حاضر پکیجی موجود نیست</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}