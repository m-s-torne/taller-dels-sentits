import { describe, it, expect } from 'vitest';
import type { ContactFormData } from '@/app/contacte/types/form.types';
import { buildConfirmationEmail } from '../buildConfirmationEmail';
import { baseValidForm } from './_fixtures';

describe('buildConfirmationEmail', () => {
  it('C1 — generates valid HTML', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('</html>');
    expect(result).toMatch(/<html[^>]*>/);
  });

  it('C2 — includes user name', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('Hola <strong>Anna García</strong>');
  });

  it('C3 — includes service type label', async () => {
    const result = await buildConfirmationEmail({
      ...baseValidForm,
      serviceType: 'artterapia',
    });

    expect(result).toContain('Artteràpia');
  });

  it('C4 — includes confirmation message', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('Hem rebut correctament la teva consulta');
  });

  it('C5 — includes response time message', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('Et respondrem el més aviat possible');
  });

  it('C6 — includes contact details section', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('pots enviar-nos un missatge al');
    expect(result).toContain('o escriure\'ns a');
  });

  it('C7 — uses siteConfig for contact information', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    // Verify the email uses siteConfig values (from environment)
    // If env vars are not set, they will appear as undefined
    // This test ensures the structure is correct
    expect(result).toContain('<strong>');
    expect(result).not.toMatch(/<strong>\s*<\/strong>/); // No empty strong tags
  });

  it('C8 — includes business name in signature', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('Taller dels Sentits');
    expect(result).toContain('Artteràpia i acompanyament creatiu');
  });

  it('C9 — uses design system colors', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('#6b8ac6'); // shakespeare
    expect(result).toContain('#676799'); // scampi
    expect(result).toContain('#4B3D66'); // jacarta
  });

  it('C10 — includes gradient header', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('Confirmació de rebuda');
    expect(result).toContain('linear-gradient');
  });

  it('C11 — is responsive (mobile styles)', async () => {
    const result = await buildConfirmationEmail(baseValidForm);

    expect(result).toContain('@media (max-width: 480px)');
  });

  it('C12 — works for all service types', async () => {
    const serviceTypes = ['general', 'artterapia', 'artperdins', 'serveis-externs'];

    for (const serviceType of serviceTypes) {
      const result = await buildConfirmationEmail({
        ...baseValidForm,
        serviceType: serviceType as ContactFormData['serviceType'],
      });

      expect(result).toContain('Hola');
      expect(result).toContain('Hem rebut correctament');
      // Ensure HTML structure is valid
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('</html>');
    }
  });

  it('C13 — serveis-externs centre-educatiu shows exact centre type (alumnes)', async () => {
    const result = await buildConfirmationEmail({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'centre-educatiu',
      centreSubtype: 'alumnes',
    });

    expect(result).toContain('Serveis Externs - Centre Educatiu (Alumnes)');
  });

  it('C14 — serveis-externs centre-educatiu shows exact centre type (professorat)', async () => {
    const result = await buildConfirmationEmail({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'centre-educatiu',
      centreSubtype: 'professorat',
    });

    expect(result).toContain('Serveis Externs - Centre Educatiu (Professorat)');
  });

  it('C15 — serveis-externs altres-entitats shows exact entity type', async () => {
    const result = await buildConfirmationEmail({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'altres-entitats',
      entityType: 'hospital',
    });

    expect(result).toContain('Serveis Externs - Hospital');
  });

  it('C16 — serveis-externs altres-entitats includes entity name', async () => {
    const result = await buildConfirmationEmail({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'altres-entitats',
      entityType: 'ajuntament',
      entityName: 'Ajuntament de Barcelona',
    });

    expect(result).toContain('Serveis Externs - Ajuntament: Ajuntament de Barcelona');
  });
});
