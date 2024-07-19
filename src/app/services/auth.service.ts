import { Injectable } from "@angular/core"
import { Usuario } from "../models/Usuario"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private usuarioAtual: Usuario

  constructor() {
    this.usuarioAtual = new Usuario({
      codigo: "9780",
      nome: "Weber Rener Paiva",
      perfil: "Perito",
    })
  }

  getUsuarioAtual(): Usuario {
    return this.usuarioAtual
  }
}
