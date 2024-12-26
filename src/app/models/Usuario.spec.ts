import { Usuario } from "./Usuario"
import { UsuarioDTO } from "./UsuarioDTO"

describe("Usuario", () => {
  it("should convert Usuario to UsuarioDTO", () => {
    const usuario = Usuario.create({
      codigo: "123",
      nome: "John Doe",
      perfil: "admin",
      uf: "SP",
    })

    const usuarioDTO: UsuarioDTO = usuario.toPersistence()

    expect(usuarioDTO).toEqual({
      codigo: "123",
      nome: "John Doe",
      perfil: "admin",
      uf: "SP",
    })
  })
})
