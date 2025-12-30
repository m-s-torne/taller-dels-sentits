"use client"
import Link from "next/link";
import { useFooter } from "../_hooks/useFooter";
import { DropDown } from "./ui/DropDown";
import { servicesMenu } from "../_lib/servicesMenu";
import { useIsActive } from "../_hooks/useIsActive";
import { AnimatePresence } from "motion/react";
import { useFooterDropdown } from "../_hooks/useFooterDropDown";

const Footer = () => {
  const isActive = useIsActive();

  const {
    isFooterMenuOpen,
    setIsFooterMenuOpen
  } = useFooter();

  const {
    servicesRef,
    footerRef,
  } = useFooterDropdown({isFooterMenuOpen, setIsFooterMenuOpen})

  return (
  <footer ref={footerRef} className="bg-jacarta py-8 px-4 sm:px-6 md:px-10 overflow-x-hidden">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      {/* Legal Links */}
      <div className="flex gap-4 text-xs">
        <Link 
          className="text-lilac! hover:text-shakespeare! transition-colors duration-200"
          href="/avis-legal"
        >
          Avís Legal
        </Link>
        <span className="text-lilac/40">|</span>
        <Link 
          className="text-lilac! hover:text-shakespeare! transition-colors duration-200"
          href="/privacitat"
        >
          Política de Privacitat
        </Link>
      </div>
      
      {/* Navigation Links */}
      <nav>
        <ul className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-7 text-xs sm:text-sm tracking-wide hover:cursor-pointer">
          <li>
            <Link 
              className={`hover:text-shakespeare! text-lilac! transition-colors duration-200 ${
                isActive('/') ? 'text-shakespeare' : ''
              }`}
              href="/"
            >
              INICI
            </Link>
          </li>
          <li ref={servicesRef} className="relative hover:cursor-pointer">
            <button 
              className={`hover:text-shakespeare! text-lilac! transition-colors duration-200 ${
                isActive('/artterapia') || isActive('/artperdins') || isActive('/centres') ? 'text-shakespeare' : ''
              }`}
              onClick={() => setIsFooterMenuOpen(prev => !prev)}
            >
              SERVEIS
            </button>
            <AnimatePresence>
              {isFooterMenuOpen && (
                <DropDown
                  variant='footer'
                  services={servicesMenu}
                  setIsServicesOpen={setIsFooterMenuOpen}
                  isActive={isActive}
                />
              )}
            </AnimatePresence>
          </li>
          <li>
            <Link 
              className={`hover:text-shakespeare! text-lilac! transition-colors duration-200 ${
                isActive('/qui-som') ? 'text-shakespeare' : ''
              }`}
              href="/qui-som"
            >
              QUI SOM?
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
  );
};

export default Footer;
