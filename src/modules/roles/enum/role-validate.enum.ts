export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export type ValidRoleNames = `${RoleEnum}`;
export const AUTHORITY_ROLES = Object.values(RoleEnum) as ValidRoleNames[];
export const ADMIN_AUTHORITY_ROLES: ValidRoleNames[] = [
  RoleEnum.ADMIN,
  RoleEnum.SUPERADMIN,
];
