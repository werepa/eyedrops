export class Usuario {
  codigo: string = ""
  nome: string = ""
  perfil: string = ""

  constructor(usuario: Usuario) {
    this.codigo = usuario.codigo
    this.nome = usuario.nome
    this.perfil = usuario.perfil
  }
}