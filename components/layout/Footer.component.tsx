"use client";

import Link from "next/link";
// import { Facebook, Instagram, Twitter } from "lucide-react";
import { Container } from "../common/Container";

export function Footer() {
  return (
    <footer className="bg-[#333333] pt-16 pb-6 mt-auto text-white">
      <Container className="grid grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 mb-12 items-start">
        {/* Column 1: Branding and Newsletter */}
        <div className="flex flex-col gap-6 col-span-2">
          <Link href="/" className="text-3xl font-black text-white tracking-tight">
            Zaag
          </Link>
          
          <div className="flex flex-col gap-3">
            <span className="text-[13px] text-gray-300">Follow us on social media</span>
            {/* <div className="flex gap-4">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <Facebook size={20} fill="currentColor" strokeWidth={0} />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <Twitter size={20} fill="currentColor" strokeWidth={0} />
              </a>
            </div> */}
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <span className="text-[13px] text-gray-300">Subscribe to our newsletter</span>
            <div className="flex h-[38px] w-full max-w-[280px]">
              <input 
                type="email" 
                placeholder="username@email.com" 
                className="w-full bg-[#474747] text-sm px-3 rounded-l-sm text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-white border-none"
              />
              <button className="bg-white text-[#333333] px-5 text-sm font-medium rounded-r-sm hover:bg-gray-100 transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Our company */}
        <div className="flex flex-col gap-5">
          <h3 className="text-[14px] font-medium text-white">Our company</h3>
          <ul className="flex flex-col gap-3">
            {["About us", "Brands list", "Site maps", "Sign in", "Sign up"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[13px] text-[#A6A6A6] hover:text-white transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Products */}
        <div className="flex flex-col gap-5">
          <h3 className="text-[14px] font-medium text-white">Products</h3>
          <ul className="flex flex-col gap-3">
            {["All products", "Top rated", "Best sellers", "New arrivals", "Popular this week", "Deals of the week"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[13px] text-[#A6A6A6] hover:text-white transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Categories */}
        <div className="flex flex-col gap-5">
          <h3 className="text-[14px] font-medium text-white">Categories</h3>
          <ul className="flex flex-col gap-3">
            {["Food", "Fashion", "Electronics", "Accessories", "Smartphones", "Smart watches"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[13px] text-[#A6A6A6] hover:text-white transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5: Help & support */}
        <div className="flex flex-col gap-5">
          <h3 className="text-[14px] font-medium text-white">Help & support</h3>
          <ul className="flex flex-col gap-3">
            {["FAQ", "Contact us", "How to order", "Customer support", "Return policy", "Privacy policy", "Terms & conditions"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[13px] text-[#A6A6A6] hover:text-white transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-[#474747] pt-6 text-center">
        <p className="text-[12px] text-[#A6A6A6]">
          Copyright 2023 by Zaag Sys LTD.
        </p>
      </div>
    </footer>
  );
}
