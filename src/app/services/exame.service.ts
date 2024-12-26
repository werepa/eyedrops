import { Injectable, Inject, signal, WritableSignal } from "@angular/core"
import { TAREFAS, STEP, Usuario, Exame, Material } from "../models"
import { EyedropsRepository } from "../Repository"

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

  constructor(@Inject("EYEDROPS_REPOSITORY") public repository: EyedropsRepository) {}

  async syncWithFirebase() {}

  get state$() {
    return this.state
  }

  getListaPessoas() {
    const listaPessoas: Usuario[] = [
      Usuario.create({
        codigo: "0000",
        nome: "Castro",
        perfil: "Perito",
        uf: "GO",
      }),
      Usuario.create({
        codigo: "0000",
        nome: "Clayton",
        perfil: "Perito",
        uf: "GO",
      }),
      Usuario.create({
        codigo: "0000",
        nome: "Daniel",
        perfil: "Perito",
        uf: "GO",
      }),
      Usuario.create({
        codigo: "0000",
        nome: "Leandro Barcelos",
        perfil: "Perito",
        uf: "GO",
      }),
      Usuario.create({
        codigo: "0000",
        nome: "Moreira",
        perfil: "Perito",
        uf: "GO",
      }),
      Usuario.create({
        codigo: "0000",
        nome: "Rafael",
        perfil: "Perito",
        uf: "GO",
      }),
      Usuario.create({
        codigo: "0000",
        nome: "Eugênio",
        perfil: "Estagiário",
        uf: "GO",
      }),
      Usuario.create({
        codigo: "0000",
        nome: "João Pedro",
        perfil: "Estagiário",
        uf: "GO",
      }),
    ]
    return listaPessoas
  }

  changeUsuarioAtual(usuario: Usuario) {
    this.state.update((state) => {
      state.usuarioAtual = usuario
      return state
    })
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
