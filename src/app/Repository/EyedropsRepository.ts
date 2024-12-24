import { Exame } from "../models"

export interface EyedropsRepository {
  save(exame: Exame): Promise<void>
  getByCodigo(codigo: string): Promise<any>
  getByUF(codigo: string): Promise<any[]>
  truncate(): Promise<void>
}
