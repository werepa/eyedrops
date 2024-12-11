import { BATERIA_STATUS, TELA_STATUS } from "./listas"

export class Material {
  private _numero: string = ""
  private _uf: string = ""
  private _lacre: string = ""
  private _recebidoLigado: boolean = false
  private _bateria: BATERIA_STATUS = BATERIA_STATUS.NAO_VERIFICADA
  private _telaFuncionando: TELA_STATUS = TELA_STATUS.NAO_VERIFICADA
  private _recebidoModoAviao: boolean = false
  private _recebidoBloqueado: boolean = false
  private _senhaFornecida: boolean = false
  private _senha: string = ""
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
  private _descricao: string = ""
  private _codigoEpol: string = ""
  private _estado_conservacao: string = ""
  private _aparencia_tela: string = ""
  private _funcionamento_tela: string = ""
  private _funcionamento_touch: string = ""
  private _funcionamento_botoes: string = ""
  private _funcionamento_conector_dados: string = ""
  private _outros_defeitos_observados: string = ""
  private _qtde_simcard: string = ""
  private _simcard1_operadora: string = ""
  private _simcard2_operadora: string = ""
  private _simcard3_operadora: string = ""
  private _qtde_memorycard: string = ""
  private _fabricante: string = ""
  private _modelo: string = ""
  private _imei1: string = ""
  private _imei2: string = ""
  private _serial: string = ""
  private _is_modo_aviao: boolean = false
  private _is_simcard1_extracted: boolean = false
  private _is_simcard2_extracted: boolean = false
  private _is_simcard3_extracted: boolean = false
  private _is_memorycard1_extracted: boolean = false
  private _is_memorycard2_extracted: boolean = false
  private _is_memorycard3_extracted: boolean = false
  private _is_device_data_extracted: boolean = false
  private _whatsapp_physical_analyzer: string = ""

  constructor(numero: string = "", uf: string = "GO") {
    this.filterNumero(numero)
    if (!this.validateNumero()) {
      throw new Error("Número de material inválido.")
    }
    this._uf = uf.toUpperCase()
  }

  get numero(): string {
    return this._numero
  }

  get uf(): string {
    return this._uf
  }

  get lacre(): string {
    return this._lacre
  }

  set lacre(lacre: string) {
    this._lacre = lacre
  }

  get fotos() {
    return this._fotos
  }

  get recebidoLigado(): boolean {
    return this._recebidoLigado
  }

  set recebidoLigado(ligado: boolean) {
    this._recebidoLigado = ligado
  }

  get bateria(): BATERIA_STATUS {
    return this._bateria
  }

  set bateria(status: BATERIA_STATUS) {
    this._bateria = status
  }

  get telaFuncionando(): TELA_STATUS {
    return this._telaFuncionando
  }

  set telaFuncionando(status: TELA_STATUS) {
    this._telaFuncionando = status
  }

  get recebidoModoAviao(): boolean {
    return this._recebidoModoAviao
  }

  set recebidoModoAviao(modo: boolean) {
    this._recebidoModoAviao = modo
  }

  get recebidoBloqueado(): boolean {
    return this._recebidoBloqueado
  }

  set recebidoBloqueado(bloqueado: boolean) {
    this._recebidoBloqueado = bloqueado
  }

  get senhaFornecida(): boolean {
    return this._senhaFornecida
  }

  set senhaFornecida(fornecida: boolean) {
    this._senhaFornecida = fornecida
  }

  get senha(): string {
    return this._senha
  }

  set senha(senha: string) {
    this._senha = senha
  }

  get descricao(): string {
    return this._descricao
  }

  get codigoEpol(): string {
    return this._codigoEpol
  }

  set codigoEpol(codigo: string) {
    this._codigoEpol = codigo
  }

  set descricao(descricao: string) {
    this._descricao = descricao
  }

  get estado_conservacao(): string {
    return this._estado_conservacao
  }

  set estado_conservacao(estado: string) {
    this._estado_conservacao = estado
  }

  get aparencia_tela(): string {
    return this._aparencia_tela
  }

  set aparencia_tela(aparencia: string) {
    this._aparencia_tela = aparencia
  }

  get funcionamento_tela(): string {
    return this._funcionamento_tela
  }

  set funcionamento_tela(funcionamento: string) {
    this._funcionamento_tela = funcionamento
  }

  get funcionamento_touch(): string {
    return this._funcionamento_touch
  }

  set funcionamento_touch(touch: string) {
    this._funcionamento_touch = touch
  }

  get funcionamento_botoes(): string {
    return this._funcionamento_botoes
  }

  set funcionamento_botoes(botoes: string) {
    this._funcionamento_botoes = botoes
  }

  get funcionamento_conector_dados(): string {
    return this._funcionamento_conector_dados
  }

