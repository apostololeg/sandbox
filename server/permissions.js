export const ROLES = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  USER: 'USER',
};

export function validateRole(user, ...roles) {
  if (!user) return false;

  return [ROLES.ADMIN, ...roles].some((role) => user.roles.includes(role));
}
