import { isReturnPath } from './return-path';

describe('isReturnPath', () => {
  it('accepts the pages of the app, query string included', () => {
    expect(isReturnPath('/cuestionario')).toBe(true);
    expect(isReturnPath('/mis-rutas/abc?from=admin')).toBe(true);
    expect(isReturnPath('/authors')).toBe(true);
  });

  it('rejects anything that would leave the site', () => {
    expect(isReturnPath('https://example.com')).toBe(false);
    expect(isReturnPath('//example.com')).toBe(false);
    expect(isReturnPath('/\\example.com')).toBe(false);
  });

  it('rejects the auth pages, which would loop back to the login', () => {
    expect(isReturnPath('/auth')).toBe(false);
    expect(isReturnPath('/auth/login?redirectTo=%2F')).toBe(false);
  });

  it('rejects an empty value', () => {
    expect(isReturnPath(null)).toBe(false);
    expect(isReturnPath('')).toBe(false);
  });
});
