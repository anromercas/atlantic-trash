import { Historico } from "./historico.interface";

export interface Contenedor {
  _id: string;
  nombre: string;
  codigoContenedor: string;
  numeroContenedor: number;
  zona: string;
  imgContenedor: any;
  __v: number;
  calificacion: number;
  historico?: Historico[];
  observaciones?: string;
  fecha?: string;
  img?: string;
  imgDetalle?: string,
  estado?: string;
  residuo?: string;
  id?: string;
  key?: string;
}