// A page of this app worth returning to after a login. Never another origin (//host or
// /\host both leave the site) and never an auth page, which would loop back to the login
export function isReturnPath(url: string | null | undefined): url is string {
  return (
    typeof url === 'string' &&
    url.startsWith('/') &&
    !url.startsWith('//') &&
    !url.startsWith('/\\') &&
    !/^\/auth(?:[/?#]|$)/.test(url)
  );
}
