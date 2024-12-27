import { Exame } from "../models"
import { ExameDTO } from "../models/ExameDTO"

export interface EyedropsRepository {
  save(exame: Exame): Promise<void>
  getAll(): Promise<ExameDTO[]>
  getByCodigo(codigo: string): Promise<ExameDTO>
  getByUF(uf: string): Promise<ExameDTO[]>
  truncate(): Promise<void>
}
