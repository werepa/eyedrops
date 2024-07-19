export class Usuario {
  codigo: string = ""
  nome: string = ""
  uf: string = ""
  perfil: string = ""

  constructor(usuario: Usuario) {
    this.codigo = usuario.codigo
    this.nome = usuario.nome
    this.uf = usuario.uf
    this.perfil = usuario.perfil
  }
}
