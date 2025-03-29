export interface Opinion {
    id: number;
    ecolodge_id: number;
    viajero_id: number;
    calificacion: number;
    comentario: string;
    fecha: string;
    ecolodge: {
      id: number;
      nombre: string;
    };
    viajero: {
      id: number;
      first_name: string;
      last_name: string;
    };
  }
  