export interface HistorialReserva {
  id: number;
  ecolodge: {
    nombre: string;
    ubicacion: string;
    
  };
  viajero: {
    first_name: string;
    last_name: string;
   
  };
  fecha_inicio: string;
  fecha_fin: string;
  precio_total: string;
  estado: string;
}
