import { describe, it, expect } from 'vitest';
import { getServiceLabel, getServiceLabels } from '../getServiceLabel';

describe('getServiceLabel', () => {
  it('SL1 — artterapia', () => {
    expect(getServiceLabel('artterapia')).toBe('Artteràpia');
  });

  it('SL2 — artperdins', () => {
    expect(getServiceLabel('artperdins')).toBe('Artperdins');
  });

  it('SL3 — serveis-externs', () => {
    expect(getServiceLabel('serveis-externs')).toBe('Serveis Externs');
  });

  it('SL4 — general', () => {
    expect(getServiceLabel('general')).toBe('Consulta General');
  });
});

describe('getServiceLabels', () => {
  it('SL5 — returns all 4 service type keys', () => {
    const result = getServiceLabels();
    expect(Object.keys(result)).toHaveLength(4);
    expect(result).toHaveProperty('artterapia');
    expect(result).toHaveProperty('artperdins');
    expect(result).toHaveProperty('serveis-externs');
    expect(result).toHaveProperty('general');
  });
});
