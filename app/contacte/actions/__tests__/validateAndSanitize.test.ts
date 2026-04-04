import { describe, it, expect } from 'vitest';
import { validateAndSanitize } from '../handleSubmit';
import { baseValidForm } from './_fixtures';
import type { ContactFormData } from '@/app/contacte/types/form.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal valid serveis-externs/centre-educatiu/alumnes form */
const sextAlumnesBase: ContactFormData = {
  ...baseValidForm,
  serviceType: 'serveis-externs',
  location: 'Barcelona',
  externsSubtype: 'centre-educatiu',
  centreSubtype: 'alumnes',
};

/** Minimal valid serveis-externs/centre-educatiu/professorat form */
const sextProfessoratBase: ContactFormData = {
  ...baseValidForm,
  serviceType: 'serveis-externs',
  location: 'Barcelona',
  externsSubtype: 'centre-educatiu',
  centreSubtype: 'professorat',
  schoolName: 'IES Test',
};

/** Minimal valid serveis-externs/altres-entitats form */
const altresEntitatsBase: ContactFormData = {
  ...baseValidForm,
  serviceType: 'serveis-externs',
  location: 'Barcelona',
  externsSubtype: 'altres-entitats',
  entityType: 'hospital',
  entityName: 'Hospital de Vilafranca',
  participantsCount: 20,
};

// ---------------------------------------------------------------------------
// 3.1 Honeypot
// ---------------------------------------------------------------------------

describe('validateAndSanitize — honeypot', () => {
  it('H1 — rejects when website is filled', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, website: 'filledByBot' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('invalid_honeypot');
  });

  it('H2 — passes when website is whitespace only', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, website: '   ' });
    expect(result.valid).toBe(true);
  });

  it('H3 — passes when website is empty string', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, website: '' });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.2 Name validation
// ---------------------------------------------------------------------------

describe('validateAndSanitize — name', () => {
  const nameError = 'El nom és obligatori i ha de tenir almenys 3 caràcters';

  it('N1 — rejects empty name', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, name: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(nameError);
  });

  it('N2 — rejects whitespace-only name', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, name: '  ' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(nameError);
  });

  it('N3 — rejects 2-char name', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, name: 'Ab' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(nameError);
  });

  it('N4 — accepts 3-char name', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, name: 'Ana' });
    expect(result.valid).toBe(true);
  });

  it('N5 — accepts full name', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, name: 'Anna García' });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.3 Email validation
// ---------------------------------------------------------------------------

describe('validateAndSanitize — email', () => {
  const emailError = 'El correu electrònic no és vàlid';

  it('E1 — rejects empty email', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, email: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(emailError);
  });

  it('E2 — rejects plain text without @', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, email: 'notanemail' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(emailError);
  });

  it('E3 — rejects email without dot in domain', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, email: 'missing@dot' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(emailError);
  });

  it('E4 — rejects email with no local part', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, email: '@nodomain.com' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(emailError);
  });

  it('E5 — accepts standard email', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, email: 'valid@example.com' });
    expect(result.valid).toBe(true);
  });

  it('E6 — accepts email with + and subdomain', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, email: 'valid+tag@sub.domain.org' });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.4 Message validation
// ---------------------------------------------------------------------------

describe('validateAndSanitize — message', () => {
  const shortError = 'El missatge ha de tenir almenys 10 caràcters';
  const longError = 'El missatge és massa llarg (màxim 5000 caràcters)';

  it('M1 — rejects empty message', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(shortError);
  });

  it('M2 — rejects 5-char message', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, message: 'Short' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(shortError);
  });

  it('M3 — rejects 9-char message', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, message: '123456789' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(shortError);
  });

  it('M4 — accepts exactly 10-char message', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, message: '1234567890' });
    expect(result.valid).toBe(true);
  });

  it('M5 — rejects message over 5000 chars', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, message: 'a'.repeat(5001) });
    expect(result.valid).toBe(false);
    expect(result.error).toBe(longError);
  });

  it('M6 — accepts exactly 5000-char message', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, message: 'a'.repeat(5000) });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.5 Privacy validation
// ---------------------------------------------------------------------------

describe('validateAndSanitize — privacy', () => {
  it('P1 — rejects when privacy not accepted', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, privacyAccepted: false });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Has d'acceptar la política de privacitat");
  });

  it('P2 — passes when privacy accepted', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, privacyAccepted: true });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.6 serveis-externs — location
// ---------------------------------------------------------------------------

