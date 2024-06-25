import { Component } from "@angular/core"
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { addIcons } from "ionicons"
import { camera } from "ionicons/icons"

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class MainPage {
  form: FormGroup
  currentStep: string = "inicio"

  constructor(private fb: FormBuilder) {
    addIcons({ camera })
    this.form = this.fb.group({
      fotoLacre: [""],
      fotoEmbalagem: [""],
      atualizarCadastro: [""],
      descricaoOk: [false],
      codigoEpol: [""],
      deslacrarMaterial: [""],
      etiquetarMaterial: [""],
      fotosMaterial: [""],
      qtdeSimCards: [0],
      operadora: [""],
      estadoConservacao: [""],
      defeitosObservados: [""],
      celularRecebido: [""],
      defeitosObservados2: [""],
      fabricante: [""],
      modelo: [""],
      detalhesSenha: [""],
      nrMaquinaLaped: [""],
      versaoSO: [""],
    })
  }

  nextStep(step: string) {
    this.currentStep = step
  }

  tirarFotoSimCard() {
    console.log("Foto do Sim Card")
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
    console.log("Formulário concluído:", this.form.value)
    this.currentStep = "listagemFinal"
  }
}
