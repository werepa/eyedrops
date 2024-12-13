import { CommonModule } from "@angular/common"
import { Component, Input } from "@angular/core"
import { IonicModule } from "@ionic/angular"
import { Exame, Material, Usuario } from "../models"

@Component({
  selector: "app-etiqueta-material",
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: "./etiqueta-material.component.html",
  styleUrl: "./etiqueta-material.component.scss",
})
export class EtiquetaMaterialComponent {
  @Input() exame?: Exame
  @Input() isExameAtual?: boolean = false

  qtdePendencias() {
    return this.exame?.tarefas.filter((tarefa) => tarefa.ativa && !tarefa.concluida).length
  }

  getUsuarioResumido() {
    return this.exame?.getUserOfLastTask().nome
  }
}
