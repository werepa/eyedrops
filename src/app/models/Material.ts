import { BATERIA_STATUS, TELA_STATUS } from "./listas"
import { MaterialDTO } from "./MaterialDTO"

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
  private _qtde_simcard: number = 0
  private _simcard1_operadora: string = ""
  private _simcard1_numero: string = ""
  private _simcard2_operadora: string = ""
  private _simcard2_numero: string = ""
  private _simcard3_operadora: string = ""
  private _simcard3_numero: string = ""
  private _qtde_memorycard: number = 0
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
  private _is_inseyets_extracting: boolean = false
  private _inseyets_laped_machine: string = ""
  private _is_physical_analyzer_opening: boolean = false
  private _physical_analyzer_laped_machine: string = ""
  private _whatsapp_physical_analyzer: string = ""
  private _dados_usuario: string = ""
  private _is_iped_opening: boolean = false
  private _is_iped_ok: boolean = false
  private _is_zipping: boolean = false
  private _is_zip_ok: boolean = false
  private _is_zip_moving: boolean = false

  private constructor(numero: string, uf: string) {
    this.filterNumero(numero)
    if (!this.validateNumero()) {
      throw new Error("Número de material inválido.")
    }
    this._uf = uf.toUpperCase()
  }

  static create(materialDTO: MaterialDTO): Material {
    materialDTO.uf = materialDTO.uf ?? "GO"
    let material = new Material(materialDTO.numero, materialDTO.uf)
    material._lacre = materialDTO.lacre ?? ""
    material._recebidoLigado = materialDTO.recebidoLigado ?? false
    material._bateria = materialDTO.bateria ?? 0
    material._telaFuncionando = materialDTO.telaFuncionando ?? 0
    material._recebidoModoAviao = materialDTO.recebidoModoAviao ?? false
    material._recebidoBloqueado = materialDTO.recebidoBloqueado ?? false
    material._senhaFornecida = materialDTO.senhaFornecida ?? false
    material._senha = materialDTO.senha ?? ""
    material._fotos = {
      embalagem: [],
      lacre: [],
      detalhes: [],
      simCards: [],
      memoryCard: [],
    }
    if (materialDTO.fotos && materialDTO.fotos.embalagem) {
      material._fotos.embalagem = JSON.parse(materialDTO.fotos.embalagem)
    }
    if (materialDTO.fotos && materialDTO.fotos.lacre) {
      material._fotos.lacre = JSON.parse(materialDTO.fotos.lacre)
    }
    if (materialDTO.fotos && materialDTO.fotos.detalhes) {
      material._fotos.detalhes = JSON.parse(materialDTO.fotos.detalhes)
    }
    if (materialDTO.fotos && materialDTO.fotos.simCards) {
      material._fotos.simCards = JSON.parse(materialDTO.fotos.simCards)
    }
    if (materialDTO.fotos && materialDTO.fotos.memoryCard) {
      material._fotos.memoryCard = JSON.parse(materialDTO.fotos.memoryCard)
    }
    material._descricao = materialDTO.descricao ?? ""
    material._codigoEpol = materialDTO.codigoEpol ?? ""
    material._estado_conservacao = materialDTO.estado_conservacao ?? ""
    material._aparencia_tela = materialDTO.aparencia_tela ?? ""
    material._funcionamento_tela = materialDTO.funcionamento_tela ?? ""
    material._funcionamento_touch = materialDTO.funcionamento_touch ?? ""
    material._funcionamento_botoes = materialDTO.funcionamento_botoes ?? ""
    material._funcionamento_conector_dados = materialDTO.funcionamento_conector_dados ?? ""
    material._outros_defeitos_observados = materialDTO.outros_defeitos_observados ?? ""
    material._qtde_simcard = materialDTO.qtde_simcard ?? 0
    material._simcard1_operadora = materialDTO.simcard1_operadora ?? ""
    material._simcard1_numero = materialDTO.simcard1_numero ?? ""
    material._simcard2_operadora = materialDTO.simcard2_operadora ?? ""
    material._simcard2_numero = materialDTO.simcard2_numero ?? ""
    material._simcard3_operadora = materialDTO.simcard3_operadora ?? ""
    material._simcard3_numero = materialDTO.simcard3_numero ?? ""
    material._qtde_memorycard = materialDTO.qtde_memorycard ?? 0
    material._fabricante = materialDTO.fabricante ?? ""
    material._modelo = materialDTO.modelo ?? ""
    material._imei1 = materialDTO.imei1 ?? ""
    material._imei2 = materialDTO.imei2 ?? ""
    material._serial = materialDTO.serial ?? ""
    material._is_modo_aviao = materialDTO.is_modo_aviao ?? false
    material._is_simcard1_extracted = materialDTO.is_simcard1_extracted ?? false
    material._is_simcard2_extracted = materialDTO.is_simcard2_extracted ?? false
    material._is_simcard3_extracted = materialDTO.is_simcard3_extracted ?? false
    material._is_memorycard1_extracted = materialDTO.is_memorycard1_extracted ?? false
    material._is_memorycard2_extracted = materialDTO.is_memorycard2_extracted ?? false
    material._is_memorycard3_extracted = materialDTO.is_memorycard3_extracted ?? false
    material._is_inseyets_extracting = materialDTO.is_inseyets_extracting ?? false
    material._inseyets_laped_machine = materialDTO.inseyets_laped_machine ?? ""
    material._is_physical_analyzer_opening = materialDTO.is_physical_analyzer_opening ?? false
    material._physical_analyzer_laped_machine = materialDTO.physical_analyzer_laped_machine ?? ""
    material._whatsapp_physical_analyzer = materialDTO.whatsapp_physical_analyzer ?? ""
    material._dados_usuario = materialDTO.dados_usuario ?? ""
    material._is_iped_opening = materialDTO.is_iped_opening ?? false
    material._is_iped_ok = materialDTO.is_iped_ok ?? false
    material._is_zipping = materialDTO.is_zipping ?? false
    material._is_zip_ok = materialDTO.is_zip_ok ?? false
    material._is_zip_moving = materialDTO.is_zip_moving ?? false

    return material
  }

  toPersistence(): MaterialDTO {
    return {
      numero: this.numero,
      uf: this.uf,
      codigo: this.codigo,
      lacre: this.lacre,
      recebidoLigado: this.recebidoLigado,
      bateria: this.bateria,
      telaFuncionando: this.telaFuncionando,
      recebidoModoAviao: this.recebidoModoAviao,
      recebidoBloqueado: this.recebidoBloqueado,
      senhaFornecida: this.senhaFornecida,
      senha: this.senha,
      fotos: {
        embalagem: this.fotos.embalagem.length > 0 ? JSON.stringify(this.fotos.embalagem) : "",
        lacre: this.fotos.lacre.length > 0 ? JSON.stringify(this.fotos.lacre) : "",
        detalhes: this.fotos.detalhes.length > 0 ? JSON.stringify(this.fotos.detalhes) : "",
        simCards: this.fotos.simCards.length > 0 ? JSON.stringify(this.fotos.simCards) : "",
        memoryCard: this.fotos.memoryCard.length > 0 ? JSON.stringify(this.fotos.memoryCard) : "",
      },
      descricao: this.descricao,
      codigoEpol: this.codigoEpol,
      estado_conservacao: this.estado_conservacao,
      aparencia_tela: this.aparencia_tela,
      funcionamento_tela: this.funcionamento_tela,
      funcionamento_touch: this.funcionamento_touch,
      funcionamento_botoes: this.funcionamento_botoes,
      funcionamento_conector_dados: this.funcionamento_conector_dados,
      outros_defeitos_observados: this.outros_defeitos_observados,
      qtde_simcard: this.qtde_simcard,
      simcard1_operadora: this.simcard1_operadora,
      simcard1_numero: this.simcard1_numero,
      simcard2_operadora: this.simcard2_operadora,
      simcard2_numero: this.simcard2_numero,
      simcard3_operadora: this.simcard3_operadora,
      simcard3_numero: this.simcard3_numero,
      qtde_memorycard: this.qtde_memorycard,
      fabricante: this.fabricante,
      modelo: this.modelo,
      imei1: this.imei1,
      imei2: this.imei2,
      serial: this.serial,
      is_modo_aviao: this.is_modo_aviao,
      is_simcard1_extracted: this.is_simcard1_extracted,
      is_simcard2_extracted: this.is_simcard2_extracted,
      is_simcard3_extracted: this.is_simcard3_extracted,
      is_memorycard1_extracted: this.is_memorycard1_extracted,
      is_memorycard2_extracted: this.is_memorycard2_extracted,
      is_memorycard3_extracted: this.is_memorycard3_extracted,
      is_inseyets_extracting: this.is_inseyets_extracting,
      inseyets_laped_machine: this.inseyets_laped_machine,
      is_physical_analyzer_opening: this.is_physical_analyzer_opening,
      physical_analyzer_laped_machine: this.physical_analyzer_laped_machine,
      whatsapp_physical_analyzer: this.whatsapp_physical_analyzer,
      dados_usuario: this.dados_usuario,
      is_iped_opening: this.is_iped_opening,
      is_iped_ok: this.is_iped_ok,
      is_zipping: this.is_zipping,
      is_zip_ok: this.is_zip_ok,
      is_zip_moving: this.is_zip_moving,
    }
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

  get qtde_simcard(): number {
    return this._qtde_simcard
  }

  set qtde_simcard(qtde: number) {
    this._qtde_simcard = qtde
  }

  get simcard1_operadora(): string {
    return this._simcard1_operadora
  }

  set simcard1_operadora(operadora: string) {
    this._simcard1_operadora = operadora
  }

  get simcard1_numero(): string {
    return this._simcard1_numero
  }

  set simcard1_numero(numero: string) {
    this._simcard1_numero = numero
  }

  get simcard2_operadora(): string {
    return this._simcard2_operadora
  }

  set simcard2_operadora(operadora: string) {
    this._simcard2_operadora = operadora
  }

  get simcard2_numero(): string {
    return this._simcard2_numero
  }

  set simcard2_numero(numero: string) {
    this._simcard2_numero = numero
  }

  get simcard3_operadora(): string {
    return this._simcard3_operadora
  }

  set simcard3_operadora(operadora: string) {
    this._simcard3_operadora = operadora
  }

  get simcard3_numero(): string {
    return this._simcard3_numero
  }

  set simcard3_numero(numero: string) {
    this._simcard3_numero = numero
  }

  get qtde_memorycard(): number {
    return this._qtde_memorycard
  }

  set qtde_memorycard(qtde: number) {
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

  get is_inseyets_extracting(): boolean {
    return this._is_inseyets_extracting
  }

  set is_inseyets_extracting(extracted: boolean) {
    this._is_inseyets_extracting = extracted
  }

  get inseyets_laped_machine(): string {
    return this._inseyets_laped_machine
  }

  set inseyets_laped_machine(machine: string) {
    this._inseyets_laped_machine = machine
  }

  get is_physical_analyzer_opening(): boolean {
    return this._is_physical_analyzer_opening
  }

  set is_physical_analyzer_opening(opening: boolean) {
    this._is_physical_analyzer_opening = opening
  }

  get physical_analyzer_laped_machine(): string {
    return this._physical_analyzer_laped_machine
  }

  set physical_analyzer_laped_machine(machine: string) {
    this._physical_analyzer_laped_machine = machine
  }

  get whatsapp_physical_analyzer(): string {
    return this._whatsapp_physical_analyzer
  }

  set whatsapp_physical_analyzer(whatsapp: string) {
    this._whatsapp_physical_analyzer = whatsapp
  }

  get dados_usuario(): string {
    return this._dados_usuario
  }

  set dados_usuario(dados: string) {
    this._dados_usuario = dados
  }

  get is_iped_opening(): boolean {
    return this._is_iped_opening
  }

  get is_iped_ok(): boolean {
    return this._is_iped_ok
  }

  set is_iped_ok(ok: boolean) {
    this._is_iped_ok = ok
  }

  set is_iped_opening(opening: boolean) {
    this._is_iped_opening = opening
  }

  get is_zipping(): boolean {
    return this._is_zipping
  }

  set is_zipping(zipping: boolean) {
    this._is_zipping = zipping
  }

  get is_zip_ok(): boolean {
    return this._is_zip_ok
  }

  set is_zip_ok(ok: boolean) {
    this._is_zip_ok = ok
  }

  get is_zip_moving(): boolean {
    return this._is_zip_moving
  }

  set is_zip_moving(moving: boolean) {
    this._is_zip_moving = moving
  }

  get codigo() {
    return `${this._numero} ${this._uf}`
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
