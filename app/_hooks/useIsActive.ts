import { usePathname } from 'next/navigation';

export const useIsActive = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return isActive;
};
