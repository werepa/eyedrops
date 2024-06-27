import { Component, inject } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { AlertController, IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { addIcons } from "ionicons"
import { camera, checkmarkOutline } from "ionicons/icons"
import { Exame, STEP, TAREFAS } from "../shared/models"
import { AuthService } from "../services/auth.service"

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class MainPage {
  private alertController = inject(AlertController)
  step = STEP
  tarefas = TAREFAS
  currentStep: STEP = STEP.RECEBER_MATERIAL

  constructor(private authService: AuthService, public exame: Exame) {
    addIcons({ camera, checkmarkOutline })
    this.iniciarFluxoMaterial()
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

  tirarFotoLacre() {
    console.log("Foto do Lacre")
  }

  tirarFotoEmbalagem() {
    console.log("Foto do Embalagem")
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
