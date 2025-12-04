"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation';

interface FooterProps {
  logoImg: string;
}

const Footer = ({ logoImg }: FooterProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
  <footer className="bg-jacarta py-8 px-4 sm:px-6 md:px-10 overflow-x-hidden">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      {/* Logo */}
      <div className="flex items-center">
        <img 
          className="h-10 sm:h-12"
          src={logoImg} 
          alt="Taller dels Sentits Logo"
        />
      </div>
      
      {/* Navigation Links */}
      <nav>
        <ul className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 text-white text-xs sm:text-sm tracking-wide">
          <li>
            <Link 
              className={`hover:text-[#7B8BC7] transition-colors duration-200 ${
                isActive('/') ? 'text-shakespeare' : ''
              }`}
              href="/"
            >
              INICI
            </Link>
          </li>
          <li>
            <Link 
              className={`hover:text-[#7B8BC7] transition-colors duration-200 ${
                isActive('/serveis') ? 'text-shakespeare' : ''
              }`}
              href="/serveis"
            >
              SERVEIS
            </Link>
          </li>
          <li>
            <Link 
              className={`hover:text-[#7B8BC7] transition-colors duration-200 ${
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
