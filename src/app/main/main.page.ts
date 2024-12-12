import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  enableProdMode,
  inject,
  OnInit,
  WritableSignal,
} from "@angular/core"
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
import { ExameService, ExameState } from "../services/exame.service"

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
export class MainPage implements OnInit {
  private alertController = inject(AlertController)
  isSmallScreen = false
  isModalPessoasOpen = false
  form: FormGroup = new FormGroup([])
  step = STEP
  tarefas = TAREFAS
  telaStatus = TELA_STATUS
  bateriaStatus = BATERIA_STATUS
  selectedTab = "fluxo"
  mostrarTarefasConcluidas = false
  mostrarBateria = false
  tabAtual = "fluxo"
  state: WritableSignal<ExameState>
  listaPessoas: Usuario[] = this.exameService.getListaPessoas()

  constructor(private exameService: ExameService, private fb: FormBuilder, private breakpointObserver: BreakpointObserver) {
    this.state = this.exameService.state
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
    this.addMaterialControl()
  }

  // limpa o formulário e reinicia o fluxo de material e muda para a tab fluxo
  // deve manter apenas o primeiro elemento em this.form.controls.materiais
  addExame() {
    this.form.reset()
    const materiaisArray = this.form.get("materiais") as FormArray
    while (materiaisArray.length > 1) {
      materiaisArray.removeAt(1)
    }
    materiaisArray?.setValue([{ numero: "", uf: this.state().usuarioAtual.uf }])
    this.selectedTab = "fluxo"
    this.state.update((s) => ({ ...s, exameAtual: null }))
    this.mostrarBateria = false
  }

  isExameAtual(material: Material): boolean {
    if (!this.state().exameAtual) return false
    const materialAtual = this.state().exameAtual.material
    return material === materialAtual
  }

  // Função para retornar uma lista com todos os materiais
  getListaMateriais(): Material[] {
    const listaMateriais: Material[] = []
    this.state().listaExames.forEach((exame) => {
      if (exame.material && exame.material.numero) {
        listaMateriais.push(exame.material)
      }
    })
    return listaMateriais
  }

