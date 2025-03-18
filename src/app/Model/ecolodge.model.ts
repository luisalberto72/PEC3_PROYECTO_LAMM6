

export interface Ecolodge {
    id: number;
    nombre: string;
    ubicacion: string;
    descripcion: string;
    precio: number;
    paneles_solares: boolean;
    energia_renovable: boolean;
    role: string;
  }
  
  export interface EcolodgeResponse {
    ecolodges: Ecolodge[];
  }
  