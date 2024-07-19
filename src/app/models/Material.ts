export class Material {
  private _numero: string
  private _lacre?: string = ""
  private _fotos: {
    embalagem: string[]
    lacre: string[]
    detalhes: string[]
    simCards: string[]
    memoryCard: string[]
  } = {
    embalagem: [],
    lacre: [],
    detalhes: [],
    simCards: [],
    memoryCard: [],
  }

  constructor(numero: string = "") {
    this._numero = numero
    if (!this.validateNumero()) {
      throw new Error("Número de material inválido.")
    }
  }

  get numero() {
    return this._numero
  }

  get lacre() {
    return this._lacre
  }

  get fotos() {
    return this._fotos
  }

  validateNumero(): boolean {
    console.log("validateNumero", this._numero)
    const regex = /(^(0*[1-9]\d{0,3}))\/(20(2[0-9]|3[0-9]|4[0-9]|50)|[2-4][0-9]|50)$/
    return regex.test(this._numero)
  }
}
