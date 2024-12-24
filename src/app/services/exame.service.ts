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

  async syncWithFirebase() {
    await this.repository
      .save(new Exame(new Material("123")))
      .then(() => {
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error writing document: ", error)
      })
    await this.repository.getByCodigo("0123/2024 GO").then((exame) => {
      console.log("getByCodigo => exame", exame)
    })
  }

  get state$() {
    return this.state
  }

  getListaPessoas() {
    const listaPessoas: Usuario[] = [
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
      {
        codigo: "0000",
        nome: "João Pedro",
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
