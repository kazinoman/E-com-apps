"use client";

import Link from "next/link";
import { Globe, MessageSquare } from "lucide-react";
import { FiInstagram } from "react-icons/fi";
import { Container } from "../common/Container";

export function Footer() {
  return (
    <footer className="bg-header pt-16 md:pb-8 mt-auto text-muted-foreground">
      <Container className="grid grid-cols-1 items-start md:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-4xl font-bold text-primary tracking-tighter">
            LUXE
          </Link>
          <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm">
            Crafting timeless elegance for the modern individual. A global atelier of fine garments and curated
            accessories.
          </p>
        </div>

        <div className="space-y-6 ">
          <h3 className="text-[14px] font-semibold text-primary uppercase tracking-wider">The Maison</h3>
          <ul className="space-y-4 ">
            <li>
              <Link
                href="#"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                Atelier
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                Sustainability
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                Careers
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-[14px] font-semibold text-primary uppercase tracking-wider">Customer Care</h3>
          <ul className="space-y-4">
            <li>
              <Link
                href="#"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                Store Locator
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                Size Guide
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-[14px] font-semibold text-primary uppercase tracking-wider">Contact</h3>
          <ul className="space-y-4">
            <li>
              <a
                href="mailto:concierge@luxe.com"
                className="text-[14px] text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-all"
              >
                concierge@luxe.com
              </a>
            </li>
            <li>
              <span className="text-[14px] text-muted-foreground">+1 800 LUXE ART</span>
            </li>
          </ul>
          <div className="flex gap-4 pt-2">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Globe size={20} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <FiInstagram size={20} strokeWidth={1.5} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </Container>

      <div className="border-t border-[#DCD6D6] pt-8 text-center">
        <p className="text-[13px] text-[#6B6565]">
          © {new Date().getFullYear()} LUXE INTERNATIONAL. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
