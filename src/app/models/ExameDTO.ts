import { MaterialDTO } from "./MaterialDTO"
import { UsuarioDTO } from "./UsuarioDTO"

export interface ExameDTO {
  id?: string
  codigo?: string
  uf?: string
  embalagem?: string
  currentStep?: number
  material: MaterialDTO
  status?: {
    codigo?: number
    data?: string
    usuario?: UsuarioDTO
  }
}
