// app/packages/[slug]/page.js
import CommentSection from "../../components/Comment-Section";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import PackageSwiper from "../../components/PackageSwiper";
import Image from "next/image";
import { notFound } from "next/navigation";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import FavoriteButton from "../../components/FavoriteButton";
import AddToCartButton from "../../components/AddToCartBtn";
import { toPersianNumber } from "../../components/comments/utils";

// ایجاد Pool برای PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ایجاد adapter با Pool
const adapter = new PrismaPg(pool);

// ایجاد Prisma Client
const prisma = new PrismaClient({ adapter });

let numberphone = "09921499833";
// تابع برای گرفتن همه پکیج‌ها
async function getAllPackages() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { createdAt: "asc" },
    });
    return packages;
  } catch (error) {
    console.error("Error fetching all packages:", error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const packages = await prisma.package.findMany({
      select: {
        slugId: true,
      },
    });

    return packages.map((pkg) => ({
      slug: pkg.slugId,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

async function getPackage(slug) {
  try {
    const pkg = await prisma.package.findUnique({
      where: { slugId: slug },
    });
    return pkg;
  } catch (error) {
    console.error("Error in getPackage:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const pkg = await getPackage(slug);

    if (!pkg) {
      return {
        title: "پکیج یافت نشد | فرا ایده",
        description: "چنین پکیجی وجود ندارد یا ممکن است حذف شده باشد.",
      };
    }

    return {
      title: `${pkg.title} | فرا ایده`,
      description:
        pkg.description?.substring(0, 150) ||
        "سفارش سایت اختصاصی با طراحی منحصر به فرد و ارزان قیمت و پشتیبانی 24 ساعته",
      openGraph: {
        images: [pkg.image],
      },
    };
  } catch (error) {
    return {
      title: "پکیج | فرا ایده",
      description: "مشاهده و خرید پکیج‌های آموزشی فرا ایده",
    };
  }
}
export default async function PackagePage({ params }) {
  const { slug } = await params;

  try {
    // ۱. پکیج فعلی رو از دیتابیس بگیر
    const pkg = await prisma.package.findUnique({
      where: { slugId: slug },
    });
    if (!pkg) {
      await prisma.$disconnect();
      return notFound();
    }
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: pkg.title,
      description: pkg.description,
      image: pkg.image,
      offers: {
        "@type": "Offer",
        price: pkg.price,
        priceCurrency: "IRR",
        availability:
          pkg.price === "0"
            ? "https://schema.org/ContactForAvailability"
            : "https://schema.org/InStock",
      },
    };

    function formatPrice(price) {
      if (!price && price !== 0) return "۰ تومان";
      const amount = Number(price);
      if (isNaN(amount) || amount === 0) return "۰ تومان";
      return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
    }
    // ۲. همه پکیج‌ها رو برای PackageSwiper بگیر
    const allPackages = await getAllPackages();

    // ۳. ارتباط رو قطع کن
    await prisma.$disconnect();

    // ۴. features رو از JSON پردازش کن
    let features = [];
    try {
      if (typeof pkg.features === "string") {
        features = JSON.parse(pkg.features);
      } else if (Array.isArray(pkg.features)) {
        features = pkg.features;
      }
    } catch (error) {
      console.error("Error parsing features:", error);
      features = [];
    }

    return (
      <>
        <header className="bg-[#1d2433]">
          <Navbar />
        </header>

        <main className="bg-linear-to-b flex flex-col justify-center items-center min-h-screen from-[#001122] to-[#002233]">
          <div className="px-6 py-16 max-w-7xl mx-auto md:mx-0 text-gray-200 flex flex-col lg:flex-row justify-around items-center">
            <h1 className="md:hidden text-4xl font-bold mb-6">{pkg.title}</h1>
            <Image
              className="rounded-2xl mask-b-from-40% lg:mask-l-from-40%"
              src={`${pkg.image}`}
              alt={pkg.title}
              width={400}
              height={300}
              priority
            />

            <div className="w-[70%] lg:mt-0 mt-8 mr-4 md:mr-40">
              <h1 className="hidden md:block text-4xl font-bold mb-6">
                {pkg.title}
              </h1>
              <p className="text-xl mb-4 underline ">
                {pkg.price === "0"
                  ? "برای خرید تماس بگیرید ."
                  : formatPrice(pkg.price)}
              </p>

              <ul className="space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#0066ff] font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-1 mt-2 mx-5 text-gray-400">
                <p>توضیحات:</p>
                <div className="text-justify">{pkg.description}</div>
              </div>
              <div className=" flex justify-start items-center mt-8 gap-3 md:gap-8">
                {pkg.price === "0" ? (
                  <p className="bg-[#0066ff] hover:bg-[#0251c7] shadow-lg hover:shadow-[#0066ff]/50 py-2 px-4 rounded-2xl">
                    برای خرید تماس بگیرید .
                  </p>
                ) : (
                  <AddToCartButton packageId={pkg.id}>
                    افزودن به سبد خرید
                  </AddToCartButton>
                )}

                <FavoriteButton packageId={pkg.id} />
              </div>
            </div>

            <Image
              src="/favicon/1mmd.png"
              width={400}
              height={400}
              alt="LOGO"
              className="hidden md:block"
            />
          </div>
          <div className="w-full">
            <CommentSection packageId={pkg.id} />
          </div>
        </main>

        <PackageSwiper packages={allPackages} />
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error in PackagePage:", error);
    // سعی کن ارتباط رو قطع کنی حتی اگر خطا داد
    try {
      await prisma.$disconnect();
    } catch (e) {
      // ignore
    }
    return notFound();
  }
}
