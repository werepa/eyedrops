import { Material, Usuario } from "."
import { ExameDTO } from "./ExameDTO"
import { EXAME_STATUS, STEP, Tarefa, TAREFAS } from "./listas"

export class Exame {
  private _id: string
  private _embalagem: string = ""
  private _tarefas: Tarefa[] = []
  private _currentStep: STEP = STEP.RECEBER_MATERIAL
  private _material: Material
  private _updatedAt: Date

  private constructor(material: Material) {
    this.material = material
    this.reset()
  }

  static create(exameDTO: ExameDTO): Exame {
    const exame = new Exame(Material.create(exameDTO.material))
    exame._id = exameDTO.id
    exame.embalagem = exameDTO.embalagem ?? ""
    exame.currentStep = exameDTO.currentStep ?? STEP.RECEBER_MATERIAL
    exame._updatedAt = exameDTO.updatedAt ? new Date(exameDTO.updatedAt) : new Date()
    return exame
  }

  toPersistence(): ExameDTO {
    return {
      codigo: this.material.codigo,
      uf: this.material.uf,
      embalagem: this.embalagem,
      currentStep: this.currentStep,
      material: this.material?.toPersistence(),
      updatedAt: new Date(),
    }
  }

  get id(): string {
    return this._id
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get material(): Material {
    return this._material
  }

  set material(material: Material) {
    this._material = material
  }

  /*
  // RECEBER_MATERIAL = 0,
  // VERIFICAR_MATERIAL_LACRADO = 1,
  // VERIFICAR_MATERIAL_DEVE_SER_LACRADO = 2,
  // VERIFICAR_LACRE_CONFERE = 3,
  // VERIFICAR_QTDE_SIM_CARDS = 4,
  // VERIFICAR_QTDE_MEMORY_CARDS = 5,
  // VERIFICAR_APARELHO_RECEBIDO_LIGADO = 6,
  // VERIFICAR_FUNCIONAMENTO_TELA = 7,
  // VERIFICAR_TELEFONE_BLOQUEADO = 8,
  // VERIFICAR_FORNECIMENTO_SENHA = 9,
  // VERIFICAR_MODO_AVIAO = 10,
  // PREPARAR_EXTRACAO_DADOS = 11,
  // EXTRAINDO_DADOS_APARELHO = 12,
  // VERIFICAR_PHYSICAL_ANALYSER = 13,
  // PROCESSANDO_IPED = 14,
  // GERANDO_ZIP = 15,
  // MOVENDO_ZIP = 16,
  // TAREFAS_CONCLUIDAS = 17,
*/
  getStepDescricao(step: STEP): string {
    const detalhesSteps = [
      { codigo: STEP.RECEBER_MATERIAL, descricao: "Receber material" },
      { codigo: STEP.VERIFICAR_MATERIAL_LACRADO, descricao: "Verificar se o material está lacrado" },
      { codigo: STEP.VERIFICAR_MATERIAL_DEVE_SER_LACRADO, descricao: "Verificar se o material deve ser lacrado" },
      { codigo: STEP.VERIFICAR_LACRE_CONFERE, descricao: "Conferir lacre do material com o Siscrim" },
      { codigo: STEP.VERIFICAR_QTDE_SIM_CARDS, descricao: "Verificar quantidade de SIM cards" },
      { codigo: STEP.VERIFICAR_QTDE_MEMORY_CARDS, descricao: "Verificar quantidade de memory cards" },
      { codigo: STEP.VERIFICAR_APARELHO_RECEBIDO_LIGADO, descricao: "Verificar se o aparelho foi recebido ligado" },
      { codigo: STEP.VERIFICAR_FUNCIONAMENTO_TELA, descricao: "Verificar funcionamento da tela" },
      { codigo: STEP.VERIFICAR_TELEFONE_BLOQUEADO, descricao: "Verificar se o telefone foi recebido bloqueado" },
      { codigo: STEP.VERIFICAR_FORNECIMENTO_SENHA, descricao: "Verificar se a senha foi fornecida" },
      { codigo: STEP.VERIFICAR_MODO_AVIAO, descricao: "Verificar se o aparelho foi recebido em modo avião" },
      { codigo: STEP.PREPARAR_EXTRACAO_DADOS, descricao: "Preparar aparelho para extração de dados" },
      { codigo: STEP.EXTRAINDO_DADOS_APARELHO, descricao: "Extraindo dados do aparelho" },
      { codigo: STEP.VERIFICAR_PHYSICAL_ANALYSER, descricao: "Verificar extração no Physical Analyzer" },
      { codigo: STEP.PROCESSANDO_IPED, descricao: "Processando IPED" },
      { codigo: STEP.IPED_VERIFICADO, descricao: "IPED verificado" },
      { codigo: STEP.GERANDO_ZIP, descricao: "Gerando ZIP" },
      { codigo: STEP.ZIP_VERIFICADO, descricao: "ZIP verificado" },
      { codigo: STEP.MOVENDO_ZIP, descricao: "Movendo ZIP para diretório de entrega" },
      { codigo: STEP.ZIP_ENVIADO, descricao: "ZIP enviado" },
      { codigo: STEP.TAREFAS_CONCLUIDAS, descricao: "Tarefas concluídas" },
    ]
    return detalhesSteps.find((s) => s.codigo === step)?.descricao || ""
  }

  getStepAtual(): { codigo: STEP; descricao: string } {
    const obj = { codigo: this.currentStep, descricao: this.getStepDescricao(this.currentStep) }
    if (obj.codigo === STEP.EXTRAINDO_DADOS_APARELHO) obj.descricao += ` (${this.material.inseyets_laped_machine})`
    if (obj.codigo === STEP.VERIFICAR_PHYSICAL_ANALYSER)
      obj.descricao += ` (${this.material.physical_analyzer_laped_machine})`
    return obj
  }

  reset() {
    const detalhesTarefas = [
      {
        codigo: TAREFAS.RECEBER_MATERIAL,
        descricao: "Receber o material na secretaria do SETEC",
      },
      {
        codigo: TAREFAS.CONFERIR_LACRE,
        descricao: "Conferir o lacre do material",
      },
      {
        codigo: TAREFAS.FOTOGRAFAR_NR_LACRE,
        descricao: "Fotografar o número do lacre",
      },
      {
        codigo: TAREFAS.FOTOGRAFAR_EMBALAGEM,
        descricao: "Fotografar embalagem material",
      },
      {
        codigo: TAREFAS.ATUALIZAR_CADASTRO_MATERIAL,
        descricao: "Atualizar cadastro do material",
      },
      {
        codigo: TAREFAS.REGISTRAR_CODIGO_EPOL,
        descricao: "Registrar código EPOL",
      },
      {
        codigo: TAREFAS.DESLACRAR_MATERIAL,
        descricao: "Deslacrar material",
      },
      {
        codigo: TAREFAS.ETIQUETAR_MATERIAL,
        descricao: "Etiquetar material",
      },
      {
        codigo: TAREFAS.FOTOGRAFAR_MATERIAL_ETIQUETADO,
        descricao: "Fotografar material etiquetado",
      },
      {
        codigo: TAREFAS.REGISTRAR_QTDE_SIM_CARDS,
        descricao: "Registrar quantidade SIM cards",
      },
      {
        codigo: TAREFAS.REGISTRAR_OPERADORA_SIM_CARD,
        descricao: "Registrar operadora SIM card",
      },
      {
        codigo: TAREFAS.FOTOGRAFAR_SIM_CARD,
        descricao: "Fotografar SIM cards",
      },
      {
        codigo: TAREFAS.EXTRACAO_SIM_CARD,
        descricao: "Realizar a extração do SIM card",
      },
      {
        codigo: TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS,
        descricao: "Registrar quantidade de memory cards",
      },
      {
        codigo: TAREFAS.FOTOGRAFAR_MEMORY_CARD,
        descricao: "Fotografar memory cards",
      },
      {
        codigo: TAREFAS.EXTRACAO_MEMORY_CARD,
        descricao: "Realizar a extração do memory card",
      },
      {
        codigo: TAREFAS.REGISTRAR_ESTADO_CONSERVACAO,
        descricao: "Registrar estado de conservação",
      },
      {
        codigo: TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS,
        descricao: "Registrar defeitos observados",
      },
      {
        codigo: TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO,
        descricao: "Registrar se o aparelho foi recebido ligado",
      },
      {
        codigo: TAREFAS.CARREGAR_BATERIA,
        descricao: "Carregar a bateria",
      },
      {
        codigo: TAREFAS.LIGAR_APARELHO,
        descricao: "Ligar o aparelho",
      },
      {
        codigo: TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA,
        descricao: "Registrar funcionamento da tela",
      },
      {
        codigo: TAREFAS.REGISTRAR_FABRICANTE_MODELO,
        descricao: "Registrar fabricante e modelo",
      },
      {
        codigo: TAREFAS.REGISTRAR_APARELHO_BLOQUEADO,
        descricao: "Registrar se o aparelho está bloqueado",
      },
      {
        codigo: TAREFAS.REGISTRAR_DETALHES_SENHA,
        descricao: "Registrar detalhes da senha",
      },
      {
        codigo: TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO,
        descricao: "Registrar se aparelho foi recebido modo avião",
      },
      {
        codigo: TAREFAS.COLOCAR_APARELHO_MODO_AVIAO,
        descricao: "Colocar o aparelho em modo avião",
      },
      {
        codigo: TAREFAS.REGISTRAR_VERSAO_SISTEMA_OPERACIONAL,
        descricao: "Registrar versão do sistema operacional",
      },
      {
        codigo: TAREFAS.REALIZAR_PROCEDIMENTOS_EXTRACAO,
        descricao: "Realizar procedimentos para extração de dados",
      },
      {
        codigo: TAREFAS.INICIAR_EXTRACAO_INSEYETS,
        descricao: "Realizar extração INSEYETS",
      },
      {
        codigo: TAREFAS.INICIAR_PHYSICAL_ANALYZER,
        descricao: "Iniciar Physical Analyzer",
      },
      {
        codigo: TAREFAS.REGISTRAR_EXTRACAO_CHATS,
        descricao: "Registrar extração de chats no P.A.",
      },
      {
        codigo: TAREFAS.REGISTRAR_NR_TELEFONE_OPERADORA,
        descricao: "Registrar número do telefone e operadora",
      },
      {
        codigo: TAREFAS.REGISTRAR_DADOS_USUARIO,
        descricao: "Registrar dados do usuário",
      },
      {
        codigo: TAREFAS.INICIAR_IPED,
        descricao: "Executar IPED",
      },
      {
        codigo: TAREFAS.REGISTRAR_IPED_OK,
        descricao: "Registrar se o IPED foi bem-sucedido",
      },
      {
        codigo: TAREFAS.INICIAR_ZIP,
        descricao: "Iniciar compactação da mídia de entrega (ZIP)",
      },
      {
        codigo: TAREFAS.REGISTRAR_ZIP_OK,
        descricao: "Registrar se o ZIP foi bem-sucedido",
      },
      {
        codigo: TAREFAS.MOVER_ZIP_DIRETORIO_ENTREGA,
        descricao: "Mover ZIP para diretório de entrega",
      },
    ]

    this._tarefas = []
    detalhesTarefas.forEach((tarefa) =>
      this._tarefas.push({
        codigo: tarefa.codigo,
        descricao: tarefa.descricao,
        historico: [],
        ativa: false,
        concluida: false,
      })
    )
  }

  get embalagem(): string {
    return this._embalagem
  }

  set embalagem(uuid: string) {
    this._embalagem = uuid
  }

  get tarefas(): Tarefa[] {
    return this._tarefas
  }

  get currentStep(): STEP {
    return this._currentStep
  }

  set currentStep(step: STEP) {
    this._currentStep = step
  }

  getTarefa(codigo: TAREFAS): Tarefa {
    return this.tarefas.find((t) => t.codigo === codigo) as Tarefa
  }

  getTarefasAtivas(): Tarefa[] {
    return this.tarefas.filter((tarefa) => tarefa.ativa)
  }

  getTarefasConcluidas(): Tarefa[] {
    return this.tarefas.filter((tarefa) => tarefa.concluida)
  }

  setTarefaAtiva(t: TAREFAS) {
    const tarefa = this.getTarefa(t)
    tarefa.ativa = true
  }

  setTarefaInativa(t: TAREFAS) {
    const tarefa = this.getTarefa(t)
    tarefa.ativa = false
  }

  setTarefaConcluida(t: TAREFAS, usuario: Usuario) {
    const tarefa = this.getTarefa(t)
    tarefa.ativa = true
    if (!tarefa.concluida) {
      tarefa.concluida = true
      tarefa.historico.push({
        usuario,
        objetoAnterior: JSON.stringify(tarefa),
        data: new Date(),
      })
    }
    this.checkIsFinished()
  }

  getUserOfLastTask(): Usuario {
    const tarefas = this.getTarefasConcluidas()
    if (!tarefas.length) return null
    const tarefa = tarefas[tarefas.length - 1]
    return tarefa?.historico[tarefa.historico.length - 1]?.usuario
  }

  checkIsFinished() {
    const qtde_tarefas_pendentes = this.getTarefasAtivas().filter((t) => !t.concluida).length
    if (this.currentStep === STEP.ZIP_ENVIADO && qtde_tarefas_pendentes === 0) this.currentStep = STEP.TAREFAS_CONCLUIDAS
    return this.currentStep === STEP.TAREFAS_CONCLUIDAS
  }

  imprimirJson() {
    console.log(`Material ${this.material.numero}:`, this)
  }
}
