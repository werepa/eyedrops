import { AfterViewChecked, Component, enableProdMode, inject, OnInit } from "@angular/core"
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
import { STEP, TAREFAS, TELA_STATUS } from "../models/listas"
import { AuthService } from "../services/auth.service"
import { GaleriaFotosComponent } from "../galeria-fotos/galeria-fotos.component"
import { defineCustomElements } from "@ionic/pwa-elements/loader"
import { environment } from "src/environments/environment"
import { TarefaComponent } from "../tarefa/tarefa.component"
import { Exame, Material, Usuario } from "../models"

defineCustomElements(window)
if (environment.production) {
  enableProdMode()
}

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, GaleriaFotosComponent, FormsModule, TarefaComponent],
})
export class MainPage implements OnInit {
  private alertController = inject(AlertController)
  isSmallScreen = false
  usuarioAtual: Usuario
  form: FormGroup = new FormGroup([])
  formSenha: FormGroup = new FormGroup([])
  step = STEP
  tarefas = TAREFAS
  telaStatus = TELA_STATUS
  selectedTab = "fluxo"
  listaExames: Exame[] = []
  materialAtual = ""
  materialAtualUF = ""
  mostrarTarefasConcluidas = false
  tabAtual = "fluxo"

  constructor(private authService: AuthService, private fb: FormBuilder, private breakpointObserver: BreakpointObserver) {
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

  onChangeTab() {
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
    let exame = this.listaExames.find((exame) => exame.material.numero === nrMaterial && exame.material.uf === uf)
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
    this.getExameAtual().material.fotos.embalagem = fotos
    if (this.getExameAtual().material.fotos.embalagem.length > 0) {
      this.getExameAtual().setTarefaConcluida(this.tarefas.FOTOGRAFAR_EMBALAGEM)
    }
  }

  async onFotosLacre(fotos: string[]) {
    this.getExameAtual().material.fotos.lacre = fotos
    if (this.getExameAtual().material.fotos.lacre.length > 0) {
      this.getExameAtual().setTarefaConcluida(this.tarefas.FOTOGRAFAR_NR_LACRE)
    }
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
    this.getMateriaisControls().forEach((material) => {
      const materialNumero = material.get("numero")?.value
      const materialUf = material.get("uf")?.value
      const exame = this.getExame(materialNumero, materialUf)
      this.onChangeMaterialAtual(exame.material.numero, exame.material.uf)
      this.getExameAtual().reset()
      this.getExameAtual().setTarefaAtiva(this.tarefas.RECEBER_MATERIAL)
    })
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

  receberMaterial() {
    if (this.form.valid) {
      this.iniciarFluxoMaterial()
      this.getExameAtual().setTarefaConcluida(this.tarefas.RECEBER_MATERIAL)
      this.getExameAtual().setTarefaAtiva(this.tarefas.CONFERIR_LACRE)
      this.getExameAtual().currentStep = this.step.VERIFICAR_MATERIAL_LACRADO
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
    if (value) {
      this.getExameAtual().setTarefaConcluida(this.tarefas.CONFERIR_LACRE)
      this.getExameAtual().setTarefaAtiva(this.tarefas.FOTOGRAFAR_NR_LACRE)
      this.getExameAtual().setTarefaAtiva(this.tarefas.FOTOGRAFAR_EMBALAGEM)
      this.getExameAtual().setTarefaAtiva(this.tarefas.ATUALIZAR_CADASTRO_MATERIAL)
      this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_CODIGO_EPOL)
      this.getExameAtual().setTarefaAtiva(this.tarefas.DESLACRAR_MATERIAL)
      this.getExameAtual().setTarefaAtiva(this.tarefas.ETIQUETAR_MATERIAL)
      this.getExameAtual().setTarefaAtiva(this.tarefas.FOTOGRAFAR_MATERIAL_ETIQUETADO)
      this.getExameAtual().setTarefaAtiva(this.tarefas.REGISTRAR_QTDE_SIM_CARDS)
      this.getExameAtual().currentStep = this.step.VERIFICAR_QTDE_SIM_CARDS
    } else {
      this.getExameAtual().reset()
      this.getExameAtual().setTarefaAtiva(this.tarefas.RECEBER_MATERIAL)
      this.iniciarFluxoMaterial()
    }
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
    this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_FUNCIONAMENTO_TELA)
  }

  // REGISTRAR_DETALHES_SENHA = 24,
  // REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO = 25,
  registrarTelefoneBloqueado(value: boolean) {
    this.getExameAtual().material.bloqueado = value
    if (value) {
      this.getExameAtual().setTarefaConcluida(this.tarefas.REGISTRAR_DETALHES_SENHA)
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
