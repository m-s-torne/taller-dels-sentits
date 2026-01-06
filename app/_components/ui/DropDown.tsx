import { motion } from "motion/react"
import Link from "next/link";

interface DropDownProps {
    services: {
        name: string;
        href: string;
    }[];
    setIsServicesOpen: (value: boolean) => void;
    isActive: (value: string) => boolean;
    variant?: 'header' | 'footer';
}

export const DropDown = ({ services, setIsServicesOpen, isActive, variant = 'header' }: DropDownProps) => {
    const isFooter = variant === 'footer';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: isFooter ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isFooter ? 10 : -10 }}
            transition={{ duration: 0.2 }}
            className={`bg-shakespeare shadow-2xl rounded-lg py-3 px-4 min-w-50 z-9999 ${
                isFooter 
                    ? 'fixed bottom-20 right-23' 
                    : 'absolute top-full left-0 mt-2'
            }`}
            >
            <ul className="space-y-3">
                {services.map((service) => (
                <li key={service.href}>
                    <Link
                        href={service.href}
                        onClick={() => setIsServicesOpen(false)}
                        className={`block text-lilac! hover:text-lilac/50! font-light transition-colors duration-200 ${
                            isActive(service.href) ? 'font-bold!' : ''
                        }`}
                    >
                        {service.name}
                    </Link>
                </li>
                ))}
            </ul>
        </motion.div>
    )
}