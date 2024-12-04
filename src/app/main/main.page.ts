import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, enableProdMode, inject, OnInit } from "@angular/core"
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms"
import { AlertController, IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout"
import { addIcons } from "ionicons"
import { addOutline, camera, cameraOutline, checkmarkOutline, printOutline, trashOutline } from "ionicons/icons"
import { BATERIA_STATUS, STEP, TAREFAS, TELA_STATUS } from "../models/listas"
import { AuthService } from "../services/auth.service"
import { GaleriaFotosComponent } from "../galeria-fotos/galeria-fotos.component"
import { defineCustomElements } from "@ionic/pwa-elements/loader"
import { environment } from "src/environments/environment"
import { TarefaComponent } from "../tarefa/tarefa.component"
import { Exame, Material, Usuario } from "../models"
import { v4 as uuidv4 } from "uuid"
import { EtiquetaMaterialComponent } from "../etiqueta-material/etiqueta-material.component"
import { ExameStore } from "../store/exame.store"

defineCustomElements(window)
if (environment.production) {
  enableProdMode()
}

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    GaleriaFotosComponent,
    FormsModule,
    TarefaComponent,
    EtiquetaMaterialComponent,
  ],
})
export class MainPage implements OnInit, AfterViewChecked {
  private alertController = inject(AlertController)
  isSmallScreen = false
  usuarioAtual: Usuario
  form: FormGroup = new FormGroup([])
  formSenha: FormGroup = new FormGroup([])
  step = STEP
  tarefas = TAREFAS
  telaStatus = TELA_STATUS
  bateriaStatus = BATERIA_STATUS
  selectedTab = "fluxo"
  listaExames: Exame[] = []
  materialAtual = ""
  materialAtualUF = ""
  mostrarTarefasConcluidas = false
  mostrarBateria = false
  tabAtual = "fluxo"
  exameStore = inject(ExameStore)

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioAtual = this.authService.getUsuarioAtual()
    addIcons({ camera, cameraOutline, checkmarkOutline, trashOutline, addOutline, printOutline })
  }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isSmallScreen = result.matches
    })
    this.form = this.fb.group({
      materiais: this.fb.array([], [Validators.minLength(1)]),
      qtdeSimCards: [0, Validators.min(0)],
      qtdeMemoryCards: [0, Validators.min(0)],
    })
    this.formSenha = this.fb.group({
      senhaFornecidaUsuario: ["", Validators.required],
      senha: ["", SenhaValidator],
    })
    this.addMaterialControl()
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges()
  }

  // limpa o formulário e reinicia o fluxo de material e muda para a tab fluxo
  // deve manter apenas o primeiro elemento em this.form.controls.materiais
  addExame() {
    this.form.reset()
    const materiaisArray = this.form.get("materiais") as FormArray
    while (materiaisArray.length > 1) {
      materiaisArray.removeAt(1)
    }
    materiaisArray?.setValue([{ numero: "", uf: this.usuarioAtual.uf }])
    this.selectedTab = "fluxo"
    this.materialAtual = ""
    this.materialAtualUF = this.usuarioAtual.uf
    this.mostrarBateria = false
  }

  isMaterialAtual(material: Material): boolean {
    if (!this.materialAtual) return false
    const materialAtual = this.getExameAtual().material
    return material === materialAtual
  }

  // Função para retornar uma lista com todos os materiais
  getListaMateriais(): Material[] {
    const listaMateriais: Material[] = []
    this.listaExames.forEach((exame) => {
      if (exame.material && exame.material.numero) {
        listaMateriais.push(exame.material)
      }
    })
    return listaMateriais
  }

  currentStep(): STEP {
    if (!this.materialAtual) return STEP.RECEBER_MATERIAL
    const exameAtual = this.getExameAtual()
    return exameAtual ? exameAtual.currentStep : STEP.RECEBER_MATERIAL
  }

  alternarVisualizacaoFluxo() {
    if (this.tabAtual === "fluxo") {
      this.mostrarTarefasConcluidas = !this.mostrarTarefasConcluidas
    }
    this.onChangeTab()
  }

  isFotosMaterialEtiquetadoVisible(): boolean {
    return (
      this.getExameAtual().material.fotos.embalagem.length > 0 &&
      this.getExameAtual().material.fotos.lacre.length > 0 &&
      this.getExameAtual().getTarefa(this.tarefas.FOTOGRAFAR_MATERIAL_ETIQUETADO).ativa
    )
  }

  isFotosSimCardsVisible(): boolean {
    return (
      this.getExameAtual().material.fotos.embalagem.length > 0 &&
      this.getExameAtual().material.fotos.lacre.length > 0 &&
      this.getExameAtual().getTarefa(this.tarefas.FOTOGRAFAR_SIM_CARD).ativa
    )
  }

  isFotosMemoryCardVisible(): boolean {
    return (
      this.getExameAtual().material.fotos.embalagem.length > 0 &&
      this.getExameAtual().material.fotos.lacre.length > 0 &&
      this.getExameAtual().getTarefa(this.tarefas.FOTOGRAFAR_MEMORY_CARD).ativa
    )
  }

  isFotoMaterialVisible(): boolean {
    return this.materialAtual !== "" && this.getExameAtual().material.fotos.detalhes.length > 0
  }

  onChangeTab() {
    if (!this.materialAtual) {
      this.onChangeMaterialAtual(this.getListaMateriais()[0].numero)
    }
    this.tabAtual = this.selectedTab
  }

  onChangeMaterialAtual(nrMaterial: string, uf?: string) {
    if (!uf) {
      this.materialAtualUF = this.usuarioAtual.uf
    }
    this.materialAtual = nrMaterial
    this.getExameAtual().setUsuarioAtual(this.usuarioAtual)
  }

  get listaMateriais() {
    return this.form.get("materiais") as FormArray
  }

  addMaterialControl() {
    const materialArray = this.form.get("materiais") as FormArray
    const newMaterialGroup = this.fb.group({
      numero: ["", nrMaterialValidator],
      uf: [this.usuarioAtual.uf, Validators.required],
    })
    materialArray.push(newMaterialGroup)
  }

  getExame(nrMaterial: string, uf?: string): Exame {
    if (!uf) {
      uf = this.usuarioAtual.uf
    }
    let exame = this.listaExames.find((exame) => exame.material.equal(nrMaterial, uf))
    if (!exame) {
      exame = new Exame(new Material(nrMaterial), this.usuarioAtual)
      this.listaExames.push(exame)
    }
    return exame
  }

  getExameAtual(): Exame {
    const exame = this.getExame(this.materialAtual, this.materialAtualUF)
    exame.setUsuarioAtual(this.usuarioAtual)
    return exame
  }

  async onFotosEmbalagem(fotos: string[]) {
    const exameAtual = this.getExameAtual()
    this.listaExames.forEach((exame) => {
      if (exame.embalagem === exameAtual.embalagem) {
        exame.material.fotos.embalagem = fotos
        if (exame.material.fotos.embalagem.length > 0) {
          exame.setTarefaConcluida(this.tarefas.FOTOGRAFAR_EMBALAGEM)
        }
      }
    })
  }

  async onFotosLacre(fotos: string[]) {
    const exameAtual = this.getExameAtual()
    this.listaExames.forEach((exame) => {
      if (exame.embalagem === exameAtual.embalagem) {
        exame.material.fotos.lacre = fotos
        if (exame.material.fotos.lacre.length > 0) {
          exame.setTarefaConcluida(this.tarefas.FOTOGRAFAR_NR_LACRE)
        }
      }
    })
  }

  async onFotosMaterial(fotos: string[]) {
    this.getExameAtual().material.fotos.detalhes = fotos
    if (this.getExameAtual().material.fotos.detalhes.length > 0) {
      this.getExameAtual().setTarefaConcluida(this.tarefas.DESLACRAR_MATERIAL)
      this.getExameAtual().setTarefaConcluida(this.tarefas.ETIQUETAR_MATERIAL)
      this.getExameAtual().setTarefaConcluida(this.tarefas.FOTOGRAFAR_MATERIAL_ETIQUETADO)
    }
  }

  async onFotosSimCards(fotos: string[]) {
    this.getExameAtual().material.fotos.simCards = fotos
    if (this.getExameAtual().material.fotos.simCards.length > 0) {
      this.getExameAtual().setTarefaConcluida(this.tarefas.FOTOGRAFAR_SIM_CARD)
    }
  }

  async onFotosMemoryCard(fotos: string[]) {
    this.getExameAtual().material.fotos.memoryCard = fotos
    if (this.getExameAtual().material.fotos.memoryCard.length > 0) {
      this.getExameAtual().setTarefaConcluida(this.tarefas.FOTOGRAFAR_MEMORY_CARD)
    }
  }

  getMateriaisControls(): AbstractControl[] {
    const listaMateriais = this.form.get("materiais") as FormArray
    return listaMateriais.controls
  }

  iniciarFluxoMaterial() {
    let primeiroMaterial: any
    const embalagem = uuidv4()
    this.getMateriaisControls().forEach((material) => {
      const materialNumero = material.get("numero")?.value
      const materialUf = material.get("uf")?.value
      const existeMaterial = this.listaExames.some((exame) => exame.material.equal(materialNumero, materialUf))
      const exame = this.getExame(materialNumero, materialUf)
      if (!exame.embalagem) exame.embalagem = embalagem
      this.onChangeMaterialAtual(exame.material.numero, exame.material.uf)
      if (!existeMaterial) {
        this.getExameAtual().reset()
        this.getExameAtual().setTarefaAtiva(this.tarefas.RECEBER_MATERIAL)
        if (!primeiroMaterial) primeiroMaterial = this.getExameAtual().material
      }
    })
    if (primeiroMaterial) this.onChangeMaterialAtual(primeiroMaterial.numero, primeiroMaterial.uf)
    this.getExameAtual().currentStep = this.step.RECEBER_MATERIAL
  }

  confirmaReiniciarProcesso() {
    this.alertController
      .create({
        header: "Reiniciar",
        message: "Deseja reiniciar o processamento deste material?",
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
          },
          {
            text: "Reiniciar",
            handler: () => {
              this.iniciarFluxoMaterial()
            },
          },
        ],
      })
      .then((alert) => alert.present())
  }

  // RECEBER_MATERIAL = 0,
  // VERIFICAR_MATERIAL_LACRADO = 1,
  receberMaterial() {
    if (this.form.valid) {
      this.iniciarFluxoMaterial()
      const exameAtual = this.getExameAtual()
      this.listaExames.forEach((exame) => {
        if (exame.embalagem === exameAtual.embalagem) {
          exame.setTarefaConcluida(this.tarefas.RECEBER_MATERIAL)
          exame.setTarefaAtiva(this.tarefas.CONFERIR_LACRE)
          exame.currentStep = this.step.VERIFICAR_MATERIAL_LACRADO
        }
      })
    }
  }

  materialRecebidoLacrado(value: boolean) {
    if (value) {
      this.getExameAtual().currentStep = this.step.VERIFICAR_LACRE_CONFERE
    } else {
      this.getExameAtual().currentStep = this.step.VERIFICAR_MATERIAL_DEVE_SER_LACRADO
    }
  }

  // FOTOGRAFAR_NR_LACRE = 2,
  // FOTOGRAFAR_EMBALAGEM = 3,
  // ATUALIZAR_CADASTRO_MATERIAL = 4,
  // REGISTRAR_CODIGO_EPOL = 5,
  // DESLACRAR_MATERIAL = 6,
  // ETIQUETAR_MATERIAL = 7,
  // FOTOGRAFAR_MATERIAL_ETIQUETADO = 8,
  // REGISTRAR_QTDE_SIM_CARDS = 9,
  registrarLacreConfere(value: boolean) {
    const exameAtual = this.getExameAtual()
    this.listaExames.forEach((exame) => {
      if (exame.embalagem === exameAtual.embalagem) {
        if (value) {
          exame.setTarefaConcluida(this.tarefas.CONFERIR_LACRE)
          exame.setTarefaAtiva(this.tarefas.FOTOGRAFAR_NR_LACRE)
          exame.setTarefaAtiva(this.tarefas.FOTOGRAFAR_EMBALAGEM)
          exame.setTarefaAtiva(this.tarefas.ATUALIZAR_CADASTRO_MATERIAL)
          exame.setTarefaAtiva(this.tarefas.REGISTRAR_CODIGO_EPOL)
          exame.setTarefaAtiva(this.tarefas.DESLACRAR_MATERIAL)
          exame.setTarefaAtiva(this.tarefas.ETIQUETAR_MATERIAL)
          exame.setTarefaAtiva(this.tarefas.FOTOGRAFAR_MATERIAL_ETIQUETADO)
          exame.setTarefaAtiva(this.tarefas.REGISTRAR_QTDE_SIM_CARDS)
          exame.currentStep = this.step.VERIFICAR_QTDE_SIM_CARDS
        } else {
          exame.reset()
          exame.setTarefaAtiva(this.tarefas.RECEBER_MATERIAL)
          this.iniciarFluxoMaterial()
        }
      }
    })
  }

  registrarExcecaoLacre() {
    this.getExameAtual().currentStep = this.step.VERIFICAR_QTDE_SIM_CARDS
  }

  // REGISTRAR_OPERADORA_SIM_CARD = 10,
  // FOTOGRAFAR_SIM_CARD = 11,
  // EXTRACAO_SIM_CARD = 12,
  // REGISTRAR_QTDE_MEMORY_CARDS = 13,
  registrarQtdeSimCards(value: number) {
    if (value > 0) {
      this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_OPERADORA_SIM_CARD)
      this.getExameAtual().setTarefaAtiva(this.tarefas.FOTOGRAFAR_SIM_CARD)
      this.getExameAtual().setTarefaAtiva(this.tarefas.EXTRACAO_SIM_CARD)
    }
    this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_QTDE_SIM_CARDS)
    this.getExameAtual().setTarefaConcluida(this.tarefas.DESLACRAR_MATERIAL)
    this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_QTDE_MEMORY_CARDS)
    this.getExameAtual().currentStep = this.step.VERIFICAR_QTDE_MEMORY_CARDS
  }

  // FOTOGRAFAR_MEMORY_CARD = 14,
  // EXTRACAO_MEMORY_CARD = 15,
  // REGISTRAR_ESTADO_CONSERVACAO = 16,
  // REGISTRAR_DEFEITOS_OBSERVADOS = 17,
  // REGISTRAR_APARELHO_RECEBIDO_LIGADO = 18,
  registrarQtdeMemoryCards(value: number) {
    if (value > 0) {
      this.getExameAtual().setTarefaAtiva(this.tarefas.FOTOGRAFAR_MEMORY_CARD)
      this.getExameAtual().setTarefaAtiva(this.tarefas.EXTRACAO_MEMORY_CARD)
    }
    this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_QTDE_MEMORY_CARDS)
    this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_ESTADO_CONSERVACAO)
    this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_DEFEITOS_OBSERVADOS)
    this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_APARELHO_RECEBIDO_LIGADO)
    this.getExameAtual().currentStep = this.step.VERIFICAR_APARELHO_RECEBIDO_LIGADO
  }

  // CARREGAR_BATERIA = 19,
  // LIGAR_APARELHO = 20,
  // REGISTRAR_FUNCIONAMENTO_TELA = 21,
  registrarAparelhoRecebidoLigado(value: boolean) {
    this.getExameAtual().material.recebidoLigado = value
    this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_APARELHO_RECEBIDO_LIGADO)
    this.getExameAtual().setTarefaAtiva(this.tarefas.CARREGAR_BATERIA)
    this.getExameAtual().setTarefaAtiva(this.tarefas.LIGAR_APARELHO)
    this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_FUNCIONAMENTO_TELA)
    this.getExameAtual().currentStep = this.step.VERIFICAR_FUNCIONAMENTO_TELA
    this.mostrarBateria = true
  }

  // REGISTRAR_FABRICANTE_MODELO = 22,
  // REGISTRAR_APARELHO_BLOQUEADO = 23,
  registrarFuncionamentoTela(value: boolean) {
    this.getExameAtual().material.telaFuncionando = TELA_STATUS.FUNCIONANDO
    if (value) {
      this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_APARELHO_BLOQUEADO)
      this.getExameAtual().currentStep = this.step.VERIFICAR_TELEFONE_BLOQUEADO
    } else {
      this.getExameAtual().currentStep = this.step.VERIFICAR_EXTRACAO_OK
    }
    this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_FABRICANTE_MODELO)
    this.getExameAtual().setTarefaConcluida(this.tarefas.LIGAR_APARELHO)
    this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_FUNCIONAMENTO_TELA)
  }

  // REGISTRAR_DETALHES_SENHA = 24,
  // REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO = 25,
  registrarTelefoneBloqueado(value: boolean) {
    this.getExameAtual().material.bloqueado = value
    if (value) {
      this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_DETALHES_SENHA)
      this.getExameAtual().currentStep = this.step.VERIFICAR_FORNECIMENTO_SENHA
    } else {
      this.getExameAtual().currentStep = this.step.VERIFICAR_MODO_AVIAO
    }
    this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_APARELHO_BLOQUEADO)
    this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO)
  }

  registrarSenhaFornecida(value: boolean, senha: string) {
    this.getExameAtual().material.senhaFornecida = value
    this.getExameAtual().material.senha = senha
    this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_DETALHES_SENHA)
    this.getExameAtual().currentStep = this.step.VERIFICAR_MODO_AVIAO
  }

  registrarModoAviao(value: boolean) {
    this.getExameAtual().material.modoAviao = value
    this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO)
    if (!value) {
      this.getExameAtual().setTarefaAtiva(this.tarefas.COLOCAR_APARELHO_MODO_AVIAO)
    }
    this.getExameAtual().currentStep = this.step.VERIFICAR_EXTRACAO_OK
  }

  finalizar() {
    this.printExame()
    this.getExameAtual().currentStep = this.step.TAREFAS_CONCLUIDAS
  }

  printExame() {
    this.getExameAtual().imprimirJson()
  }

  getRange(): number[] {
    // Divida por 2 para contar apenas os valores do enum
    const tarefasLength = Object.keys(this.tarefas).length / 2
    return Array.from({ length: tarefasLength }, (_, i) => i)
  }
}

