export enum ProfileEnum {
  DRIVER = 'DRIVER',          // repartidor
  HUB = 'HUB',                // centro de acopio / warehouse
  MERCHANT = 'MERCHANT',      // comercio
  FOUNDATION = 'FOUNDATION',  // fundación
  CREATOR = 'CREATOR',        // creador / promotor de eventos
  RECYCLER_BASE = 'RECYCLER_BASE', // reciclador de base
}

export type ValidProfileNames = `${ProfileEnum}`;
