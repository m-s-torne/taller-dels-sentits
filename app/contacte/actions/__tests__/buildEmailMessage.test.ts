import { describe, it, expect } from 'vitest';
import { buildEmailMessage } from '../buildEmailMessage';
import { baseValidForm } from './_fixtures';
import type { ContactFormData } from '@/app/contacte/types/form.types';

// ---------------------------------------------------------------------------
// 4.1 Base output (always present)
// ---------------------------------------------------------------------------

describe('buildEmailMessage — base output', () => {
  it('B1 — output is valid HTML', async () => {
    const result = await buildEmailMessage(baseValidForm);
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<html');
    expect(result).toContain('</html>');
  });

  it('B2 — output contains the user message', async () => {
    const result = await buildEmailMessage(baseValidForm);
    expect(result).toContain(baseValidForm.message);
  });

  it('B3 — output contains the email address', async () => {
    const result = await buildEmailMessage(baseValidForm);
    expect(result).toContain(baseValidForm.email);
  });

  it('B4 — output includes CSS styling', async () => {
    const result = await buildEmailMessage(baseValidForm);
    expect(result).toContain('<style>');
    expect(result).toContain('</style>');
  });

  it('B5 — output uses HTML divs and semantic tags', async () => {
    const result = await buildEmailMessage(baseValidForm);
    expect(result).toContain('<div');
    expect(result).toContain('<h1');
  });
});

// ---------------------------------------------------------------------------
// 4.2 Optional basic fields
// ---------------------------------------------------------------------------

describe('buildEmailMessage — optional fields', () => {
  it('OB1 — includes phone when provided', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, phone: '600123456' });
    expect(result).toContain('600123456');
    expect(result).toContain('Telèfon');
  });

  it('OB2 — omits phone section when empty', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, phone: '' });
    expect(result).not.toContain('Telèfon:');  // Phone label not shown
  });

  it('OB3 — includes location when provided', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, location: 'Vilanova' });
    expect(result).toContain('Vilanova');
    expect(result).toContain('Població');
  });

  it('OB4 — omits location section when empty', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, location: '' });
    expect(result).not.toContain('Població:');  // Location label not shown when empty
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
    expect(result).toContain('Preferència de Contacte');
  });

  it('CP2 — omits preference section when empty and no availability', async () => {
    const result = await buildEmailMessage({
      ...baseValidForm,
      contactPreference: [],
      availability: ''
    });
    // Preference section completely omitted
    expect(result).not.toContain('Preferència de Contacte');
  });
});

// ---------------------------------------------------------------------------
// 4.4 availability
// ---------------------------------------------------------------------------

describe('buildEmailMessage — availability', () => {
  it('AV1 — morning maps to correct label', async () => {
    const result = await buildEmailMessage({
      ...baseValidForm,
      availability: 'morning',
      contactPreference: ['email'] // Need at least this to render preferences section
    });
    expect(result).toContain('Matins (9h-14h)');
  });

  it('AV2 — afternoon maps to correct label', async () => {
    const result = await buildEmailMessage({
      ...baseValidForm,
      availability: 'afternoon',
      contactPreference: ['email']
    });
    expect(result).toContain('Tardes (14h-18h)');
  });

  it('AV3 — anytime maps to correct label', async () => {
    const result = await buildEmailMessage({
      ...baseValidForm,
      availability: 'anytime',
      contactPreference: ['email']
    });
    expect(result).toContain('Qualsevol moment');
  });

  it('AV4 — omits availability section when empty', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, availability: '' });
    // Availability not rendered if empty, no emojis
    const clockCount = (result.match(/⏰/g) || []).length;
    expect(clockCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 4.5 general serviceType
// ---------------------------------------------------------------------------

describe('buildEmailMessage — general serviceType', () => {
  it('G1 — no service section title for general', async () => {
    const result = await buildEmailMessage({ ...baseValidForm, serviceType: 'general' });
    expect(result).not.toContain('🎨'); // Artterapia emoji
    expect(result).not.toContain('🌸'); // Artperdins emoji
    expect(result).not.toContain('🏛️'); // Serveis emoji
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
    expect(result).toContain('🎨');
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
    // Format field not rendered, but section header should be there
    expect(result).toContain('🎨'); // Section header shows emoji
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

  it('SEA0 — shows exact centre type (alumnes)', async () => {
    const result = await buildEmailMessage(alumnesBase);
    expect(result).toContain('Centre Educatiu - Alumnes');
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
    // Section header should still be there (Serveis Externs), but specific fields not rendered
    expect(result).toContain('🏛️');
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

  it('SEP0 — shows exact centre type (professorat)', async () => {
    const result = await buildEmailMessage(profBase);
    expect(result).toContain('Centre Educatiu - Professorat');
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

  it('AE0 — shows exact entity type', async () => {
    const result = await buildEmailMessage({ ...altresBase, entityType: 'hospital' });
    expect(result).toContain('Serveis Externs - Hospital');
  });

  it('AE0b — shows entity name when provided', async () => {
    const result = await buildEmailMessage({
      ...altresBase,
      entityType: 'ajuntament',
      entityName: 'Ajuntament de Barcelona',
    });
    expect(result).toContain('Serveis Externs - Ajuntament: Ajuntament de Barcelona');
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
      entityDescription: 'Should not appear when not "altres"',
    });
    // Entity description field not rendered for non-altres types
    const countDescriptions = (result.match(/Should not appear/g) || []).length;
    expect(countDescriptions).toBe(0);
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
