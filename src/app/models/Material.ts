export class Material {
  private _numero: string = ""
  private _uf: string = ""
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

  constructor(numero: string = "", uf: string = "GO") {
    this.filterNumero(numero)
    if (!this.validateNumero()) {
      throw new Error("Número de material inválido.")
    }
    this._uf = uf.toUpperCase()
  }

  get numero() {
    return this._numero
  }

  get uf() {
    return this._uf
  }

  get lacre() {
    return this._lacre
  }

  get fotos() {
    return this._fotos
  }

  // verifica se o número do material possui ano, caso contrário adiciona o ano atual
  // deve seguir o padrão "0001/2021"
  private filterNumero(numero: string) {
    const regex = /^\d{1,4}\/\d{2,4}$/ // Verifica se segue o padrão "1/21", "0001/2021", etc.
    if (!regex.test(numero)) {
      // Se não seguir o padrão, adiciona o ano atual
      const currentYear = new Date().getFullYear()
      // Garante que o número antes da barra tenha quatro dígitos
      const formattedNumber = numero.padStart(4, "0")
      this._numero = `${formattedNumber}/${currentYear}`
    } else {
      // Se já seguir o padrão, apenas define o número
      // Divide o número para garantir que a parte do ano esteja correta
      const parts = numero.split("/")
      const yearPart = parts[1].length === 2 ? `20${parts[1]}` : parts[1]
      const numberPart = parts[0].padStart(4, "0")
      this._numero = `${numberPart}/${yearPart}`
    }
  }

  // deve seguir o padrão "0001/2021" ou "0001/21" e o segundo parâmetro deve ser um ano entre 2020 e o ano atual
  validateNumero(): boolean {
    const regex = /(^(0*[1-9]\d{0,3}))\/(20(2[0-9]|3[0-9]|4[0-9]|50)|[2-4][0-9]|50)$/
    if (!regex.test(this._numero)) {
      return false
    }

    // Extrai o ano do número
    const extractedYear = this._numero.split("/")[1]
    let year = parseInt(extractedYear, 10)
    // Converte anos em formato curto para o formato completo
    if (year < 100) {
      year += 2000
    }

    // Obtém o ano atual
    const currentYear = new Date().getFullYear()

    // Verifica se o ano extraído é maior que o ano atual
    return year <= currentYear
  }
}
