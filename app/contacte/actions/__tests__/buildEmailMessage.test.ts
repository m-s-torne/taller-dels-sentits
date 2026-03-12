import { describe, it, expect } from 'vitest';
import { buildEmailMessage } from '../buildEmailMessage';
import { baseValidForm } from './_fixtures';
import type { ContactFormData } from '@/app/contacte/types/form.types';

// ---------------------------------------------------------------------------
// 4.1 Base output (always present)
// ---------------------------------------------------------------------------

describe('buildEmailMessage — base output', () => {
  it('B1 — output starts with the message text', async () => {
    const result = await buildEmailMessage(baseValidForm);
    expect(result.startsWith(baseValidForm.message)).toBe(true);
  });

  it('B2 — output contains the details divider', async () => {
    const result = await buildEmailMessage(baseValidForm);
    expect(result).toContain('--- DETALLS DE LA CONSULTA ---');
  });

  it('B3 — output contains the email address', async () => {
    const result = await buildEmailMessage(baseValidForm);
    expect(result).toContain(baseValidForm.email);
  });
});

// ---------------------------------------------------------------------------
// 4.2 Optional basic fields
// ---------------------------------------------------------------------------

describe('buildEmailMessage — optional fields', () => {
  it('OB1 — includes phone when provided', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, phone: '600123456' });
    expect(result).toContain('Telèfon: 600123456');
  });

  it('OB2 — omits phone section when empty', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, phone: '' });
    expect(result).not.toContain('Telèfon');
  });

  it('OB3 — includes location when provided', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, location: 'Vilanova' });
    expect(result).toContain('Població: Vilanova');
  });

  it('OB4 — omits location section when empty', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, location: '' });
    expect(result).not.toContain('Població');
  });
});

// ---------------------------------------------------------------------------
// 4.3 contactPreference
// ---------------------------------------------------------------------------

describe('buildEmailMessage — contactPreference', () => {
  it('CP1 — lists all selected preferences joined by comma', async () => {
    const result = await buildEmailMessage({
      ...baseValidForm,
      contactPreference: ['email', 'phone'],
    });
    expect(result).toContain('email, phone');
  });

  it('CP2 — omits preference section when empty', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, contactPreference: [] });
    expect(result).not.toContain('Preferència de contacte');
  });
});

// ---------------------------------------------------------------------------
// 4.4 availability
// ---------------------------------------------------------------------------

describe('buildEmailMessage — availability', () => {
  it('AV1 — morning maps to correct label', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, availability: 'morning' });
    expect(result).toContain('Matins (9h-14h)');
  });

  it('AV2 — afternoon maps to correct label', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, availability: 'afternoon' });
    expect(result).toContain('Tardes (14h-18h)');
  });

  it('AV3 — anytime maps to correct label', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, availability: 'anytime' });
    expect(result).toContain('Qualsevol moment');
  });

  it('AV4 — omits availability section when empty', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, availability: '' });
    expect(result).not.toContain('Disponibilitat');
  });
});

// ---------------------------------------------------------------------------
// 4.5 general serviceType
// ---------------------------------------------------------------------------

describe('buildEmailMessage — general serviceType', () => {
  it('G1 — no service details section for general', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, serviceType: 'general' });
    expect(result).not.toContain('--- DETALLS DEL SERVEI ---');
  });
});

// ---------------------------------------------------------------------------
// 4.6 artterapia
// ---------------------------------------------------------------------------

describe('buildEmailMessage — artterapia', () => {
  const artBase: ContactFormData = { ...baseValidForm, serviceType: 'artterapia' };

  it('AT1 — individual format', async () => {
    const result = await buildEmailMessage({ ...artBase, arttherapyFormat: 'individual' });
    expect(result).toContain('Sessions individuals');
  });

  it('AT2 — grupal format', async () => {
    const result = await buildEmailMessage({ ...artBase, arttherapyFormat: 'grupal' });
    expect(result).toContain('Sessions grupals');
  });

  it('AT3 — unsure format', async () => {
    const result = await buildEmailMessage({ ...artBase, arttherapyFormat: 'unsure' });
    expect(result).toContain('No estic segur/a');
  });

  it('AT4 — omits format when empty', async () => {
    const result = await buildEmailMessage({ ...artBase, arttherapyFormat: '' });
    expect(result).not.toContain('Format:');
  });
});

// ---------------------------------------------------------------------------
// 4.7 artperdins
// ---------------------------------------------------------------------------

describe('buildEmailMessage — artperdins', () => {
  const perdinsBase: ContactFormData = { ...baseValidForm, serviceType: 'artperdins' };

  it('AP1 — adolescent age', async () => {
    const result = await buildEmailMessage({ ...perdinsBase, participantAge: 'adolescent' });
    expect(result).toContain('Adolescents (12-15 anys)');
  });

  it('AP2 — young-adult age', async () => {
    const result = await buildEmailMessage({ ...perdinsBase, participantAge: 'young-adult' });
    expect(result).toContain('Joves (15-20 anys)');
  });

  it('AP3 — adult age', async () => {
    const result = await buildEmailMessage({ ...perdinsBase, participantAge: 'adult' });
    expect(result).toContain('Adults (20 anys o més)');
  });
});

