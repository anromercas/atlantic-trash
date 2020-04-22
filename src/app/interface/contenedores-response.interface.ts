import { Contenedor } from "./contenedor.interface";

export interface ContenedoresResponse {
  basuras: Contenedor[];
  ok: boolean;
  total: number;
}
