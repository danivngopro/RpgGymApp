import { describe, expect, it } from 'vitest';
import { buildHealthUrl } from './api';

describe('buildHealthUrl', () => {
  it('builds the health URL from VITE_API_URL without changing ports', () => {
    expect(buildHealthUrl('http://localhost:4001/api')).toBe('http://localhost:4001/api/health');
    expect(buildHealthUrl('http://localhost:4001/api/')).toBe('http://localhost:4001/api/health');
  });
});
