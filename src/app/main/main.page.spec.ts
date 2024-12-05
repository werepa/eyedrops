import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MainPage } from "./main.page"
import { STEP, TAREFAS } from "../models/listas"
import { Exame, Material, Usuario } from "../models"
import { AuthService } from "../services/auth.service"
import { WritableSignal } from "@angular/core"
import { ExameService, ExameState } from "../services/exame.service"

describe("MainPage", () => {
  let component: MainPage
  let fixture: ComponentFixture<MainPage>
  let exame: Exame

  const authServiceMock = {
    getUsuarioAtual: () =>
      new Usuario({
        codigo: "002",
        nome: "Usuario 2",
        uf: "GO",
        perfil: "Perito",
      }),
  }

  beforeEach(async () => {
    fixture = await TestBed.configureTestingModule({
      imports: [MainPage],
      providers: [ExameService, { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents()
    fixture = TestBed.createComponent(MainPage)
    component = fixture.componentInstance
    component.ngOnInit()
    component.onChangeUsuarioAtual(authServiceMock.getUsuarioAtual())
    exame = new Exame(new Material("1"))
  })

  function populateMaterialFields() {
    component.addMaterialControl()
    component.addMaterialControl()
    const materialControls = component.getMateriaisControls()
    materialControls[0].get("numero")?.setValue("0123/2024")
    materialControls[0].get("uf")?.setValue("GO")
    materialControls[1].get("numero")?.setValue("0124/2024")
    materialControls[1].get("uf")?.setValue("GO")
    materialControls[2].get("numero")?.setValue("0125/2024")
    materialControls[2].get("uf")?.setValue("GO")
    component.iniciarFluxoMaterial()
  }

  it("should initialize with correct values", () => {
    expect(component.state().error).toBeNull()
    expect(component.state().message).toBe("Receber material na secretaria do SETEC")
    expect(component.state().action).toBe(TAREFAS.RECEBER_MATERIAL)
    expect(component.state().status).toBe(STEP.RECEBER_MATERIAL)
    expect(component.state().listaExames).toEqual([])
    expect(component.state().usuarioAtual).toEqual(authServiceMock.getUsuarioAtual())
    expect(component.state().exameAtual).toBeNull()
  })

  it("should create exame when calling getExame if not exists", () => {
    const material = new Material("0123/2024")
    expect(component.state().listaExames.length).toBe(0)
    const exame = component.getExame(material)
    expect(exame).toBeDefined()
    expect(exame.material).toEqual(material)
    expect(component.state().listaExames.length).toBe(1)
    expect(component.state().exameAtual.material).toEqual(material)
    component.getExame(material)
    expect(component.state().listaExames.length).toBe(1)
    expect(component.state().exameAtual.material).toEqual(material)
  })

  it("should return the correct exame when calling getExame", () => {
    const material1 = new Material("0123/2024")
    const material2 = new Material("456/24")
    component.getExame(material1)
    component.getExame(material2)
    expect(component.state().exameAtual.material).toEqual(material1)
    const exame = component.getExame(material1)
    expect(exame).toBeDefined()
    expect(exame.material).toEqual(material1)
  })

  it("should add a new material form control when calling addNrMaterial", () => {
    let nrMateriais = component.getMateriaisControls()
    expect(nrMateriais.length).toBe(1)
    component.addMaterialControl()
    expect(component.getMateriaisControls().length).toBe(2)
  })

  it("should return the current exame when calling getExameAtual", () => {
    const material1 = new Material("0123/2024")
    const material2 = new Material("456/24")
    component.getExame(material1)
    component.getExame(material2)
    component.onChangeMaterialAtual(material1)
    expect(component.state().exameAtual).toBeDefined()
    expect(component.state().exameAtual.material).toEqual(material1)
  })

  const populateExameInicial = () => {
    expect(component.state().listaExames.length).toBe(0)
    const listaExames = component.state().listaExames
    listaExames.push(exame)
    component.state.update((s) => ({ ...s, listaExames }))
    expect(component.state().listaExames.length).toBe(1)
    populateMaterialFields()
    const material = new Material("0123/2024")
    component.getExame(material)
    component.onChangeMaterialAtual(material)
  }

  const fotos = ["foto1.jpg", "foto2.jpg"]

  it("should update exame fotosEmbalagem when calling onFotosEmbalagem", async () => {
    populateExameInicial()
    await component.onFotosEmbalagem(fotos)
    component.state().listaExames.forEach((exame) => {
      if (exame.embalagem === component.state().exameAtual.embalagem) {
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).concluida).toBe(true)
        expect(exame.material.fotos.embalagem).toEqual(fotos)
      } else {
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).concluida).toBe(false)
        expect(exame.material.fotos.embalagem).not.toEqual(fotos)
      }
    })
  })

  it("should update exame fotosLacre when calling onFotosLacre", async () => {
    populateExameInicial()
    await component.onFotosLacre(fotos)
    component.state().listaExames.forEach((exame) => {
      if (exame.embalagem === component.state().exameAtual.embalagem) {
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).concluida).toBe(true)
        expect(exame.material.fotos.lacre).toEqual(fotos)
      } else {
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).concluida).toBe(false)
        expect(exame.material.fotos.lacre).not.toEqual(fotos)
      }
    })
  })

  it("should update exame fotosMaterial when calling onFotosMaterial", async () => {
    populateExameInicial()
    await component.onFotosMaterial(fotos)
    expect(component.state().exameAtual.material.fotos.detalhes).toEqual(fotos)
  })

  it("should update exame fotosSimCards when calling onFotosSimCards", async () => {
    populateExameInicial()
    await component.onFotosSimCards(fotos)
    expect(component.state().exameAtual.material.fotos.simCards).toEqual(fotos)
  })

  it("should update exame fotosMemoryCard when calling onFotosMemoryCard", async () => {
    populateExameInicial()
    await component.onFotosMemoryCard(fotos)
    expect(component.state().exameAtual.material.fotos.memoryCard).toEqual(fotos)
  })

  it("should return an array of AbstractControl when calling getNrMateriaisControls", () => {
    const nrMateriaisControls = component.getMateriaisControls()
    expect(nrMateriaisControls).toBeDefined()
    expect(nrMateriaisControls.length).toBe(1)
  })

  it("should initialize the material flow", () => {
    populateExameInicial()
    expect(component.currentStep()).toBe(STEP.RECEBER_MATERIAL)
    expect(component.state().listaExames.length).toBe(4)
    expect(component.state().exameAtual.material.numero).toBe("0123/2024")
    component.state().listaExames.forEach((exame) => {
      if (exame.embalagem === component.state().exameAtual.embalagem) {
        expect(exame.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(false)
        expect(exame.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(false)
        expect(exame.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(false)
      }
    })
    expect(component.state().listaExames[0].embalagem).toBe("")
    expect(component.state().listaExames[1].embalagem.length).toBeGreaterThan(0)
    expect(component.state().listaExames[1].embalagem).toBe(component.state().listaExames[2].embalagem)
    expect(component.state().listaExames[2].embalagem).toBe(component.state().listaExames[3].embalagem)
    expect(component.state().listaExames[0].getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(false)
    expect(component.state().listaExames[0].getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(false)
    expect(component.state().listaExames[0].getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(false)
    expect(component.state().listaExames[0].getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(false)
  })

  it("should update currentStep after RECEBER_MATERIAL", () => {
    populateMaterialFields()
    expect(component.currentStep()).toBe(STEP.RECEBER_MATERIAL)
    component.receberMaterial()
    expect(component.currentStep()).toBe(STEP.VERIFICAR_MATERIAL_LACRADO)
  })

  it("should update currentStep after VERIFICAR_MATERIAL_LACRADO", () => {
    populateMaterialFields()
    component.receberMaterial()
    expect(component.currentStep()).toBe(STEP.VERIFICAR_MATERIAL_LACRADO)
    component.materialRecebidoLacrado(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_LACRE_CONFERE)
    component.materialRecebidoLacrado(false)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_MATERIAL_DEVE_SER_LACRADO)
  })

  it("should update currentStep after VERIFICAR_MATERIAL_DEVE_SER_LACRADO", () => {
    populateMaterialFields()
    component.materialRecebidoLacrado(false)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_MATERIAL_DEVE_SER_LACRADO)
    component.registrarExcecaoLacre()
    expect(component.currentStep()).toBe(STEP.VERIFICAR_QTDE_SIM_CARDS)
  })

  it("should update currentStep after VERIFICAR_LACRE_CONFERE", () => {
    populateMaterialFields()
    component.materialRecebidoLacrado(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_LACRE_CONFERE)
    component.registrarLacreConfere(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_QTDE_SIM_CARDS)
    component.registrarLacreConfere(false)
    expect(component.currentStep()).toBe(STEP.RECEBER_MATERIAL)
  })

  it("should update currentStep after VERIFICAR_QTDE_SIM_CARDS", () => {
    populateMaterialFields()
    component.registrarLacreConfere(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_QTDE_SIM_CARDS)
    component.registrarQtdeSimCards(1)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_QTDE_MEMORY_CARDS)
  })

  it("should update currentStep after VERIFICAR_QTDE_MEMORY_CARDS", () => {
    populateMaterialFields()
    component.registrarQtdeSimCards(1)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_QTDE_MEMORY_CARDS)
    component.registrarQtdeMemoryCards(0)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_APARELHO_RECEBIDO_LIGADO)
  })

  it("should update currentStep after VERIFICAR_APARELHO_RECEBIDO_LIGADO", () => {
    populateMaterialFields()
    component.registrarQtdeMemoryCards(0)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_APARELHO_RECEBIDO_LIGADO)
    component.registrarAparelhoRecebidoLigado(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_FUNCIONAMENTO_TELA)
  })

  it("should update currentStep after VERIFICAR_FUNCIONAMENTO_TELA", () => {
    populateMaterialFields()
    component.registrarAparelhoRecebidoLigado(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_FUNCIONAMENTO_TELA)
    component.registrarFuncionamentoTela(false)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_EXTRACAO_OK)
    component.registrarFuncionamentoTela(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_TELEFONE_BLOQUEADO)
  })

  it("should update currentStep after VERIFICAR_TELEFONE_BLOQUEADO", () => {
    populateMaterialFields()
    component.registrarFuncionamentoTela(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_TELEFONE_BLOQUEADO)
    component.registrarTelefoneBloqueado(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_FORNECIMENTO_SENHA)
    component.registrarTelefoneBloqueado(false)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_MODO_AVIAO)
  })

  it("should update currentStep after VERIFICAR_FORNECIMENTO_SENHA", () => {
    populateMaterialFields()
    component.registrarTelefoneBloqueado(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_FORNECIMENTO_SENHA)
    component.registrarSenhaFornecida(true, "senha")
    expect(component.currentStep()).toBe(STEP.VERIFICAR_MODO_AVIAO)
    component.registrarSenhaFornecida(false, "")
    expect(component.currentStep()).toBe(STEP.VERIFICAR_MODO_AVIAO)
  })

  it("should update currentStep after VERIFICAR_MODO_AVIAO", () => {
    populateMaterialFields()
    component.registrarSenhaFornecida(true, "senha")
    expect(component.currentStep()).toBe(STEP.VERIFICAR_MODO_AVIAO)
    component.registrarModoAviao(true)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_EXTRACAO_OK)
    component.registrarModoAviao(false)
    expect(component.currentStep()).toBe(STEP.VERIFICAR_EXTRACAO_OK)
  })

  // RECEBER_MATERIAL = 0,
  // CONFERIR_LACRE = 1
  it("should update tarefas after RECEBER_MATERIAL", () => {
    populateExameInicial()
    component.receberMaterial()
    expect(component.state().exameAtual.material.numero).toBe("0125/2024")
    component.state().listaExames.forEach((exame) => {
      if (exame.embalagem === component.state().exameAtual.embalagem) {
        expect(exame.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(true)
        expect(exame.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(false)
      }
    })
    expect(component.state().listaExames[0].embalagem).toBe("")
    expect(component.state().listaExames[1].embalagem.length).toBe(36)
    expect(component.state().listaExames[1].embalagem).toBe(component.state().listaExames[2].embalagem)
    expect(component.state().listaExames[2].embalagem).toBe(component.state().listaExames[3].embalagem)
    expect(component.state().listaExames[0].getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(false)
    expect(component.state().listaExames[0].getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(false)
    expect(component.state().listaExames[0].getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(false)
    expect(component.state().listaExames[0].getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(false)
  })

  // FOTOGRAFAR_NR_LACRE = 2,
  // FOTOGRAFAR_EMBALAGEM = 3,
  // ATUALIZAR_CADASTRO_MATERIAL = 4,
  // REGISTRAR_CODIGO_EPOL = 5,
  // DESLACRAR_MATERIAL = 6,
  // ETIQUETAR_MATERIAL = 7,
  // FOTOGRAFAR_MATERIAL_ETIQUETADO = 8,
  // REGISTRAR_QTDE_SIM_CARDS = 9,
  it("should update tarefas after VERIFICAR_LACRE_CONFERE", () => {
    populateExameInicial()
    component.receberMaterial()
    component.registrarLacreConfere(true)
    component.state().listaExames.forEach((exame) => {
      if (exame.embalagem === component.state().exameAtual.embalagem) {
        expect(exame.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(true)
        expect(exame.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(true)
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).concluida).toBe(false)
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).concluida).toBe(false)
        expect(exame.getTarefa(TAREFAS.ATUALIZAR_CADASTRO_MATERIAL).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.ATUALIZAR_CADASTRO_MATERIAL).concluida).toBe(false)
        expect(exame.getTarefa(TAREFAS.REGISTRAR_CODIGO_EPOL).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.REGISTRAR_CODIGO_EPOL).concluida).toBe(false)
        expect(exame.getTarefa(TAREFAS.DESLACRAR_MATERIAL).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.DESLACRAR_MATERIAL).concluida).toBe(false)
        expect(exame.getTarefa(TAREFAS.ETIQUETAR_MATERIAL).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.ETIQUETAR_MATERIAL).concluida).toBe(false)
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_MATERIAL_ETIQUETADO).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.FOTOGRAFAR_MATERIAL_ETIQUETADO).concluida).toBe(false)
        expect(exame.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).ativa).toBe(true)
        expect(exame.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).concluida).toBe(false)
      }
    })
    expect(component.state().listaExames[0].getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(false)
  })

  // REGISTRAR_OPERADORA_SIM_CARD = 10,
  // FOTOGRAFAR_SIM_CARD = 11,
  // EXTRACAO_SIM_CARD = 12,
  // REGISTRAR_QTDE_MEMORY_CARDS = 13,
  it("should update tarefas after REGISTRAR_QTDE_SIM_CARDS", () => {
    populateExameInicial()
    component.receberMaterial()
    component.registrarLacreConfere(true)
    component.registrarQtdeSimCards(0)
    const exameAtual = component.state().exameAtual
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ATUALIZAR_CADASTRO_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_CODIGO_EPOL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ETIQUETAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MATERIAL_ETIQUETADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).concluida).toBe(false)
    component.registrarQtdeSimCards(2)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).concluida).toBe(false)
  })

  // FOTOGRAFAR_MEMORY_CARD = 14,
  // EXTRACAO_MEMORY_CARD = 15,
  // REGISTRAR_ESTADO_CONSERVACAO = 16,
  // REGISTRAR_DEFEITOS_OBSERVADOS = 17,
  // REGISTRAR_APARELHO_RECEBIDO_LIGADO = 18,
  it("should update tarefas after REGISTRAR_QTDE_MEMORY_CARDS", () => {
    populateExameInicial()
    component.receberMaterial()
    component.registrarLacreConfere(true)
    component.registrarQtdeSimCards(2)
    component.registrarQtdeMemoryCards(0)
    const exameAtual = component.state().exameAtual
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ATUALIZAR_CADASTRO_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_CODIGO_EPOL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ETIQUETAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).concluida).toBe(false)
    component.registrarQtdeMemoryCards(1)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).concluida).toBe(false)
  })

  // CARREGAR_BATERIA = 19,
  // CARREGAR_BATERIA = 19,
  // LIGAR_APARELHO = 20,
  // REGISTRAR_FUNCIONAMENTO_TELA = 21,
  it("should update tarefas after REGISTRAR_APARELHO_RECEBIDO_LIGADO", () => {
    populateExameInicial()
    component.receberMaterial()
    component.registrarLacreConfere(true)
    component.registrarQtdeSimCards(2)
    component.registrarQtdeMemoryCards(0)
    component.registrarAparelhoRecebidoLigado(true)
    const exameAtual = component.state().exameAtual
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ATUALIZAR_CADASTRO_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_CODIGO_EPOL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ETIQUETAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CARREGAR_BATERIA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CARREGAR_BATERIA).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA).concluida).toBe(false)
  })

  // REGISTRAR_FABRICANTE_MODELO = 22,
  // REGISTRAR_APARELHO_BLOQUEADO = 23,
  it("should update tarefas after REGISTRAR_FUNCIONAMENTO_TELA", () => {
    populateExameInicial()
    component.receberMaterial()
    component.registrarLacreConfere(true)
    component.registrarQtdeSimCards(2)
    component.registrarQtdeMemoryCards(0)
    component.registrarAparelhoRecebidoLigado(true)
    component.registrarFuncionamentoTela(false)
    const exameAtual = component.state().exameAtual
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ATUALIZAR_CADASTRO_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_CODIGO_EPOL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ETIQUETAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CARREGAR_BATERIA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CARREGAR_BATERIA).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FABRICANTE_MODELO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FABRICANTE_MODELO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_BLOQUEADO).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_BLOQUEADO).concluida).toBe(false)
    component.registrarFuncionamentoTela(true)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FABRICANTE_MODELO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FABRICANTE_MODELO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_BLOQUEADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_BLOQUEADO).concluida).toBe(false)
  })

  // REGISTRAR_DETALHES_SENHA = 24,
  // REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO = 25,
  it("should update tarefas after REGISTRAR_APARELHO_BLOQUEADO", () => {
    populateExameInicial()
    component.receberMaterial()
    component.registrarLacreConfere(true)
    component.registrarQtdeSimCards(2)
    component.registrarQtdeMemoryCards(0)
    component.registrarAparelhoRecebidoLigado(true)
    component.registrarFuncionamentoTela(true)
    component.registrarTelefoneBloqueado(true)
    const exameAtual = component.state().exameAtual
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ATUALIZAR_CADASTRO_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_CODIGO_EPOL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ETIQUETAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CARREGAR_BATERIA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CARREGAR_BATERIA).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FABRICANTE_MODELO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FABRICANTE_MODELO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_BLOQUEADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_BLOQUEADO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DETALHES_SENHA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DETALHES_SENHA).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).concluida).toBe(false)
    component.registrarSenhaFornecida(true, "senha")
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DETALHES_SENHA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DETALHES_SENHA).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).concluida).toBe(false)
    component.registrarSenhaFornecida(false, "")
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DETALHES_SENHA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DETALHES_SENHA).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).concluida).toBe(false)
  })

  // REGISTRAR_MODO_AVIAO = 26,
  it("should update tarefas after REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO", () => {
    populateExameInicial()
    component.receberMaterial()
    component.registrarLacreConfere(true)
    component.registrarQtdeSimCards(2)
    component.registrarQtdeMemoryCards(0)
    component.registrarAparelhoRecebidoLigado(true)
    component.registrarFuncionamentoTela(true)
    component.registrarTelefoneBloqueado(true)
    component.registrarSenhaFornecida(false, "")
    const exameAtual = component.state().exameAtual
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.RECEBER_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CONFERIR_LACRE).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_NR_LACRE).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_EMBALAGEM).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ATUALIZAR_CADASTRO_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_CODIGO_EPOL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.DESLACRAR_MATERIAL).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.ETIQUETAR_MATERIAL).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_SIM_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_OPERADORA_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_SIM_CARD).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_QTDE_MEMORY_CARDS).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.FOTOGRAFAR_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).ativa).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.EXTRACAO_MEMORY_CARD).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_ESTADO_CONSERVACAO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DEFEITOS_OBSERVADOS).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_LIGADO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CARREGAR_BATERIA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.CARREGAR_BATERIA).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.LIGAR_APARELHO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FUNCIONAMENTO_TELA).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FABRICANTE_MODELO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_FABRICANTE_MODELO).concluida).toBe(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_BLOQUEADO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_BLOQUEADO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DETALHES_SENHA).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_DETALHES_SENHA).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).ativa).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).concluida).toBe(false)
    component.registrarModoAviao(true)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.COLOCAR_APARELHO_MODO_AVIAO).ativa).toBe(false)
    component.registrarModoAviao(false)
    expect(exameAtual.getTarefa(TAREFAS.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO).concluida).toBe(true)
    expect(exameAtual.getTarefa(TAREFAS.COLOCAR_APARELHO_MODO_AVIAO).ativa).toBe(true)
  })
})
