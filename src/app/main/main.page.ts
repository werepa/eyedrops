import { Component, enableProdMode, inject, OnInit } from "@angular/core"
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from "@angular/forms"
import { AlertController, IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { addIcons } from "ionicons"
import { addOutline, camera, cameraOutline, checkmarkOutline, trash, trashOutline } from "ionicons/icons"
import { Exame, STEP, TAREFAS } from "../shared/models"
import { AuthService } from "../services/auth.service"
import { GaleriaFotosComponent } from "../galeria-fotos/galeria-fotos.component"

import { defineCustomElements } from "@ionic/pwa-elements/loader"
import { environment } from "src/environments/environment"
// Call the element loader before the bootstrapModule/bootstrapApplication call
defineCustomElements(window)
if (environment.production) {
  enableProdMode()
}

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, GaleriaFotosComponent, FormsModule],
})
export class MainPage implements OnInit {
  private alertController = inject(AlertController)
  form: FormGroup = new FormGroup([])
  step = STEP
  tarefas = TAREFAS
  currentStep: STEP = STEP.RECEBER_MATERIAL
  fotosEmbalagem: string[] = []
  fotosLacre: string[] = []
  fotosSimCards: string[] = []
  fotosMemoryCard: string[] = []
  selectedTab = "fluxo"

  constructor(private authService: AuthService, public exame: Exame, private fb: FormBuilder) {
    addIcons({ camera, cameraOutline, checkmarkOutline, trashOutline, addOutline })
    this.iniciarFluxoMaterial()
  }

  ngOnInit() {
    this.form = this.fb.group({
      nrMateriais: this.fb.array([], nrMaterialValidator),
    })
    this.addNrMaterial()
  }

  get nrMateriais() {
    return this.form.get("nrMateriais") as FormArray
  }

  addNrMaterial() {
    const nrMateriais = this.form.get("nrMateriais") as FormArray
    nrMateriais.push(this.fb.control(""))
  }

  async onFotosEmbalagem(fotos: string[]) {
    this.fotosEmbalagem = fotos
  }

  async onFotosLacre(fotos: string[]) {
    this.fotosLacre = fotos
  }

  async onFotosSimCards(fotos: string[]) {
    this.fotosSimCards = fotos
  }

  async onFotosMemoryCard(fotos: string[]) {
    this.fotosMemoryCard = fotos
  }

  iniciarFluxoMaterial() {
    this.exame.reset()
    this.exame.setTarefaAtiva(this.tarefas.RECEBER_MATERIAL)
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
    this.exame.setTarefaConcluida(this.tarefas.RECEBER_MATERIAL)
    this.exame.setTarefaAtiva(this.tarefas.CONFERIR_LACRE)
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
      this.exame.setTarefaConcluida(this.tarefas.CONFERIR_LACRE)
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
    console.log("Exame", this.exame)
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
  const regex = /(^(0*[1-9]\d{0,3}))\/(20(2[0-9]|3[0-9]|4[0-9]|50)|[2-4][0-9]|50)$/
  // Verifica se o valor do controle corresponde à expressão regular
  if (regex.test(value)) {
    // Se corresponder, retorna null (sem erro)
    return null
  } else {
    // Se não corresponder, retorna um objeto de erro
    return { invalidFormat: true }
  }
}
