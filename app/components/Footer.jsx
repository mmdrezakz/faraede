"use client";
import React from "react";
import Image from "next/image";

// ICONS
import { RiNextjsFill } from "react-icons/ri";
import { FaRegCopyright, FaInstagram, FaReact } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";

import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toPersianNumber } from "./comments/utils";

export default function Footer() {
  const pathName = usePathname();
  const isHome = pathName === "/";
  return (
    <footer className="bg-linear-to-b from-[#001a33] to-[#001122] py-10 border-white border-t-2 text-white">
      <div className="flex md:flex-row flex-col justify-between items-center gap-8 mx-auto px-6 container">
        {/* بخش لوگو و تماس */}
        <div className="flex items-center gap-4">
          {/* لوگو */}
          <Image
            className=""
            src={"/favicon/1mmd.png"}
            width={100}
            height={100}
            alt="LOGO"
          />{" "}
          {/* اطلاعات تماس */}
          <div>
            <p className="font-bold text-lg">فرا ایده</p>
            <p className="flex justify-start items-center gap-1.5 text-sm">
              <span>
                <FaInstagram />
              </span>
              <span
                style={{
                  direction: "ltr",
                }}
              >
                @yourid
              </span>
            </p>
            <p className="flex justify-start items-center gap-1.5 text-sm">
              <span>
                <BsFillTelephoneFill />
              </span>
              <span
                style={{
                  direction: "ltr",
                }}
              >
                {" "}
                +{toPersianNumber(989921499833)}
              </span>
            </p>
          </div>
        </div>

        {/* لینک‌ها یا منو */}
        <div className="flex gap-6 text-sm">
          {isHome && (
            <>
              <ScrollLink
                to="team"
                duration={500}
                smooth={true}
                className="hover:text-gray-300 cursor-pointer"
              >
                اعضاء
              </ScrollLink>
              <ScrollLink
                to="work"
                duration={500}
                smooth={true}
                className="hover:text-gray-300 cursor-pointer"
              >
                نمونه کار
              </ScrollLink>
            </>
          )}
          <Link className="hover:text-gray-300" href={"/"}>
            خانه
          </Link>
          <Link className="hover:text-gray-300" href={"/login"}>
            ورود
          </Link>
          <Link className="hover:text-gray-300" href={"/register"}>
            ثبت نام
          </Link>
        </div>

        {/* بخش کپی‌رایت */}
        <div className="flex md:flex-row flex-col items-center gap-2 text-gray-400 text-xs text-center md:text-right">
          <span className="flex justify-center items-center gap-1.5">
            <FaRegCopyright color="white" size={"14px"} />{" "}
            {new Date().getFullYear()}
            همه حقوق محفوظ است | ساخته شده با
          </span>
          <span className="flex justify-center items-center gap-1">
            <RiNextjsFill color="white" size={"16px"} />
            <FaReact color="white" size={"16px"} />
          </span>
          طراحی توسط محمدرضا کاظمی
        </div>
        {/* <Image alt='Enamad' src={"/eNamad.png"} width={200} height={100}/> */}
        <a
          referrerPolicy="origin"
          target="_blank"
          href="https://trustseal.enamad.ir/?id=705807&Code=WQL6bXGoO4G6gdQg5axDUQdT6qsgCbSn"
        >
          <img
            referrerPolicy={"origin"}
            src="https://trustseal.enamad.ir/logo.aspx?id=705807&Code=WQL6bXGoO4G6gdQg5axDUQdT6qsgCbSn"
            alt=""
            style={{ cursor: "pointer" }}
            code="WQL6bXGoO4G6gdQg5axDUQdT6qsgCbSn"
          />
        </a>
      </div>
    </footer>
  );
}
