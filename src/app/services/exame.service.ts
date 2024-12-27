import { Injectable, Inject, signal, WritableSignal } from "@angular/core"
import { TAREFAS, STEP, Usuario, Exame, Material, ExameDTO } from "../models"
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
  exameInicial: ExameState = { ...this.state() }

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

  changeExameAtual(exame: Exame) {
    this.state.update((state) => {
      state.exameAtual = exame
      return state
    })
  }

  listDifferences(exame1: ExameDTO, exame2: ExameDTO) {
    const differences: { field: string; oldValue: any; newValue: any }[] = []

    function compareFields(field: string, value1: any, value2: any) {
      if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length) {
          differences.push({ field, oldValue: value1, newValue: value2 })
        } else {
          value1.forEach((item, index) => {
            if (item !== value2[index]) {
              differences.push({ field: `${field}[${index}]`, oldValue: item, newValue: value2[index] })
            }
          })
        }
      } else if (value1 !== value2) {
        differences.push({ field, oldValue: value1, newValue: value2 })
      }
    }

    compareFields("id", exame1.id, exame2.id)
    compareFields("codigo", exame1.codigo, exame2.codigo)
    compareFields("uf", exame1.uf, exame2.uf)
    compareFields("embalagem", exame1.embalagem, exame2.embalagem)
    compareFields("currentStep", exame1.currentStep, exame2.currentStep)
    compareFields("updatedAt", exame1.updatedAt, exame2.updatedAt)

    for (const key in exame1.material) {
      if (exame1.material.hasOwnProperty(key)) {
        compareFields(`material.${key}`, exame1.material[key], exame2.material[key])
      }
    }

    return differences
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
