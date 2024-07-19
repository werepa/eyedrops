import { Component, EventEmitter, Input, Output } from "@angular/core"
import { Camera, CameraResultType } from "@capacitor/camera"
import { IonIcon } from "@ionic/angular/standalone"
import { AlertController, IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { addIcons } from "ionicons"
import { cameraOutline, trashOutline } from "ionicons/icons"

@Component({
  selector: "app-galeria-fotos",
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: "./galeria-fotos.component.html",
  styleUrls: ["./galeria-fotos.component.scss"],
})
export class GaleriaFotosComponent {
  @Input() titulo: string = "Galeria de Fotos"
  @Input() fotos: string[] = []
  @Input() mostrar: boolean = false
  @Output() tirarFoto = new EventEmitter<string[]>()
  @Output() excluirFoto = new EventEmitter<string[]>()

  constructor(private alertController: AlertController) {
    addIcons({ cameraOutline, trashOutline })
  }

  async onTirarFoto() {
    try {
      // Aciona a câmera e captura a foto
      const foto = await Camera.getPhoto({
        quality: 90, // Define a qualidade da imagem
        allowEditing: true, // Permite ou não a edição da foto antes de salvá-la
        resultType: CameraResultType.Base64, // Retorna a foto como uma string Base64
      })
      // Verifica se a foto foi capturada com sucesso
      if (foto && foto.base64String) {
        // Adiciona a imagem capturada ao array
        this.fotos.push(foto.base64String)
        this.tirarFoto.emit(this.fotos)
      }
    } catch (erro) {
      console.error("Erro ao capturar a foto:", erro)
    }
  }

  async onExcluirFoto(index: number) {
    const alert = await this.alertController.create({
      header: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir esta foto?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
        },
        {
          text: "Excluir",
          handler: () => {
            this.fotos.splice(index, 1)
            this.excluirFoto.emit(this.fotos)
          },
        },
      ],
    })

    await alert.present()
  }
}
