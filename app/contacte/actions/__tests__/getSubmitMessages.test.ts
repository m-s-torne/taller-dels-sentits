import { describe, it, expect } from 'vitest';
import { getSubmitMessages } from '../getSubmitMessages';

describe('getSubmitMessages', () => {
  it('SM1 — returns object with sending, success, error keys', async () => {
    const result = await getSubmitMessages();
    expect(result).toHaveProperty('sending');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('error');
  });

  it('SM2 — sending entry has correct type and emoji', async () => {
    const { sending } = await getSubmitMessages();
    expect(sending.type).toBe('sending');
    expect(sending.emoji).toBe('📤');
  });

  it('SM3 — success entry has correct type and emoji', async () => {
    const { success } = await getSubmitMessages();
    expect(success.type).toBe('success');
    expect(success.emoji).toBe('✅');
  });

  it('SM4 — error entry has correct type and emoji', async () => {
    const { error } = await getSubmitMessages();
    expect(error.type).toBe('error');
    expect(error.emoji).toBe('❌');
  });

  it('SM5 — each entry has non-empty text, bgColor, textColor', async () => {
    const result = await getSubmitMessages();
    for (const entry of Object.values(result)) {
      expect(typeof entry.text).toBe('string');
      expect(entry.text.length).toBeGreaterThan(0);
      expect(typeof entry.bgColor).toBe('string');
      expect(entry.bgColor.length).toBeGreaterThan(0);
      expect(typeof entry.textColor).toBe('string');
      expect(entry.textColor.length).toBeGreaterThan(0);
    }
  });
});
