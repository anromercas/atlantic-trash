import { Historico } from './historico.interface';

export interface HistoricoResponse {
  historicos: Historico[];
  ok: boolean;
  total: number;
}
