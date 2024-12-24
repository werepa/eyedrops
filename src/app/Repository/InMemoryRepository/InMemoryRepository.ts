import { Exame } from "src/app/models"
import { EyedropsRepository } from "../EyedropsRepository"

export class InMemoryRepository implements EyedropsRepository {
  getByCodigo(codigo: string): Promise<any> {
    return Promise.resolve(
      this.exames.find((exame) => `${exame.material.numero} ${exame.material.uf.toUpperCase()}` === codigo.toUpperCase())
    )
  }
  exames: Exame[] = []

  async getByUF(uf: string): Promise<any[]> {
    return Promise.resolve(this.exames.filter((exame) => exame.material.uf === uf))
  }

  async save(exame: Exame): Promise<void> {
    const index = this.exames.findIndex(
      (e) =>
        `${e.material.numero} ${e.material.uf.toUpperCase()}` ===
        `${exame.material.numero} ${exame.material.uf.toUpperCase()}`
    )
    if (index < 0) {
      this.exames.push(exame)
    } else {
      this.exames[index] = exame
    }
    return
  }

  truncate() {
    this.exames = []
    return Promise.resolve()
  }
}
