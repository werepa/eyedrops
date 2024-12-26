import { UsuarioDTO } from "./UsuarioDTO"

export class Usuario {
  codigo: string = ""
  nome: string = ""
  perfil: string = ""
  uf: string = ""

  private constructor(usuario: UsuarioDTO) {
    this.codigo = usuario.codigo
    this.nome = usuario.nome
    this.perfil = usuario.perfil
    this.uf = usuario.uf
  }

  static create(usuario: UsuarioDTO): Usuario {
    return new Usuario(usuario)
  }

  toPersistence(): UsuarioDTO {
    return {
      codigo: this.codigo,
      nome: this.nome,
      perfil: this.perfil,
      uf: this.uf,
    }
  }
}
