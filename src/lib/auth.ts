export function isAuthorized(token?: string | null) {
  return Boolean(token && token === process.env.ADMIN_TOKEN);
}
