import { MaterialDTO } from "./MaterialDTO"

export interface ExameDTO {
  id?: string
  codigo?: string
  uf?: string
  embalagem?: string
  currentStep?: number
  material: MaterialDTO
  updatedAt?: Date
}
