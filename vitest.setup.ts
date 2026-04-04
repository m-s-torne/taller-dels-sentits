import { vi } from 'vitest';

// Mock siteConfig globally for all tests
vi.mock('@/app/_lib/siteConfig', () => ({
  siteConfig: {
    siteUrl: 'http://localhost:3000',
    ownerName: 'Miriam Test Owner',
    ownerNif: '12345678A',
    businessName: 'Taller dels Sentits',
    businessAddress: 'Test Address, Barcelona',
    contactEmail: 'contact@example.com',
    contactPhone: '600000000',
    contactPhoneWa: '+34 675 20 62 04',
    contactEmailSchools: 'schools@example.com',
  },
}));