  set funcionamento_conector_dados(conector: string) {
    this._funcionamento_conector_dados = conector
  }

  get outros_defeitos_observados(): string {
    return this._outros_defeitos_observados
  }

  set outros_defeitos_observados(defeitos: string) {
    this._outros_defeitos_observados = defeitos
  }

  get qtde_simcard(): string {
    return this._qtde_simcard
  }

  set qtde_simcard(qtde: string) {
    this._qtde_simcard = qtde
  }

  get simcard1_operadora(): string {
    return this._simcard1_operadora
  }

  set simcard1_operadora(operadora: string) {
    this._simcard1_operadora = operadora
  }

  get simcard2_operadora(): string {
    return this._simcard2_operadora
  }

  set simcard2_operadora(operadora: string) {
    this._simcard2_operadora = operadora
  }

  get simcard3_operadora(): string {
    return this._simcard3_operadora
  }

  set simcard3_operadora(operadora: string) {
    this._simcard3_operadora = operadora
  }

  get qtde_memorycard(): string {
    return this._qtde_memorycard
  }

  set qtde_memorycard(qtde: string) {
    this._qtde_memorycard = qtde
  }

  get fabricante(): string {
    return this._fabricante
  }

  set fabricante(fabricante: string) {
    this._fabricante = fabricante
  }

  get modelo(): string {
    return this._modelo
  }

  set modelo(modelo: string) {
    this._modelo = modelo
  }

  get imei1(): string {
    return this._imei1
  }

  set imei1(imei: string) {
    this._imei1 = imei
  }

  get imei2(): string {
    return this._imei2
  }

  set imei2(imei: string) {
    this._imei2 = imei
  }

  get serial(): string {
    return this._serial
  }

  set serial(serial: string) {
    this._serial = serial
  }

  get is_modo_aviao(): boolean {
    return this._is_modo_aviao
  }

  set is_modo_aviao(modo: boolean) {
    this._is_modo_aviao = modo
  }

  get is_simcard1_extracted(): boolean {
    return this._is_simcard1_extracted
  }

  set is_simcard1_extracted(extracted: boolean) {
    this._is_simcard1_extracted = extracted
  }

  get is_simcard2_extracted(): boolean {
    return this._is_simcard2_extracted
  }

  set is_simcard2_extracted(extracted: boolean) {
    this._is_simcard2_extracted = extracted
  }

  get is_simcard3_extracted(): boolean {
    return this._is_simcard3_extracted
  }

  set is_simcard3_extracted(extracted: boolean) {
    this._is_simcard3_extracted = extracted
  }

  get is_memorycard1_extracted(): boolean {
    return this._is_memorycard1_extracted
  }

  set is_memorycard1_extracted(extracted: boolean) {
    this._is_memorycard1_extracted = extracted
  }

  get is_memorycard2_extracted(): boolean {
    return this._is_memorycard2_extracted
  }

  set is_memorycard2_extracted(extracted: boolean) {
    this._is_memorycard2_extracted = extracted
  }

  get is_memorycard3_extracted(): boolean {
    return this._is_memorycard3_extracted
  }

  set is_memorycard3_extracted(extracted: boolean) {
    this._is_memorycard3_extracted = extracted
  }

  get is_device_data_extracted(): boolean {
    return this._is_device_data_extracted
  }

  set is_device_data_extracted(extracted: boolean) {
    this._is_device_data_extracted = extracted
  }

  get whatsapp_physical_analyzer(): string {
    return this._whatsapp_physical_analyzer
  }

  set whatsapp_physical_analyzer(whatsapp: string) {
    this._whatsapp_physical_analyzer = whatsapp
  }

  // Verifica se dois materiais são iguais
  public equal(material: Material): boolean {
    return this._numero === this.formatNumber(material.numero) && this._uf === material.uf.toUpperCase()
  }

  // verifica se o número do material possui ano, caso contrário adiciona o ano atual
  // deve seguir o padrão "0001/2021"
  private formatNumber(numero: string) {
    const regex = /^\d{1,4}\/\d{2,4}$/ // Verifica se segue o padrão "1/21", "0001/2021", etc.
    if (!regex.test(numero)) {
      // Se não seguir o padrão, adiciona o ano atual
      const currentYear = new Date().getFullYear()
      // Garante que o número antes da barra tenha quatro dígitos
      const formattedNumber = numero.padStart(4, "0")
      return `${formattedNumber}/${currentYear}`
    } else {
      // Se já seguir o padrão, apenas define o número
      // Divide o número para garantir que a parte do ano esteja correta
      const parts = numero.split("/")
      const yearPart = parts[1].length === 2 ? `20${parts[1]}` : parts[1]
      const numberPart = parts[0].padStart(4, "0")
      return `${numberPart}/${yearPart}`
    }
  }

  private filterNumero(numero: string) {
    this._numero = this.formatNumber(numero)
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
