import { Component, enableProdMode, inject, OnInit } from "@angular/core"
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
import { addIcons } from "ionicons"
import { addOutline, camera, cameraOutline, checkmarkOutline, trash, trashOutline } from "ionicons/icons"
import { STEP, TAREFAS } from "../models/listas"
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
  usuarioAtual: Usuario
  form: FormGroup = new FormGroup([])
  step = STEP
  tarefas = TAREFAS
  currentStep: STEP = STEP.RECEBER_MATERIAL
  selectedTab = "fluxo"
  listaExames: Exame[] = []
  materialAtual = ""
  materialAtualUF = ""

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.usuarioAtual = this.authService.getUsuarioAtual()
    addIcons({ camera, cameraOutline, checkmarkOutline, trashOutline, addOutline })
  }

  ngOnInit() {
    this.form = this.fb.group({
      materiais: this.fb.array([], [Validators.minLength(1)]),
    })
    this.addMaterialControl()
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
  }

  async onFotosLacre(fotos: string[]) {
    this.getExameAtual().material.fotos.lacre = fotos
  }

  async onFotosMaterial(fotos: string[]) {
    this.getExameAtual().material.fotos.detalhes = fotos
  }

  async onFotosSimCards(fotos: string[]) {
    this.getExameAtual().material.fotos.simCards = fotos
  }

  async onFotosMemoryCard(fotos: string[]) {
    this.getExameAtual().material.fotos.memoryCard = fotos
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
      exame.reset()
      exame.setTarefaAtiva(this.tarefas.RECEBER_MATERIAL)
      this.onChangeMaterialAtual(exame.material.numero, exame.material.uf)
    })
    this.currentStep = this.step.RECEBER_MATERIAL
  }

  nextStep(step: STEP) {
    this.currentStep = step
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
    console.log("form", this.form)
    this.iniciarFluxoMaterial()
    this.getExameAtual().setTarefaConcluida(this.tarefas.RECEBER_MATERIAL)
    this.getExameAtual().setTarefaAtiva(this.tarefas.CONFERIR_LACRE)
    this.currentStep = this.step.VERIFICAR_MATERIAL_LACRADO
  }

  materialRecebidoLacrado(value: boolean) {
    if (value) {
      this.currentStep = this.step.VERIFICAR_LACRE_CONFERE
    } else {
      this.currentStep = this.step.VERIFICAR_MATERIAL_DEVE_SER_LACRADO
    }
  }

  registrarLacreConfere(value: boolean) {
    if (value) {
      this.getExameAtual().setTarefaConcluida(this.tarefas.CONFERIR_LACRE)
      this.currentStep = this.step.VERIFICAR_POSSUI_SIM_CARD
    } else {
      this.currentStep = this.step.VERIFICAR_EXTRACAO_OK
    }
  }

  registrarExcecaoLacre() {
    this.currentStep = this.step.VERIFICAR_POSSUI_SIM_CARD
  }

  registrarModoAviao(value: boolean) {
    this.currentStep = this.step.VERIFICAR_EXTRACAO_OK
  }

  telaFuncionando(value: boolean) {
    this.currentStep = this.step.VERIFICAR_TELEFONE_BLOQUEADO
  }

  tirarFotoSimCard() {
    console.log("Foto do Sim Card")
  }

  tirarFotoMemoryCard() {
    console.log("Foto do Memory Card")
  }

  tirarFotoMaterial() {
    console.log("Foto do Material")
  }

  finalizar() {
    this.printExame()
    this.currentStep = this.step.TAREFAS_CONCLUIDAS
  }

  printExame() {
    console.log("Exame", this.getExameAtual().imprimirJson())
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
