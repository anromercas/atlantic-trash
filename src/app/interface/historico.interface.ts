export interface Historico {
  _id: string;
  idBasura: string;
  nombre: string;
  codigoContenedor: string;
  numeroContenedor: number;
  calificacion: number;
  estado: string;
  zona: string;
  residuo: string;
  observaciones: string;
  fecha: string;
  img?: string;
  imgContenedor: string;
  __v: number;

  imgDetalle?: string;
}
