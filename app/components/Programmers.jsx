import Image from 'next/image';
import React from 'react';
import { FaGithub, FaTelegram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const programmers = [
  {
    name: 'محمدرضا کاظمی',
    degree: 'کارشناسی مهندسی نرم افزار',
    specialty: 'فرانت اند',
    experience: 'بیش از سه سال',
    image: '/programmer/mohammad1.jpg',
    personalSite: 'https://example.com',
    resume: 'https://example.com/resume.pdf',
    social: {
      github: 'https://github.com/user1',
      telegram: 'https://t.me/username1',
      email: 'mailto:mohammad@example.com',
    },
  },
  {
    name: 'امیر پارسا',
    degree: 'مدرک بین المللی طراحی وب',
    specialty: 'بک اند',
    experience: 'بیش از دو سال',
    image: '/programmer/amir1.jpg',
    personalSite: 'https://example.com',
    resume: 'https://example.com/resume.pdf',
    social: {
      github: 'https://github.com/user2',
      telegram: 'https://t.me/username2',
      email: 'mailto:amir@example.com',
    },
  },
  {
    name: 'عارف مرادی',
    degree: 'کارشناسی مهندسی نرم افزار',
    specialty: 'سئو',
    experience: 'بیش از دو سال',
    image: '/programmer/aref1.jpg',
    personalSite: 'https://example.com',
    resume: 'https://example.com/resume.pdf',
    social: {
      github: 'https://github.com/user2',
      telegram: 'https://t.me/username2',
      email: 'mailto:amir@example.com',
    },
  },
];

export default function Programmers() {
  return (
    <section className="justify-items-center items-center grid grid-cols-1 xl:grid-cols-4 bg-linear-to-b from-gray-100 to-[#002549] pb-10">
      {/* بخش تیتر و لوگو - در موبایل و تبلت بالا، در xl سمت راست */}
      <div className="right mb-8 lg:pr-6 text-center xl:text-right">
        <h2 className="mb-4 font-bold text-4xl">برنامه نویسان تیم فرا ایده</h2>
        <p className="mx-auto xl:mx-0 max-w-96 text-gray-800 text-xl">
          تیم برنامه نویسی ما رو به توسعه میباشد و پیش بینی میگردد طی سال جاری تعداد برنامه نویسان ما به بالای پانزده نفر برسد
        </p>
        <div className="mt-6">
          <Image
            width={200}
            height={300}
            alt="zero-one"
            src="/programmer/zero.png"
            className="mx-auto xl:mx-0"
          />
        </div>
      </div>

      {/* بخش کارت‌ها - col-span-3 فقط در xl فعال می‌شه */}
      <div className="left xl:col-span-3 w-full">
        <main className="gap-8 grid grid-cols-1 md:grid-cols-3 mx-auto px-5">
          {programmers.map((person, index) => (
            <div
              key={index}
              className="bg-[#101828] shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden text-blue-100 hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <Image
                  src={person.image}
                  width={300}
                  height={400}
                  alt={person.name}
                  className="mask-b-from-70% mask-l-from-70% mask-r-from-70% mask-t-from-70% w-full h-56 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="space-y-3 text-center">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">نام:</p>
                    <p>{person.name}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">مدرک:</p>
                    <p>{person.degree}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">تخصص:</p>
                    <p>{person.specialty}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">سابقه فعالیت:</p>
                    <p>{person.experience}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <a
                    href={person.personalSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0066ff] hover:bg-[#0251c7] px-6 py-2 rounded-lg font-bold text-white text-sm transition-all"
                  >
                    سایت شخصی
                  </a>
                  <a
                    href={person.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0066ff] hover:bg-[#0251c7] px-6 py-2 rounded-lg font-bold text-white text-sm transition-all"
                  >
                    رزومه کاری
                  </a>
                </div>

                <div className="flex justify-center gap-7 mt-8">
                  {person.social.github && (
                    <a
                      href={person.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-all duration-300"
                      title="گیت‌هاب"
                    >
                      <FaGithub className="w-7 h-7" />
                    </a>
                  )}

                  {person.social.telegram && (
                    <a
                      href={person.social.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#229ED9] transition-all duration-300"
                      title="تلگرام"
                    >
                      <FaTelegram className="w-7 h-7" />
                    </a>
                  )}

                  {person.social.email && (
                    <a
                      href={person.social.email}
                      className="text-gray-400 hover:text-red-400 transition-all duration-300"
                      title="ایمیل"
                    >
                      <SiGmail className="w-8 h-8" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </section>
  );
}