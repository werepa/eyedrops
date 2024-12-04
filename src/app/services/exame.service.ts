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
