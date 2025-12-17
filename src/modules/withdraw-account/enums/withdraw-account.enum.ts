// Pais.
export enum CountryEnum {
  AR = 'ARGENTINA',
  CO = 'COLOMBIA',
  EC = 'ECUADOR',
}
    // Definición de tipo 
    export type CountryNames = `${CountryEnum}`;

// holder-document-type.enum.ts
export enum HolderDocumentType {
  DNI = 'DNI',
  CUIT = 'CUIT',
  CUIL = 'CUIL',
  CEDULA = 'CEDULA',
  RUC = 'RUC',
  NIT = 'NIT',
}
    // Definición de tipo 
    export type DocumentTypeNames = `${HolderDocumentType}`;

// currency.enum.ts
export enum Currency {
  ARS = 'ARS',
  USD = 'USD',
  COP = 'COP',
}
    // Definición de tipo 
    export type CurrencyNames = `${Currency}`;
