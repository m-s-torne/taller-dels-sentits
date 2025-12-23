import { useEffect, useRef } from "react";

interface UseFooterDropdownProps {
    isFooterMenuOpen: boolean;
    setIsFooterMenuOpen: (value: boolean) => void;
}

export const useFooterDropdown = ({ 
    isFooterMenuOpen, 
    setIsFooterMenuOpen 
}: UseFooterDropdownProps) => {
    const servicesRef = useRef<HTMLLIElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
                setIsFooterMenuOpen(false);
            }
        };

        if (isFooterMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFooterMenuOpen, setIsFooterMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            if (isFooterMenuOpen) {
                setIsFooterMenuOpen(false);
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting && isFooterMenuOpen) {
                    setIsFooterMenuOpen(false);
                }
            },
            { threshold: 0.1 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isFooterMenuOpen, setIsFooterMenuOpen]);

    return {
        servicesRef,
        footerRef,
    }
}