export enum ProfileEnum {
  DELIVERY_DRIVER = 'DELIVERY_DRIVER',
  WAREHOUSE = 'WAREHOUSE',
  COMMERCE = 'COMMERCE',
  FUNDATION = 'FUNDATION',
}

// Definición de tipo para todos los perfiles válidos
export type ValidProfileNames = `${ProfileEnum}`;