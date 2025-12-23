"use client"
import ButtonComponent from './ui/ButtonComponent';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useHeader } from '@/app/_hooks/useHeader';
import { useIsActive } from '@/app/_hooks/useIsActive';
import { useEffect, useRef } from 'react';
import { DropDown } from './ui/DropDown';
import { servicesMenu } from '@/app/_lib/servicesMenu';

interface HeaderProps {
  logoImg: string;
}

const Header = ({ logoImg }: HeaderProps) => {
  const servicesRef = useRef<HTMLLIElement>(null);
  const {
    show,
    setIsMenuOpen,
    toggleMenu,
    isMenuOpen,
    isServicesOpen,
    toggleServices,
    setIsServicesOpen,
  } = useHeader();
  const isActive = useIsActive();

  // Cerrar el menú de servicios al hacer click fuera (solo en desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };

    // Solo activar el listener si el menú móvil NO está abierto
    if (isServicesOpen && !isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesOpen, isMenuOpen, setIsServicesOpen]);

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: show ? 0 : -100, opacity: show ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center py-4 px-4 sm:px-6 md:px-10 bg-white text-gray-800 shadow-md"
      >
        <Link 
          href="/"
          className="hover:cursor-pointer transition-all ease-in-out duration-300"  
        >
          <img
            className="object-contain h-10 sm:h-12"
            src={logoImg}
            alt="taller dels sentits logo"
          />
        </Link>

        {/* Menú desktop - oculto en mobile */}
        <nav className="hidden md:flex justify-center items-center gap-6 lg:gap-8">
          <ul className="flex gap-8 text-sm font-medium">
            <li>
              <Link 
                className={`hover:text-shakespeare! transition-colors duration-200 ${
                  isActive('/') ? 'text-shakespeare! font-bold' : ''
                }`}
                href="/"
                onClick={() => setIsMenuOpen(false)}
              >
                INICI
              </Link>
            </li>
            <li ref={servicesRef} className="relative">
              <button
                onClick={toggleServices}
                className={`hover:text-shakespeare! hover:cursor-pointer transition-colors duration-200 ${
                  isActive('/artterapia') || isActive('/artperdins') || isActive('/centres') ? 'text-shakespeare! font-bold' : ''
                }`}
              >
                SERVEIS
              </button>
              <AnimatePresence>
                {isServicesOpen && (
                  <DropDown 
                    services={servicesMenu}
                    setIsServicesOpen={setIsServicesOpen}
                    isActive={isActive}
                  />
                )}
              </AnimatePresence>
            </li>
            <li>
              <Link 
                className={`hover:text-shakespeare! transition-colors duration-200 ${
                  isActive('/qui-som') ? 'text-shakespeare! font-bold' : ''
                }`}
                href="/qui-som"
              >
                QUI SOM?
              </Link>
            </li>
          </ul>
          <Link href="/contacte">
            <ButtonComponent
              text="CONTACTA"
            />
          </Link>
        </nav>

        {/* Botón hamburguesa - visible solo en mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden hover:cursor-pointer z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5"
          aria-label="Toggle menu"
        >
          <span className={`w-7 h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-7 h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`w-7 h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </motion.header>

      {/* Modal menú mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.header
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-lilac md:hidden overflow-x-hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8 px-4 sm:px-6 md:px-10">
              <ul className="flex flex-col items-center gap-8 text-lg sm:text-xl font-medium">
                <li>
                  <Link 
                    className={`hover:text-shakespeare! transition-colors duration-200 ${
                      isActive('/') ? 'text-shakespeare' : ''
                    }`}
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    INICI
                  </Link>
                </li>
                <li className="flex flex-col items-center gap-4">
                  <button
                    onClick={toggleServices}
                    className={`hover:text-shakespeare! transition-colors hover:cursor-pointer duration-200 ${
                      isActive('/artterapia') || isActive('/artperdins') || isActive('/centres') ? 'text-shakespeare' : ''
                    }`}
                  >
                    SERVEIS
                  </button>
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center gap-4 text-base"
                      >
                        {servicesMenu.map((service) => (
                          <li key={service.href}>
                            <Link
                              href={service.href}
                              onClick={() => {
                                setIsServicesOpen(false);
                                setIsMenuOpen(false);
                              }}
                              className={`hover:text-shakespeare! hover:cursor-pointer transition-colors duration-200 ${
                                isActive(service.href) ? 'text-shakespeare font-bold' : ''
                              }`}
                            >
                              {service.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                <li>
                  <Link 
                    className={`hover:text-shakespeare! hover:cursor-pointer transition-colors duration-200 ${
                      isActive('/qui-som') ? 'text-shakespeare' : ''
                    }`}
                    href="/qui-som"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    QUI SOM?
                  </Link>
                </li>
              </ul>
              <Link 
                href="/contacte"
                onClick={() => setIsMenuOpen(false)}
              >
                <ButtonComponent text="CONTACTA" />
              </Link>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
