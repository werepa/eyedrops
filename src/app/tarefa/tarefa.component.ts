import { Component, Input } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { addIcons } from "ionicons"
import { checkmarkOutline } from "ionicons/icons"

@Component({
  selector: "app-tarefa",
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: "./tarefa.component.html",
  styleUrl: "./tarefa.component.scss",
})
export class TarefaComponent {
  @Input() tarefa: any = {}
  @Input() isSmallScreen: boolean = false
  @Input() mostrarTarefasConcluidas: boolean = true
  mostrarHistorico: boolean = false

  constructor() {
    addIcons({ checkmarkOutline })
  }

  toggleHistorico() {
    this.mostrarHistorico = !this.mostrarHistorico
    console.log(this.mostrarHistorico)
  }
}
