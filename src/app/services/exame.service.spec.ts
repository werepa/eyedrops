import { TestBed } from "@angular/core/testing"
import { ExameService } from "./exame.service"
import { DatabaseRepository } from "../Repository"
import "firebase/firestore"
import { AngularFireModule } from "@angular/fire/compat"
import { AngularFirestoreModule } from "@angular/fire/compat/firestore"
import { Exame, Material, STEP, Usuario } from "../models"

describe("ExameService", () => {
  let service: ExameService
  const firebaseConfig = {
    apiKey: "AIzaSyDpMfldg10XJfdkap0lsQkfaFTzbVTv3Lo",
    authDomain: "grade-anp-testes.firebaseapp.com",
    projectId: "grade-anp-testes",
    storageBucket: "grade-anp-testes.firebasestorage.app",
    messagingSenderId: "486118580910",
    appId: "1:486118580910:web:de3c6d36d5b1672d86c33f",
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(firebaseConfig), AngularFirestoreModule],
      providers: [DatabaseRepository, { provide: "EYEDROPS_REPOSITORY", useClass: DatabaseRepository }],
    })
    service = TestBed.inject(ExameService)
    await service.repository.truncate()
  })

  it("should get documents after user login", async () => {
    service.repository.save(Exame.create({ material: Material.create({ numero: "123/2024" }).toPersistence() }))
    service.repository.save(Exame.create({ material: Material.create({ numero: "124/2024" }).toPersistence() }))
    service.repository.save(Exame.create({ material: Material.create({ numero: "125/2024" }).toPersistence() }))
    service.repository.save(Exame.create({ material: Material.create({ numero: "26/2024", uf: "DF" }).toPersistence() }))
    service.repository.save(Exame.create({ material: Material.create({ numero: "27/2024", uf: "DF" }).toPersistence() }))
    expect(service.state().listaExames.length).toBe(0)
    const usuarioAtual = Usuario.create({ codigo: "0000", nome: "Castro", perfil: "Perito", uf: "GO" })
    await service.changeUsuarioAtual(usuarioAtual)
    expect(service.state().listaExames.length).toBe(3)
  })

  it("should list differences between two exameDTO", () => {
    const exame1 = Exame.create({ material: Material.create({ numero: "123/2024" }).toPersistence() }).toPersistence()
    const lastUpdate = new Date(new Date().getTime() + 10000)
    const exame2 = {
      ...exame1,
      currentStep: STEP.VERIFICAR_FUNCIONAMENTO_TELA,
      material: { ...exame1.material, lacre: "123456" },
      updatedAt: lastUpdate,
    }
    const differences = service.listDifferences(exame1, exame2)

    expect(
      differences.sort((a, b) => {
        if (a.field < b.field) return -1
        if (a.field > b.field) return 1
        return 0
      })
    ).toEqual([
      { field: "currentStep", oldValue: STEP.RECEBER_MATERIAL, newValue: STEP.VERIFICAR_FUNCIONAMENTO_TELA },
      { field: "material.lacre", oldValue: "", newValue: "123456" },
      { field: "updatedAt", oldValue: exame1.updatedAt, newValue: lastUpdate },
    ])
  })
})
