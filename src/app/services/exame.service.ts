import { Injectable, signal, WritableSignal } from "@angular/core"
import { TAREFAS, STEP, Usuario, Exame, Material } from "../models"

@Injectable({
  providedIn: "root",
})
export class ExameService {
  state: WritableSignal<ExameState> = signal<ExameState>({
    error: null,
    message: "Receber material na secretaria do SETEC",
    action: TAREFAS.RECEBER_MATERIAL,
    status: STEP.RECEBER_MATERIAL,
    listaExames: [],
    usuarioAtual: null,
    exameAtual: null,
  })

  constructor() {}

  get state$() {
    return this.state
  }

  getListaPessoas() {
    const listaPessoas: Usuario[] = [
      {
        codigo: "9780",
        nome: "Weber",
        perfil: "Perito",
        uf: "GO",
      },
      {
        codigo: "0000",
        nome: "Castro",
        perfil: "Perito",
        uf: "GO",
      },
      {
        codigo: "0000",
        nome: "Clayton",
        perfil: "Perito",
        uf: "GO",
      },
      {
        codigo: "0000",
        nome: "Daniel",
        perfil: "Perito",
        uf: "GO",
      },
      {
        codigo: "0000",
        nome: "Leandro Barcelos",
        perfil: "Perito",
        uf: "GO",
      },
      {
        codigo: "0000",
        nome: "Moreira",
        perfil: "Perito",
        uf: "GO",
      },
      {
        codigo: "0000",
        nome: "Rafael",
        perfil: "Perito",
        uf: "GO",
      },
      {
        codigo: "0000",
        nome: "Eugênio",
        perfil: "Estagiário",
        uf: "GO",
      },
    ]
    return listaPessoas
  }
}

export type ExameState = {
  error: Error
  message: string
  action: TAREFAS
  status: STEP
  listaExames: Exame[]
  usuarioAtual: Usuario
  exameAtual: Exame
}
