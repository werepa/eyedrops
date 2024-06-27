import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor() {}

  getUsuarioAtual() {
    return {
      codigo: "9780",
      nome: "Weber Rener Paiva",
    }
  }
}
