import { Usuario } from "./Usuario"

export enum STEP {
  RECEBER_MATERIAL = 0,
  VERIFICAR_MATERIAL_LACRADO = 1,
  VERIFICAR_MATERIAL_DEVE_SER_LACRADO = 2,
  VERIFICAR_LACRE_CONFERE = 3,
  VERIFICAR_QTDE_SIM_CARDS = 4,
  VERIFICAR_QTDE_MEMORY_CARDS = 5,
  VERIFICAR_APARELHO_RECEBIDO_LIGADO = 6,
  VERIFICAR_FUNCIONAMENTO_TELA = 7,
  VERIFICAR_TELEFONE_BLOQUEADO = 8,
  VERIFICAR_FORNECIMENTO_SENHA = 9,
  VERIFICAR_MODO_AVIAO = 10,
  PREPARAR_EXTRACAO_DADOS = 11,
  EXTRAINDO_DADOS_APARELHO = 12,
  VERIFICAR_PHYSICAL_ANALYSER = 13,
  PROCESSANDO_IPED = 14,
  IPED_VERIFICADO = 15,
  GERANDO_ZIP = 16,
  ZIP_VERIFICADO = 17,
  MOVENDO_ZIP = 18,
  ZIP_ENVIADO = 19,
  TAREFAS_CONCLUIDAS = 20,
}

export enum TAREFAS {
  RECEBER_MATERIAL = 0,
  CONFERIR_LACRE = 1,
  FOTOGRAFAR_NR_LACRE = 2,
  FOTOGRAFAR_EMBALAGEM = 3,
  ATUALIZAR_CADASTRO_MATERIAL = 4,
  REGISTRAR_CODIGO_EPOL = 5,
  DESLACRAR_MATERIAL = 6,
  ETIQUETAR_MATERIAL = 7,
  FOTOGRAFAR_MATERIAL_ETIQUETADO = 8,
  REGISTRAR_QTDE_SIM_CARDS = 9,
  REGISTRAR_OPERADORA_SIM_CARD = 10,
  FOTOGRAFAR_SIM_CARD = 11,
  EXTRACAO_SIM_CARD = 12,
  REGISTRAR_QTDE_MEMORY_CARDS = 13,
  FOTOGRAFAR_MEMORY_CARD = 14,
  EXTRACAO_MEMORY_CARD = 15,
  REGISTRAR_ESTADO_CONSERVACAO = 16,
  REGISTRAR_DEFEITOS_OBSERVADOS = 17,
  REGISTRAR_APARELHO_RECEBIDO_LIGADO = 18,
  CARREGAR_BATERIA = 19,
  LIGAR_APARELHO = 20,
  REGISTRAR_FUNCIONAMENTO_TELA = 21,
  REGISTRAR_FABRICANTE_MODELO = 22,
  REGISTRAR_APARELHO_BLOQUEADO = 23,
  REGISTRAR_DETALHES_SENHA = 24,
  REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO = 25,
  COLOCAR_APARELHO_MODO_AVIAO = 26,
  REGISTRAR_VERSAO_SISTEMA_OPERACIONAL = 27,
  REALIZAR_PROCEDIMENTOS_EXTRACAO = 28,
  INICIAR_EXTRACAO_INSEYETS = 30,
  INICIAR_PHYSICAL_ANALYZER = 31,
  REGISTRAR_EXTRACAO_CHATS = 32,
  REGISTRAR_NR_TELEFONE_OPERADORA = 33,
  REGISTRAR_DADOS_USUARIO = 34,
  INICIAR_IPED = 35,
  REGISTRAR_IPED_OK = 36,
  INICIAR_ZIP = 37,
  REGISTRAR_ZIP_OK = 38,
  MOVER_ZIP_DIRETORIO_ENTREGA = 39,
}

export enum TELA_STATUS {
  NAO_VERIFICADA = 0,
  FUNCIONANDO = 1,
  IMAGEM_PARCIAL = 2,
  MAL_CONTATO = 3,
  SEM_TOUCH = 4,
  SEM_IMAGEM = 5,
}

export enum BATERIA_STATUS {
  NAO_VERIFICADA = 0,
  CARREGANDO = 1,
  CARGA_COMPLETA = 2,
  DEFEITO = 3,
}

export type Log = {
  usuario: Usuario
  objetoAnterior: string
  data: Date
}

export type Tarefa = {
  codigo: TAREFAS
  descricao: string
  historico: Log[]
  ativa: boolean
  concluida: boolean
}

export enum EXAME_STATUS {
  DISPONIVEL = 0,
  BLOQUEADO = 1,
  CONCLUIDO = 2,
}
