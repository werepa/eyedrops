import { Component, enableProdMode, inject, OnInit } from "@angular/core"
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms"
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
  fotosEmbalagem: string[] = [] // Array para armazenar as imagens capturadas
  fotosLacre: string[] = [] // Array para armazenar as imagens capturadas

  constructor(private authService: AuthService, public exame: Exame, private fb: FormBuilder) {
    addIcons({ camera, cameraOutline, checkmarkOutline, trashOutline, addOutline })
    this.iniciarFluxoMaterial()
  }

  ngOnInit() {
    this.form = this.fb.group({
      nrMateriais: this.fb.array([]),
    })
    // Adicione um controle para cada item existente em nrMateriais
    this.nrMateriais.controls.forEach(() => this.addNrMaterial())
  }

  get nrMateriais() {
    return this.form.get("nrMateriais") as FormArray
  }

  addNrMaterial() {
    this.nrMateriais.push(this.fb.control(""))
  }

  async onFotosEmbalagem(fotos: string[]) {
    this.fotosEmbalagem = fotos
  }

  async onFotosLacre(fotos: string[]) {
    this.fotosLacre = fotos
  }

  adicionarNrMaterial() {
    this.nrMateriais.push("")
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