  currentStep(): STEP {
    if (!this.state().exameAtual) return STEP.RECEBER_MATERIAL
    const exameAtual = this.state().exameAtual
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
      this.state().exameAtual.material.fotos.embalagem.length > 0 &&
      this.state().exameAtual.material.fotos.lacre.length > 0 &&
      this.state().exameAtual.getTarefa(this.tarefas.FOTOGRAFAR_MATERIAL_ETIQUETADO).ativa
    )
  }

  isFotosSimCardsVisible(): boolean {
    return (
      this.state().exameAtual.material.fotos.embalagem.length > 0 &&
      this.state().exameAtual.material.fotos.lacre.length > 0 &&
      this.state().exameAtual.getTarefa(this.tarefas.FOTOGRAFAR_SIM_CARD).ativa
    )
  }

  isFotosMemoryCardVisible(): boolean {
    return (
      this.state().exameAtual.material.fotos.embalagem.length > 0 &&
      this.state().exameAtual.material.fotos.lacre.length > 0 &&
      this.state().exameAtual.getTarefa(this.tarefas.FOTOGRAFAR_MEMORY_CARD).ativa
    )
  }

  isFotoMaterialVisible(): boolean {
    return this.state().exameAtual !== null && this.state().exameAtual.material.fotos.detalhes.length > 0
  }

  onChangeTab() {
    if (!this.state().exameAtual) {
      this.onChangeMaterialAtual(this.getListaMateriais()[0])
    }
    this.tabAtual = this.selectedTab
  }

  onChangeUsuarioAtual(usuario: Usuario) {
    this.state.update((s) => ({ ...s, usuarioAtual: usuario }))
  }

  onChangeExameAtual(exame: Exame) {
    this.state.update((s) => ({ ...s, exameAtual: exame }))
  }

  onChangeMaterialAtual(material: Material) {
    const exame = this.getExame(material)
    this.state.update((s) => ({ ...s, exameAtual: exame }))
  }

  get listaMateriais() {
    return this.form.get("materiais") as FormArray
  }

  addMaterialControl() {
    if (!this.state().usuarioAtual) return
    const materialArray = this.form.get("materiais") as FormArray
    const newMaterialGroup = this.fb.group({
      numero: ["", nrMaterialValidator],
      uf: [this.state().usuarioAtual.uf, Validators.required],
    })
    materialArray.push(newMaterialGroup)
  }

  getExame(material: Material): Exame {
    const listaExames = this.state().listaExames
    let exame = listaExames.find((exame) => exame.material.equal(material))
    if (!exame) {
      exame = new Exame(material)
      listaExames.push(exame)
    }
    if (!this.state().exameAtual) this.state.update((s) => ({ ...s, exameAtual: exame }))
    return exame
  }

  async onFotosEmbalagem(fotos: string[]) {
    const exameAtual = this.state().exameAtual
    this.state().listaExames.forEach((exame) => {
      if (exame.embalagem === exameAtual.embalagem) {
        exame.material.fotos.embalagem = fotos
        if (exame.material.fotos.embalagem.length > 0) {
          exame.setTarefaConcluida(this.tarefas.FOTOGRAFAR_EMBALAGEM, this.state().usuarioAtual)
        }
      }
    })
  }

  async onFotosLacre(fotos: string[]) {
    const exameAtual = this.state().exameAtual
    this.state().listaExames.forEach((exame) => {
      if (exame.embalagem === exameAtual.embalagem) {
        exame.material.fotos.lacre = fotos
        if (exame.material.fotos.lacre.length > 0) {
          exame.setTarefaConcluida(this.tarefas.FOTOGRAFAR_NR_LACRE, this.state().usuarioAtual)
        }
      }
    })
  }

  async onFotosMaterial(fotos: string[]) {
    this.state().exameAtual.material.fotos.detalhes = fotos
    if (this.state().exameAtual.material.fotos.detalhes.length > 0) {
      this.state().exameAtual.setTarefaConcluida(this.tarefas.DESLACRAR_MATERIAL, this.state().usuarioAtual)
      this.state().exameAtual.setTarefaConcluida(this.tarefas.ETIQUETAR_MATERIAL, this.state().usuarioAtual)
      this.state().exameAtual.setTarefaConcluida(this.tarefas.FOTOGRAFAR_MATERIAL_ETIQUETADO, this.state().usuarioAtual)
    }
  }

  async onFotosSimCards(fotos: string[]) {
    this.state().exameAtual.material.fotos.simCards = fotos
    if (this.state().exameAtual.material.fotos.simCards.length > 0) {
      this.state().exameAtual.setTarefaConcluida(this.tarefas.FOTOGRAFAR_SIM_CARD, this.state().usuarioAtual)
    }
  }

  async onFotosMemoryCard(fotos: string[]) {
    this.state().exameAtual.material.fotos.memoryCard = fotos
    if (this.state().exameAtual.material.fotos.memoryCard.length > 0) {
      this.state().exameAtual.setTarefaConcluida(this.tarefas.FOTOGRAFAR_MEMORY_CARD, this.state().usuarioAtual)
    }
  }

  getMateriaisControls(): AbstractControl[] {
    const listaMateriais = this.form.get("materiais") as FormArray
    return listaMateriais.controls
  }

  iniciarFluxoMaterial() {
    let primeiroMaterial: any
    const embalagem = uuidv4()
    this.getMateriaisControls().forEach((m) => {
      const material = new Material(m.get("numero")?.value, m.get("uf")?.value)
      const existeMaterial = this.state().listaExames.some((exame) => exame.material.equal(material))
      const exame = this.getExame(material)
      if (!exame.embalagem) exame.embalagem = embalagem
      this.onChangeMaterialAtual(exame.material)
      if (!existeMaterial) {
        this.state().exameAtual.reset()
        this.state().exameAtual.setTarefaAtiva(this.tarefas.RECEBER_MATERIAL)
        if (!primeiroMaterial) primeiroMaterial = this.state().exameAtual.material
      }
    })
    if (primeiroMaterial) this.onChangeMaterialAtual(primeiroMaterial)
    this.state().exameAtual.currentStep = this.step.RECEBER_MATERIAL
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
      const exameAtual = this.state().exameAtual
      this.state().listaExames.forEach((exame) => {
        if (exame.embalagem === exameAtual.embalagem) {
          exame.setTarefaConcluida(this.tarefas.RECEBER_MATERIAL, this.state().usuarioAtual)
          exame.setTarefaAtiva(this.tarefas.CONFERIR_LACRE)
          exame.currentStep = this.step.VERIFICAR_MATERIAL_LACRADO
        }
      })
    }
  }

  materialRecebidoLacrado(value: boolean) {
    if (value) {
      this.state().exameAtual.currentStep = this.step.VERIFICAR_LACRE_CONFERE
    } else {
      this.state().exameAtual.currentStep = this.step.VERIFICAR_MATERIAL_DEVE_SER_LACRADO
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
    const exameAtual = this.state().exameAtual
    this.state().listaExames.forEach((exame) => {
      if (exame.embalagem === exameAtual.embalagem) {
        if (value) {
          exame.setTarefaConcluida(this.tarefas.CONFERIR_LACRE, this.state().usuarioAtual)
          exame.setTarefaAtiva(this.tarefas.FOTOGRAFAR_NR_LACRE)
          exame.setTarefaAtiva(this.tarefas.FOTOGRAFAR_EMBALAGEM)
          exame.setTarefaAtiva(this.tarefas.ATUALIZAR_CADASTRO_MATERIAL)
          exame.setTarefaAtiva(this.tarefas.REGISTRAR_CODIGO_EPOL)
          exame.setTarefaAtiva(this.tarefas.DESLACRAR_MATERIAL)
          exame.setTarefaAtiva(this.tarefas.ETIQUETAR_MATERIAL)
          exame.setTarefaAtiva(this.tarefas.FOTOGRAFAR_MATERIAL_ETIQUETADO)
          exame.setTarefaAtiva(this.tarefas.REGISTRAR_QTDE_SIM_CARDS)
          exame.setTarefaAtiva(this.tarefas.REGISTRAR_FABRICANTE_MODELO)
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
    this.state().exameAtual.currentStep = this.step.VERIFICAR_QTDE_SIM_CARDS
  }

  // REGISTRAR_ATUALIZACAO_CADASTRO = 4,
  registrarAtualizarCadastroMaterial() {
    const descricao = this.state().exameAtual.material.descricao.trim()
    if (!descricao) return
    this.state().exameAtual.setTarefaConcluida(this.tarefas.ATUALIZAR_CADASTRO_MATERIAL, this.state().usuarioAtual)

    const imeiPattern = /imei\s*\d{0,1}[:]*\s*([\d\.\-\/]*)/gim
    let matches = descricao.match(imeiPattern)

    let imei1 = ""
    let imei2 = ""

    if (matches) {
      matches.forEach((match) => {
        const lista = match.split(" ")
        const imei = lista[lista.length - 1].replace(/\D/g, "")
        if (!imei1) {
          imei1 = imei
        } else if (!imei2) {
          imei2 = imei
        }
      })
      this.state().exameAtual.material.imei1 = imei1
      this.state().exameAtual.material.imei2 = imei2
    }

    const serialPattern = /(?:serial|sn|s\/n|n[úu]mero (?:de )*s[ée]rie)(?:[:=\s])*([\d\.\-\/]*)/gim
    matches = descricao.match(serialPattern)

    if (matches) {
      const lista = matches[0].split(" ")
      const serial = lista[lista.length - 1].replace(/\D/g, "")
      this.state().exameAtual.material.serial = serial
    }
  }

  // REGISTRAR_OPERADORA_SIM_CARD = 10,
  // FOTOGRAFAR_SIM_CARD = 11,
  // EXTRACAO_SIM_CARD = 12,
  // REGISTRAR_QTDE_MEMORY_CARDS = 13,
  registrarQtdeSimCards(value: number) {
    if (value > 0) {
      this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_OPERADORA_SIM_CARD)
      this.state().exameAtual.setTarefaAtiva(this.tarefas.FOTOGRAFAR_SIM_CARD)
      this.state().exameAtual.setTarefaAtiva(this.tarefas.EXTRACAO_SIM_CARD)
    }
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_QTDE_SIM_CARDS, this.state().usuarioAtual)
    this.state().exameAtual.setTarefaConcluida(this.tarefas.DESLACRAR_MATERIAL, this.state().usuarioAtual)
    this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_QTDE_MEMORY_CARDS)
    this.state().exameAtual.currentStep = this.step.VERIFICAR_QTDE_MEMORY_CARDS

    const exameAtual = this.state().exameAtual
    exameAtual.material.qtde_simcard = value.toString()
    this.state.update((s) => ({ ...s, exameAtual }))
  }

  // FOTOGRAFAR_MEMORY_CARD = 14,
  // EXTRACAO_MEMORY_CARD = 15,
  // REGISTRAR_ESTADO_CONSERVACAO = 16,
  // REGISTRAR_DEFEITOS_OBSERVADOS = 17,
  // REGISTRAR_APARELHO_RECEBIDO_LIGADO = 18,
  registrarQtdeMemoryCards(value: number) {
    if (value > 0) {
      this.state().exameAtual.setTarefaAtiva(this.tarefas.FOTOGRAFAR_MEMORY_CARD)
      this.state().exameAtual.setTarefaAtiva(this.tarefas.EXTRACAO_MEMORY_CARD)
    }
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_QTDE_MEMORY_CARDS, this.state().usuarioAtual)
    this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_ESTADO_CONSERVACAO)
    this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_DEFEITOS_OBSERVADOS)
    this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_APARELHO_RECEBIDO_LIGADO)
    this.state().exameAtual.currentStep = this.step.VERIFICAR_APARELHO_RECEBIDO_LIGADO

    const exameAtual = this.state().exameAtual
    exameAtual.material.qtde_memorycard = value.toString()
    this.state.update((s) => ({ ...s, exameAtual }))
  }

  // CARREGAR_BATERIA = 19,
  // LIGAR_APARELHO = 20,
  // REGISTRAR_FUNCIONAMENTO_TELA = 21,
  registrarAparelhoRecebidoLigado(value: boolean) {
    this.state().exameAtual.material.recebidoLigado = value
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_APARELHO_RECEBIDO_LIGADO, this.state().usuarioAtual)
    this.state().exameAtual.setTarefaAtiva(this.tarefas.CARREGAR_BATERIA)
    this.state().exameAtual.setTarefaAtiva(this.tarefas.LIGAR_APARELHO)
    this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_FUNCIONAMENTO_TELA)
    this.state().exameAtual.currentStep = this.step.VERIFICAR_FUNCIONAMENTO_TELA
    this.mostrarBateria = true
  }

  // REGISTRAR_FABRICANTE_MODELO = 22,
  // REGISTRAR_APARELHO_BLOQUEADO = 23,
  registrarFuncionamentoTela(value: boolean) {
    this.state().exameAtual.material.telaFuncionando = TELA_STATUS.FUNCIONANDO
    if (value) {
      this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_APARELHO_BLOQUEADO)
      this.state().exameAtual.currentStep = this.step.VERIFICAR_TELEFONE_BLOQUEADO
    } else {
      this.state().exameAtual.currentStep = this.step.VERIFICAR_EXTRACAO_OK
    }
    this.state().exameAtual.setTarefaConcluida(this.tarefas.LIGAR_APARELHO, this.state().usuarioAtual)
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_FUNCIONAMENTO_TELA, this.state().usuarioAtual)
  }

  // REGISTRAR_DETALHES_SENHA = 24,
  // REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO = 25,
  registrarTelefoneBloqueado(value: boolean) {
    this.state().exameAtual.material.recebidoBloqueado = value
    if (value) {
      this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_DETALHES_SENHA)
      this.state().exameAtual.currentStep = this.step.VERIFICAR_FORNECIMENTO_SENHA
    } else {
      this.state().exameAtual.currentStep = this.step.VERIFICAR_MODO_AVIAO
    }
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_APARELHO_BLOQUEADO, this.state().usuarioAtual)
    this.state().exameAtual.setTarefaAtiva(this.tarefas.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO)
  }

  registrarSenhaFornecida() {
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_DETALHES_SENHA, this.state().usuarioAtual)
    this.state().exameAtual.currentStep = this.step.VERIFICAR_MODO_AVIAO
  }

  registrarModoAviao(value: boolean) {
    this.state().exameAtual.material.recebidoModoAviao = value
    this.state().exameAtual.setTarefaConcluida(
      this.tarefas.REGISTRAR_APARELHO_RECEBIDO_MODO_AVIAO,
      this.state().usuarioAtual
    )
    if (!value) {
      this.state().exameAtual.setTarefaAtiva(this.tarefas.COLOCAR_APARELHO_MODO_AVIAO)
    }
    this.state().exameAtual.currentStep = this.step.VERIFICAR_EXTRACAO_OK
  }

  registrarColocarAparelhoModoAviao() {
    this.state().exameAtual.setTarefaConcluida(this.tarefas.COLOCAR_APARELHO_MODO_AVIAO, this.state().usuarioAtual)
  }

  registrarCarregarBateria() {
    this.state().exameAtual.setTarefaConcluida(this.tarefas.CARREGAR_BATERIA, this.state().usuarioAtual)
  }

  registrarFabricanteModelo() {
    if (!this.state().exameAtual.material.fabricante.trim() || !this.state().exameAtual.material.modelo.trim()) return
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_FABRICANTE_MODELO, this.state().usuarioAtual)
  }

  registrarEstadoConservacao() {
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_ESTADO_CONSERVACAO, this.state().usuarioAtual)
  }

  registrarDefeitosObservados() {
    if (
      !this.state().exameAtual.material.aparencia_tela ||
      !this.state().exameAtual.material.funcionamento_tela ||
      !this.state().exameAtual.material.funcionamento_botoes ||
      !this.state().exameAtual.material.funcionamento_touch ||
      !this.state().exameAtual.material.funcionamento_conector_dados ||
      (this.state().exameAtual.material.estado_conservacao !== "Bom" &&
        this.state().exameAtual.material.outros_defeitos_observados.trim() === "")
    )
      return
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_DEFEITOS_OBSERVADOS, this.state().usuarioAtual)
  }

  registrarOperadoraSimCard() {
    if (+this.state().exameAtual.material.qtde_simcard > 0 && !this.state().exameAtual.material.simcard1_operadora.trim())
      return
    if (+this.state().exameAtual.material.qtde_simcard > 1 && !this.state().exameAtual.material.simcard2_operadora.trim())
      return
    if (+this.state().exameAtual.material.qtde_simcard > 2 && !this.state().exameAtual.material.simcard3_operadora.trim())
      return
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_OPERADORA_SIM_CARD, this.state().usuarioAtual)
  }

  registrarExtracaoSimCard() {
    if (+this.state().exameAtual.material.qtde_simcard > 0 && !this.state().exameAtual.material.is_simcard1_extracted) return
    if (+this.state().exameAtual.material.qtde_simcard > 1 && !this.state().exameAtual.material.is_simcard2_extracted) return
    if (+this.state().exameAtual.material.qtde_simcard > 2 && !this.state().exameAtual.material.is_simcard3_extracted) return
    this.state().exameAtual.setTarefaConcluida(this.tarefas.EXTRACAO_SIM_CARD, this.state().usuarioAtual)
  }

  registrarExtracaoMemoryCard() {
    if (+this.state().exameAtual.material.qtde_memorycard > 0 && !this.state().exameAtual.material.is_memorycard1_extracted)
      return
    if (+this.state().exameAtual.material.qtde_memorycard > 1 && !this.state().exameAtual.material.is_memorycard2_extracted)
      return
    if (+this.state().exameAtual.material.qtde_memorycard > 2 && !this.state().exameAtual.material.is_memorycard3_extracted)
      return
    this.state().exameAtual.setTarefaConcluida(this.tarefas.EXTRACAO_MEMORY_CARD, this.state().usuarioAtual)
  }

  registrarCodigoEpol() {
    if (!this.state().exameAtual.material.codigoEpol.trim()) return
    this.state().exameAtual.setTarefaConcluida(this.tarefas.REGISTRAR_CODIGO_EPOL, this.state().usuarioAtual)
  }

  finalizar() {
    this.printExame()
    this.state().exameAtual.currentStep = this.step.TAREFAS_CONCLUIDAS
  }

  printExame() {
    this.state().exameAtual.imprimirJson()
  }

  getRange(): number[] {
    // Divida por 2 para contar apenas os valores do enum
    const tarefasLength = Object.keys(this.tarefas).length / 2
    return Array.from({ length: tarefasLength }, (_, i) => i)
  }

  setModalPessoasOpen(isOpen: boolean) {
    this.isModalPessoasOpen = isOpen
  }

  usuarioAtualModal() {
    const usuarioAtual = this.state().usuarioAtual
    return usuarioAtual ? usuarioAtual.nome : "Selecione o responsável"
  }

  setUsuarioAtual(usuario: Usuario) {
    this.onChangeUsuarioAtual(usuario)
    this.setModalPessoasOpen(false)
    const materialArray = this.form.get("materiais") as FormArray
    if (!materialArray.controls.length) this.addMaterialControl()
  }

  onEstadoConservacaoChange(value: string) {
    if (value === "Bom" || value === "Regular") {
      const exameAtual = this.state().exameAtual
      if (!exameAtual.material.aparencia_tela) exameAtual.material.aparencia_tela = "Vidro Ok"
      if (!exameAtual.material.funcionamento_tela) exameAtual.material.funcionamento_tela = "Normal"
      if (!exameAtual.material.funcionamento_botoes) exameAtual.material.funcionamento_botoes = "Normal"
      if (!exameAtual.material.funcionamento_touch) exameAtual.material.funcionamento_touch = "Normal"
      if (!exameAtual.material.funcionamento_conector_dados) exameAtual.material.funcionamento_conector_dados = "Normal"
      this.state.update((s) => ({ ...s, exameAtual }))
    }
    this.registrarEstadoConservacao()
    this.registrarDefeitosObservados()
  }

  onAparenciaTelaChange() {
    if (this.state().exameAtual.material.aparencia_tela !== "Vidro Ok") {
      this.state().exameAtual.material.estado_conservacao = "Ruim"
    }
    this.registrarEstadoConservacao()
  }

  onFuncionamentoTelaChange() {
    if (this.state().exameAtual.material.funcionamento_tela !== "Normal") {
      this.state().exameAtual.material.estado_conservacao = "Ruim"
    }
    this.registrarEstadoConservacao()
  }

  onFuncionamentoBotoesChange() {
    if (this.state().exameAtual.material.funcionamento_botoes !== "Normal") {
      this.state().exameAtual.material.estado_conservacao = "Ruim"
    }
    this.registrarEstadoConservacao()
  }

  onFuncionamentoTouchChange() {
    if (this.state().exameAtual.material.funcionamento_touch !== "Normal") {
      this.state().exameAtual.material.estado_conservacao = "Ruim"
    }
    this.registrarEstadoConservacao()
  }

  onFuncionamentoConectorDadosChange() {
    if (this.state().exameAtual.material.funcionamento_conector_dados !== "Normal") {
      this.state().exameAtual.material.estado_conservacao = "Ruim"
    }
    this.registrarEstadoConservacao()
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