// ---------------------------------------------------------------------------
// 4.8 serveis-externs + centre-educatiu + alumnes
// ---------------------------------------------------------------------------

describe('buildEmailMessage — serveis-externs / centre-educatiu / alumnes', () => {
  const alumnesBase: ContactFormData = {
    ...baseValidForm,
    serviceType: 'serveis-externs',
    externsSubtype: 'centre-educatiu',
    centreSubtype: 'alumnes',
  };

  it('SEA1 — includes school name', async () => {
    const result = await buildEmailMessage({ ...alumnesBase, schoolName: "Col·legi Garraf" });
    expect(result).toContain("Col·legi Garraf");
  });

  it('SEA2 — includes education stage label', async () => {
    const result = await buildEmailMessage({ ...alumnesBase, educationStage: 'eso' });
    expect(result).toContain('ESO');
  });

  it('SEA3 — includes course group', async () => {
    const result = await buildEmailMessage({ ...alumnesBase, courseGroup: '2n ESO' });
    expect(result).toContain('2n ESO');
  });

  it('SEA4 — includes students count', async () => {
    const result = await buildEmailMessage({ ...alumnesBase, studentsCount: 30 });
    expect(result).toContain('30');
  });

  it('SEA5 — includes course interest', async () => {
    const result = await buildEmailMessage({ ...alumnesBase, courseInterest: 'Monogràfic emocions' });
    expect(result).toContain('Monogràfic emocions');
  });

  it('SEA6 — omits optional fields when empty', async () => {
    const result = await buildEmailMessage({
      ...alumnesBase,
      schoolName: '',
      educationStage: '',
      courseGroup: '',
      studentsCount: '',
      courseInterest: '',
    });
    expect(result).not.toContain('Nom del centre');
    expect(result).not.toContain("Nombre aproximat d'alumnes");
    expect(result).not.toContain("Curs/Monogràfic d'interès");
  });
});

// ---------------------------------------------------------------------------
// 4.9 serveis-externs + centre-educatiu + professorat
// ---------------------------------------------------------------------------

describe('buildEmailMessage — serveis-externs / centre-educatiu / professorat', () => {
  const profBase: ContactFormData = {
    ...baseValidForm,
    serviceType: 'serveis-externs',
    externsSubtype: 'centre-educatiu',
    centreSubtype: 'professorat',
  };

  it('SEP1 — includes school name', async () => {
    const result = await buildEmailMessage({ ...profBase, schoolName: 'IES Garraf' });
    expect(result).toContain('IES Garraf');
  });

  it('SEP2 — includes teachers count', async () => {
    const result = await buildEmailMessage({ ...profBase, teachersCount: 15 });
    expect(result).toContain('15');
  });

  it('SEP3 — includes training interest', async () => {
    const result = await buildEmailMessage({ ...profBase, trainingInterest: 'gestió emocional' });
    expect(result).toContain('gestió emocional');
  });
});

// ---------------------------------------------------------------------------
// 4.10 serveis-externs + altres-entitats
// ---------------------------------------------------------------------------

describe('buildEmailMessage — serveis-externs / altres-entitats', () => {
  const altresBase: ContactFormData = {
    ...baseValidForm,
    serviceType: 'serveis-externs',
    externsSubtype: 'altres-entitats',
  };

  it('AE1 — includes entity type label', async () => {
    const result = await buildEmailMessage({ ...altresBase, entityType: 'hospital' });
    expect(result).toContain('Hospital');
  });

  it('AE2 — includes entity description for tipus altres', async () => {
    const result = await buildEmailMessage({
      ...altresBase,
      entityType: 'altres',
      entityDescription: 'Desc',
    });
    expect(result).toContain('Desc');
  });

  it('AE3 — omits entity description for non-altres entity types', async () => {
    const result = await buildEmailMessage({
      ...altresBase,
      entityType: 'hospital',
      entityDescription: 'Should not appear',
    });
    expect(result).not.toContain("Descripció de l'entitat");
  });

  it('AE4 — includes entity name', async () => {
    const result = await buildEmailMessage({ ...altresBase, entityName: 'Hospital de Vilafranca' });
    expect(result).toContain('Hospital de Vilafranca');
  });

  it('AE5 — includes participants count', async () => {
    const result = await buildEmailMessage({ ...altresBase, participantsCount: 40 });
    expect(result).toContain('40');
  });

  it('AE6 — includes project description', async () => {
    const result = await buildEmailMessage({ ...altresBase, projectDescription: 'Projecte X' });
    expect(result).toContain('Projecte X');
  });
});
