export enum RoleEnum {
  USER = 'USER',
  LEADER = 'LEADER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  COMMERCE = 'COMMERCE',
  FUNDATION = 'FUNDATION',
}

// Definición de tipo para todos los roles válidos
export type ValidRoleNames = `${RoleEnum}`;