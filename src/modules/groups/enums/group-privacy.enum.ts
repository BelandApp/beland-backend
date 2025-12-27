export enum GroupPrivacyCode {
  PUBLIC_OPEN = 'PUBLIC_OPEN',       // Visible + cualquiera puede unirse
  PUBLIC_CLOSED = 'PUBLIC_CLOSED',   // Visible + requiere aprobación
  PRIVATE_INVITE = 'PRIVATE_INVITE', // No visible + solo invitación
}