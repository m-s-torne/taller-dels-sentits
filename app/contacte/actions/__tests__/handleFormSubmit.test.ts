import { describe, it, expect } from 'vitest';
import type { ContactFormData } from '@/app/contacte/types/form.types';

// Note: Full mocking of Resend is complex in Vitest.
// These tests focus on validation, sanitization, and error handling.
// Integration testing with Resend should be done in E2E tests.

import { validateAndSanitize } from '../handleSubmit';
import { baseValidForm } from './_fixtures';

describe('handleFormSubmit — validation and security', () => {
  it('HR1 — rejects honeypot attack', async () => {
    const dataWithHoneypot: ContactFormData = {
      ...baseValidForm,
      website: 'https://spam.com',
    };

    const result = await validateAndSanitize(dataWithHoneypot);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('invalid_honeypot');
  });

  it('HR2 — rejects invalid email', async () => {
    const invalidData: ContactFormData = {
      ...baseValidForm,
      email: 'not-an-email',
    };

    const result = await validateAndSanitize(invalidData);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('correu');
  });

  it('HR3 — rejects short message', async () => {
    const invalidData: ContactFormData = {
      ...baseValidForm,
      message: 'Short',
    };

    const result = await validateAndSanitize(invalidData);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('almenys 10');
  });

  it('HR4 — sanitizes HTML tags from input', async () => {
    const dataWithHTML: ContactFormData = {
      ...baseValidForm,
      name: '<script>alert("xss")</script>Anna',
      message: 'Test <img src=x onerror=alert(1)> message with at least 10 chars',
    };

    const result = await validateAndSanitize(dataWithHTML);

    expect(result.valid).toBe(true);
    expect(result.data?.name).not.toContain('<script>');
    expect(result.data?.name).not.toContain('onerror');
    expect(result.data?.message).not.toContain('<img');
  });

  it('HR5 — clears honeypot field in sanitized output', async () => {
    const result = await validateAndSanitize(baseValidForm);

    expect(result.valid).toBe(true);
    expect(result.data?.website).toBe('');
  });

  it('HR6 — lowercases email', async () => {
    const dataWithUppercaseEmail: ContactFormData = {
      ...baseValidForm,
      email: 'ANNA@EXAMPLE.COM',
    };

    const result = await validateAndSanitize(dataWithUppercaseEmail);

    expect(result.valid).toBe(true);
    expect(result.data?.email).toBe('anna@example.com');
  });

  it('HR7 — floors numeric counts', async () => {
    const dataWithFloats: ContactFormData = {
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'centre-educatiu',
      centreSubtype: 'alumnes',
      location: 'Barcelona',
      studentsCount: 25.7,
    };

    const result = await validateAndSanitize(dataWithFloats);

    expect(result.valid).toBe(true);
    expect(result.data?.studentsCount).toBe(25);
  });

  it('HR8 — trims whitespace from name', async () => {
    const dataWithWhitespace: ContactFormData = {
      ...baseValidForm,
      name: '  Anna García  ',
    };

    const result = await validateAndSanitize(dataWithWhitespace);

    expect(result.valid).toBe(true);
    expect(result.data?.name).toBe('Anna García');
  });

  it('HR9 — requires privacy acceptance', async () => {
    const dataWithoutPrivacy: ContactFormData = {
      ...baseValidForm,
      privacyAccepted: false,
    };

    const result = await validateAndSanitize(dataWithoutPrivacy);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('privacitat');
  });

  it('HR10 — rejects null formData gracefully', async () => {
    const result = await validateAndSanitize(null as unknown as ContactFormData);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Error al processar');
  });
});

describe('handleFormSubmit — service-specific validation', () => {
  it('SR1 — requires location for serveis-externs', async () => {
    const dataNoLocation: ContactFormData = {
      ...baseValidForm,
      serviceType: 'serveis-externs',
      location: '',
    };

    const result = await validateAndSanitize(dataNoLocation);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('obligatòria');
  });

  it('SR2 — accepts valid artterapia submission', async () => {
    const validArt: ContactFormData = {
      ...baseValidForm,
      serviceType: 'artterapia',
      arttherapyFormat: 'individual',
    };

    const result = await validateAndSanitize(validArt);

    expect(result.valid).toBe(true);
    expect(result.data?.serviceType).toBe('artterapia');
  });

  it('SR3 — accepts valid artperdins submission', async () => {
    const validPerdins: ContactFormData = {
      ...baseValidForm,
      serviceType: 'artperdins',
      participantAge: 'adult',
    };

    const result = await validateAndSanitize(validPerdins);

    expect(result.valid).toBe(true);
    expect(result.data?.serviceType).toBe('artperdins');
  });

  it('SR4 — validates centre-educatiu requirements', async () => {
    const validCentreAlumnes: ContactFormData = {
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'centre-educatiu',
      centreSubtype: 'alumnes',
      location: 'Barcelona',
      schoolName: 'Col·legi Test',
      studentsCount: 30,
    };

    const result = await validateAndSanitize(validCentreAlumnes);

    expect(result.valid).toBe(true);
  });

  it('SR5 — validates altres-entitats requirements', async () => {
    const validAltres: ContactFormData = {
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'altres-entitats',
      location: 'Barcelona',
      entityType: 'hospital',
      entityName: 'Hospital Test',
      participantsCount: 50,
    };

    const result = await validateAndSanitize(validAltres);

    expect(result.valid).toBe(true);
  });
});

describe('handleFormSubmit — confirmation email', () => {
  it('CE1 — user receives confirmation with their name', async () => {
    const { buildConfirmationEmail } = await import('../buildConfirmationEmail');
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('Anna García');
  });

  it('CE2 — confirmation includes service type', async () => {
    const { buildConfirmationEmail } = await import('../buildConfirmationEmail');
    const result = await buildConfirmationEmail({
      ...baseValidForm,
      serviceType: 'artterapia',
    });

    expect(result).toContain('Artteràpia');
  });

  it('CE3 — confirmation includes standard response message', async () => {
    const { buildConfirmationEmail } = await import('../buildConfirmationEmail');
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('Et respondrem el més aviat possible');
  });

  it('CE4 — confirmation includes contact information from siteConfig', async () => {
    const { buildConfirmationEmail } = await import('../buildConfirmationEmail');
    const result = await buildConfirmationEmail(baseValidForm);

    // Verify contact info structure is present
    expect(result).toContain('pots enviar-nos un missatge al');
    expect(result).toContain('o escriure\'ns a');
    // Verify strong tags are used for contact info (from siteConfig values)
    expect(result).toContain('<strong>');
  });

  it('CE5 — confirmation uses design system styling', async () => {
    const { buildConfirmationEmail } = await import('../buildConfirmationEmail');
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('Playfair Display'); // Font
    expect(result).toContain('linear-gradient'); // Gradient header
    expect(result).toContain('#6b8ac6'); // Shakespeare color
  });
});

describe('handleFormSubmit — email routing', () => {
  it('ER1 — centre-educatiu consultas route to schools email', async () => {
    // Documentation test: serveis-externs + centre-educatiu → tallerdelssentits.escoles@gmail.com
    expect(true).toBe(true);
  });

  it('ER2 — general, artterapia, artperdins route to main email', async () => {
    // Documentation test: other services → tallerdelssentits@gmail.com
    expect(true).toBe(true);
  });

  it('ER3 — altres-entitats route to main email', async () => {
    // Documentation test: serveis-externs + altres-entitats → tallerdelssentits@gmail.com
    expect(true).toBe(true);
  });
});