// Validador personalizado para verificar se todos os campos estão preenchidos
function allFilledValidator(control: AbstractControl): ValidationErrors | null {
  // Verifica se o controle é um FormArray
  if (control instanceof FormArray) {
    // Usa o método every para verificar se todos os controles têm um valor não vazio
    const allFilled = control.controls.every((c) => c.value.trim() !== "")
    // Se todos os campos estiverem preenchidos, retorna null (sem erro)
    // Caso contrário, retorna um objeto de erro indicando que nem todos os campos estão preenchidos
    return allFilled ? null : { notAllFilled: true }
  }
  // Se o controle não for um FormArray, retorna null por padrão
  return null
}

// Validador personalizado para verificar o formato dddd/dddd
function nrMaterialValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value
  const regex = /(^(0*[1-9]\d{0,3}))(\/(20(2[0-9]|3[0-9]|4[0-9]|50)|[2-4][0-9]|50))?$/
  // Verifica se o valor do controle corresponde à expressão regular
  if (regex.test(value)) {
    // Se corresponder, retorna null (sem erro)
    return null
  } else {
    // Se não corresponder, retorna um objeto de erro
    return { invalidFormat: true }
  }
}

// Validador personalizado para verificar a senha, se senhaFornecida for "1", a senha deve ser preenchida
function SenhaValidator(control: AbstractControl): ValidationErrors | null {
  const senhaFornecida = control.parent?.get("senhaFornecidaUsuario")?.value
  const senha = control.value
  if (senhaFornecida === "1" && senha.trim() === "") {
    return { senhaRequired: true }
  }
  return null
}