describe('validateAndSanitize — serveis-externs location', () => {
  it('L1 — rejects serveis-externs without location', async () => {
    const result = await validateAndSanitize({
      ...sextAlumnesBase,
      location: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('La població és obligatòria per a serveis externs');
  });

  it('L2 — serveis-externs with location proceeds to next check', async () => {
    // Passes location check — may fail later due to missing count but won't fail on location
    const result = await validateAndSanitize({ ...sextAlumnesBase });
    expect(result.error).not.toBe('La població és obligatòria per a serveis externs');
  });

  it('L3 — artterapia does not require location', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'artterapia',
      location: '',
    });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.7 serveis-externs — externsSubtype
// ---------------------------------------------------------------------------

describe('validateAndSanitize — externsSubtype', () => {
  it('SE1 — rejects missing externsSubtype', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      location: 'Barcelona',
      externsSubtype: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Has de seleccionar el tipus de col·lectiu");
  });

  it('SE2 — centre-educatiu proceeds past subtype check', async () => {
    const result = await validateAndSanitize({ ...sextAlumnesBase });
    expect(result.error).not.toBe("Has de seleccionar el tipus de col·lectiu");
  });

  it('SE3 — altres-entitats proceeds past subtype check', async () => {
    const result = await validateAndSanitize({ ...altresEntitatsBase });
    expect(result.error).not.toBe("Has de seleccionar el tipus de col·lectiu");
  });
});

// ---------------------------------------------------------------------------
// 3.8 centre-educatiu subtypes
// ---------------------------------------------------------------------------

describe('validateAndSanitize — centre-educatiu subtypes', () => {
  it('CE1 — rejects missing centreSubtype', async () => {
    const result = await validateAndSanitize({
      ...sextAlumnesBase,
      centreSubtype: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Has de seleccionar el destinatari de la formació');
  });

  it('CE2 — alumnes passes centreSubtype check', async () => {
    const result = await validateAndSanitize({ ...sextAlumnesBase });
    expect(result.error).not.toBe('Has de seleccionar el destinatari de la formació');
  });

  it('CE3 — professorat without schoolName is rejected', async () => {
    const result = await validateAndSanitize({
      ...sextProfessoratBase,
      schoolName: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('El nom del centre és obligatori per a la formació al professorat');
  });

  it('CE4 — professorat with schoolName passes', async () => {
    const result = await validateAndSanitize({ ...sextProfessoratBase });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.9 altres-entitats subtypes
// ---------------------------------------------------------------------------

describe('validateAndSanitize — altres-entitats subtypes', () => {
  it('AE1 — rejects missing entityType', async () => {
    const result = await validateAndSanitize({
      ...altresEntitatsBase,
      entityType: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Has de seleccionar el tipus d'entitat");
  });

  it('AE2 — rejects missing entityName', async () => {
    const result = await validateAndSanitize({
      ...altresEntitatsBase,
      entityName: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("El nom de l'entitat és obligatori");
  });

  it('AE3 — valid entityType + entityName proceeds', async () => {
    const result = await validateAndSanitize({ ...altresEntitatsBase });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.10 Numeric count validations
// ---------------------------------------------------------------------------

describe('validateAndSanitize — numeric counts', () => {
  it('NC1 — studentsCount empty string skips check (optional)', async () => {
    const result = await validateAndSanitize({ ...sextAlumnesBase, studentsCount: '' });
    expect(result.valid).toBe(true);
  });

  it('NC2 — studentsCount 0 fails (must be >= 1)', async () => {
    const result = await validateAndSanitize({ ...sextAlumnesBase, studentsCount: 0 });
    expect(result.valid).toBe(false);
    expect(result.error).toBe("El nombre d'estudiants ha de ser almenys 1");
  });

  it('NC3 — studentsCount 25 passes', async () => {
    const result = await validateAndSanitize({ ...sextAlumnesBase, studentsCount: 25 });
    expect(result.valid).toBe(true);
  });

  it('NC4 — teachersCount empty string skips check (optional)', async () => {
    const result = await validateAndSanitize({ ...sextProfessoratBase, teachersCount: '' });
    expect(result.valid).toBe(true);
  });

  it('NC5 — teachersCount -1 fails (must be >= 1)', async () => {
    const result = await validateAndSanitize({ ...sextProfessoratBase, teachersCount: -1 });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('El nombre de professors ha de ser almenys 1');
  });

  it('NC6 — teachersCount 10 passes', async () => {
    const result = await validateAndSanitize({ ...sextProfessoratBase, teachersCount: 10 });
    expect(result.valid).toBe(true);
  });

  it('NC7 — participantsCount empty string is rejected (required for altres-entitats)', async () => {
    const result = await validateAndSanitize({ ...altresEntitatsBase, participantsCount: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('El nombre de participants és obligatori');
  });

  it('NC8 — participantsCount 0 fails (must be >= 1)', async () => {
    const result = await validateAndSanitize({ ...altresEntitatsBase, participantsCount: 0 });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('El nombre de participants ha de ser almenys 1');
  });

  it('NC9 — participantsCount 50 passes', async () => {
    const result = await validateAndSanitize({ ...altresEntitatsBase, participantsCount: 50 });
    expect(result.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3.11 Sanitization
// ---------------------------------------------------------------------------

describe('validateAndSanitize — sanitization', () => {
  it('S1 — strips HTML tags from name', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      name: 'Anna <script>alert(1)</script>',
    });
    expect(result.valid).toBe(true);
    expect(result.data!.name).toBe('Anna alert(1)');
  });

  it('S2 — strips dangerous chars from name', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      name: 'Anna {[test]}',
    });
    expect(result.valid).toBe(true);
    expect(result.data!.name).toBe('Anna test');
  });

  it('S3 — lowercases and trims email', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      email: 'ANNA@EXAMPLE.COM',
    });
    expect(result.valid).toBe(true);
    expect(result.data!.email).toBe('anna@example.com');
  });

  it('S4 — strips HTML tags and backslashes from message', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      message: 'Hello <b>world</b> \\test',
    });
    expect(result.valid).toBe(true);
    expect(result.data!.message).toBe('Hello world test');
  });

  it('S5 — floors float studentsCount', async () => {
    const result = await validateAndSanitize({ ...sextAlumnesBase, studentsCount: 25.7 });
    expect(result.valid).toBe(true);
    expect(result.data!.studentsCount).toBe(25);
  });

  it('S6 — website field always cleared in output', async () => {
    const result = await validateAndSanitize({ ...baseValidForm, website: '' });
    expect(result.valid).toBe(true);
    expect(result.data!.website).toBe('');
  });
});

// ---------------------------------------------------------------------------
// 3.12 Return shape on success
// ---------------------------------------------------------------------------

describe('validateAndSanitize — return shape', () => {
  it('returns { valid: true, data: ContactFormData } on success', async () => {
    const result = await validateAndSanitize(baseValidForm);
    expect(result.valid).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 3.13 Unexpected throw
// ---------------------------------------------------------------------------

describe('validateAndSanitize — unexpected throw', () => {
  it('returns generic error when formData is null', async () => {
    const result = await validateAndSanitize(null as unknown as ContactFormData);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Error al processar les dades. Si us plau, torna-ho a intentar.');
  });
});

// ---------------------------------------------------------------------------
// 3.14 Enum validation (server-side protection against direct Server Action calls)
// ---------------------------------------------------------------------------

describe('validateAndSanitize — enum validation', () => {
  it('EV1 — rejects invalid serviceType', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'hacked' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Tipus de servei no vàlid');
  });

  it('EV2 — rejects invalid availability', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      availability: 'always' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Disponibilitat no vàlida');
  });

  it('EV3 — accepts valid availability values', async () => {
    for (const val of ['morning', 'afternoon', 'anytime'] as const) {
      const result = await validateAndSanitize({ ...baseValidForm, availability: val });
      expect(result.valid).toBe(true);
    }
  });

  it('EV4 — rejects invalid contactPreference entry', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      contactPreference: ['email', 'fax'] as any,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Preferència de contacte no vàlida');
  });

  it('EV5 — rejects invalid arttherapyFormat when serviceType is artterapia', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'artterapia',
      arttherapyFormat: 'online' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Format d\'artteràpia no vàlid');
  });

  it('EV6 — ignores arttherapyFormat when serviceType is not artterapia', async () => {
    // invalid arttherapyFormat on a general form should NOT trigger error
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'general',
      arttherapyFormat: 'online' as any,
    });
    expect(result.valid).toBe(true);
  });

  it('EV7 — rejects invalid participantAge when serviceType is artperdins', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'artperdins',
      participantAge: 'elderly' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Edat del participant no vàlida');
  });

  it('EV8 — rejects invalid externsSubtype when serviceType is serveis-externs', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      location: 'Barcelona',
      externsSubtype: 'empresa' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Subtipus de serveis externs no vàlid');
  });

  it('EV9 — rejects invalid centreSubtype for centre-educatiu', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      location: 'Barcelona',
      externsSubtype: 'centre-educatiu',
      centreSubtype: 'director' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Subtipus de centre no vàlid');
  });

  it('EV10 — rejects invalid educationStage for centre-educatiu', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      location: 'Barcelona',
      externsSubtype: 'centre-educatiu',
      centreSubtype: 'alumnes',
      educationStage: 'universitat' as any,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Etapa educativa no vàlida');
  });

  it('EV11 — rejects invalid entityType for altres-entitats', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      location: 'Barcelona',
      externsSubtype: 'altres-entitats',
      entityType: 'clinic' as any,
      entityName: 'Test Entity',
      participantsCount: 10,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Tipus d\'entitat no vàlid');
  });

  it('EV12 — accepts valid enum combinations', async () => {
    const result = await validateAndSanitize({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      location: 'Barcelona',
      externsSubtype: 'altres-entitats',
      entityType: 'hospital',
      entityName: 'Hospital de Vilafranca',
      participantsCount: 20,
      availability: 'morning',
      contactPreference: ['email', 'phone'],
    });
    expect(result.valid).toBe(true);
  });
});
