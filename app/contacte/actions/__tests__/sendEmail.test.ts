import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { ContactFormData } from '@/app/contacte/types/form.types';

// vi.mock is hoisted — placed before any imports of the module under test
vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}));

import emailjs from '@emailjs/browser';
import { sendEmail } from '../sendEmail';
import { baseValidForm } from './_fixtures';

const mockSend = vi.mocked(emailjs.send);

// ---------------------------------------------------------------------------
// Env var helpers
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID', 'svc_general');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', 'tpl_general');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'key_general');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID_SCHOOL', 'svc_school');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SCHOOL', 'tpl_school');
  vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SCHOOL', 'key_school');
  mockSend.mockResolvedValue({ status: 200, text: 'OK' });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// 7.1 Credential routing
// ---------------------------------------------------------------------------

describe('sendEmail — credential routing', () => {
  it('EC1 — serveis-externs + centre-educatiu uses school credentials', async () => {
    const data: ContactFormData = {
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'centre-educatiu',
    };
    await sendEmail(data);
    const [serviceId, templateId, , publicKey] = mockSend.mock.calls[0];
    expect(serviceId).toBe('svc_school');
    expect(templateId).toBe('tpl_school');
    expect(publicKey).toBe('key_school');
  });

  it('EC2 — serveis-externs + altres-entitats uses general credentials', async () => {
    const data: ContactFormData = {
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'altres-entitats',
    };
    await sendEmail(data);
    const [serviceId, templateId, , publicKey] = mockSend.mock.calls[0];
    expect(serviceId).toBe('svc_general');
    expect(templateId).toBe('tpl_general');
    expect(publicKey).toBe('key_general');
  });

  it('EC3 — artterapia uses general credentials', async () => {
    await sendEmail({ ...baseValidForm, serviceType: 'artterapia' });
    const [serviceId] = mockSend.mock.calls[0];
    expect(serviceId).toBe('svc_general');
  });

  it('EC4 — artperdins uses general credentials', async () => {
    await sendEmail({ ...baseValidForm, serviceType: 'artperdins' });
    const [serviceId] = mockSend.mock.calls[0];
    expect(serviceId).toBe('svc_general');
  });

  it('EC5 — general uses general credentials', async () => {
    await sendEmail({ ...baseValidForm, serviceType: 'general' });
    const [serviceId] = mockSend.mock.calls[0];
    expect(serviceId).toBe('svc_general');
  });
});

// ---------------------------------------------------------------------------
// 7.2 Missing env vars
// ---------------------------------------------------------------------------

describe('sendEmail — missing env vars', () => {
  const missingError = "Configuració incorrecta. Contacta amb l'administrador.";

  it('MV1 — missing SERVICE_ID returns config error', async () => {
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID', '');
    const result = await sendEmail(baseValidForm);
    expect(result.success).toBe(false);
    expect(result.error).toBe(missingError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('MV2 — missing TEMPLATE_ID returns config error', async () => {
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', '');
    const result = await sendEmail(baseValidForm);
    expect(result.success).toBe(false);
    expect(result.error).toBe(missingError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('MV3 — missing PUBLIC_KEY returns config error', async () => {
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', '');
    const result = await sendEmail(baseValidForm);
    expect(result.success).toBe(false);
    expect(result.error).toBe(missingError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('MV4 — missing all school vars for school service returns config error', async () => {
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID_SCHOOL', '');
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_SCHOOL', '');
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY_SCHOOL', '');
    const result = await sendEmail({
      ...baseValidForm,
      serviceType: 'serveis-externs',
      externsSubtype: 'centre-educatiu',
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe(missingError);
    expect(mockSend).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 7.3 EmailJS response handling
// ---------------------------------------------------------------------------

describe('sendEmail — response handling', () => {
  it('ER1 — status 200 returns success', async () => {
    mockSend.mockResolvedValue({ status: 200, text: 'OK' });
    const result = await sendEmail(baseValidForm);
    expect(result).toEqual({ success: true });
  });

  it('ER2 — status 400 returns error', async () => {
    mockSend.mockResolvedValue({ status: 400, text: 'Bad Request' });
    const result = await sendEmail(baseValidForm);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Error al enviar el missatge. Si us plau, torna-ho a intentar.');
  });

  it('ER3 — thrown error returns error', async () => {
    mockSend.mockRejectedValue(new Error('Network error'));
    const result = await sendEmail(baseValidForm);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Error al enviar el missatge. Si us plau, torna-ho a intentar.');
  });
});

// ---------------------------------------------------------------------------
// 7.4 Template params shape
// ---------------------------------------------------------------------------

describe('sendEmail — template params', () => {
  it('TP1 — from_name matches sanitized name', async () => {
    const data: ContactFormData = { ...baseValidForm, name: 'Anna García' };
    await sendEmail(data);
    const templateParams = mockSend.mock.calls[0][2] as Record<string, unknown>;
    expect(templateParams.from_name).toBe('Anna García');
  });

  it('TP2 — from_email and reply_to match email', async () => {
    await sendEmail(baseValidForm);
    const templateParams = mockSend.mock.calls[0][2] as Record<string, unknown>;
    expect(templateParams.from_email).toBe(baseValidForm.email);
    expect(templateParams.reply_to).toBe(baseValidForm.email);
  });

  it('TP3 — from_phone is "No proporcionat" when phone is empty', async () => {
    await sendEmail({ ...baseValidForm, phone: '' });
    const templateParams = mockSend.mock.calls[0][2] as Record<string, unknown>;
    expect(templateParams.from_phone).toBe('No proporcionat');
  });

  it('TP4 — from_service is the correct Catalan label', async () => {
    await sendEmail({ ...baseValidForm, serviceType: 'artterapia' });
    const templateParams = mockSend.mock.calls[0][2] as Record<string, unknown>;
    expect(templateParams.from_service).toBe('Artteràpia');
  });
});
