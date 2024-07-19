import { Material, Usuario } from "."
import { STEP, Tarefa, TAREFAS } from "./listas"

export class Exame {
  private _tarefas: Tarefa[] = []
  private _currentStep: STEP = STEP.RECEBER_MATERIAL

  constructor(private _material: Material, private _usuarioAtual: Usuario) {
    this.reset()
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
        codigo: TAREFAS.REGISTRAR_PERCENTUAL_BATERIA,
        descricao: "Registrar percentual de bateria",
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
        codigo: TAREFAS.REALIZAR_PROCEDIMENTOS_DESENVOLVEDOR,
        descricao: "Realizar procedimentos de desenvolvedor",
      },
      {
        codigo: TAREFAS.REGISTRAR_NR_MAQUINA_LAPED,
        descricao: "Registrar número da máquina LAPED",
      },
      {
        codigo: TAREFAS.REALIZAR_EXTRACAO_INSEYETS,
        descricao: "Realizar extração INSEYETS",
      },
      {
        codigo: TAREFAS.REGISTRAR_EXTRACAO_INSEYETS_OK,
        descricao: "Registrar extração INSEYETS bem-sucedida",
      },
      {
        codigo: TAREFAS.REGISTRAR_EXTRACAO_CHATS,
        descricao: "Registrar extração de chats",
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
        codigo: TAREFAS.EXECUTAR_IPED,
        descricao: "Executar IPED",
      },
      {
        codigo: TAREFAS.REGISTRAR_IPED_OK,
        descricao: "Registrar se o IPED foi bem-sucedido",
      },
      {
        codigo: TAREFAS.REGISTRAR_ZIP_OK,
        descricao: "Registrar se o ZIP foi bem-sucedido",
      },
      {
        codigo: TAREFAS.MOVER_ZIP_DIRETORIO_ENTREGA,
        descricao: "Mover ZIP para diretório de entrega",
      },
      {
        codigo: TAREFAS.FINALIZAR_EXAME,
        descricao: "Finalizar exame",
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

  get material(): Material {
    return this._material
  }

  get tarefas(): Tarefa[] {
    return this._tarefas
  }

  get currentStep(): STEP {
    return this._currentStep
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

  getUsuarioAtual(): Usuario {
    return this._usuarioAtual
  }

  setUsuarioAtual(usuario: Usuario) {
    this._usuarioAtual = usuario
  }

  setTarefaAtiva(t: TAREFAS) {
    const tarefa = this.getTarefa(t)
    tarefa.ativa = true
  }

  setTarefaInativa(t: TAREFAS) {
    const tarefa = this.getTarefa(t)
    tarefa.ativa = false
  }

  setTarefaConcluida(t: TAREFAS) {
    const tarefa = this.getTarefa(t)
    tarefa.ativa = true
    tarefa.concluida = true
    tarefa.historico.push({
      usuario: this._usuarioAtual,
      objetoAnterior: JSON.stringify(tarefa),
      data: new Date(),
    })
  }

  imprimirJson() {
    console.log(this)
  }
}
