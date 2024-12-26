import { TestBed } from "@angular/core/testing"
import "firebase/firestore"
import { AngularFireModule } from "@angular/fire/compat"
import { AngularFirestoreCollection, AngularFirestoreModule } from "@angular/fire/compat/firestore"
import { DatabaseRepository } from "./DatabaseRepository"
import { firstValueFrom, map } from "rxjs"
import { ExameDTO } from "src/app/models/ExameDTO"
import { Exame, Material } from "src/app/models"

describe("DatabaseRepository", () => {
  let component: DatabaseRepository
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
    component = TestBed.inject(DatabaseRepository)
    await truncate()
  })

  const truncate = async () => {
    const eyedropsCollection: AngularFirestoreCollection<ExameDTO> = component.firestore.collection<ExameDTO>("eyedrops")
    const actions = await firstValueFrom(eyedropsCollection.snapshotChanges())
    for (let i = 0; i < actions.length; i++) {
      const docId = actions[i].payload.doc.id
      await component.firestore.collection("eyedrops").doc(docId).delete()
    }
  }

  it("should access firebase and get no documents", async () => {
    expect((await component.getAll()).length).toBe(0)
  })

  it("should create a document if not exists", async () => {
    const material = Material.create({ numero: "123" })
    await component.save(Exame.create({ material: material.toPersistence() }))
    expect((await component.getAll()).length).toBe(1)
  })

  it("should update a document if exists", async () => {
    const material = Material.create({ numero: "123" })
    await component.save(Exame.create({ material: material.toPersistence() }))
    await component.save(Exame.create({ material: material.toPersistence() }))
    expect((await component.getAll()).length).toBe(1)
  })

  it("should get a document by codigo", async () => {
    const material = Material.create({ numero: "123/24" })
    await component.save(Exame.create({ material: material.toPersistence() }))
    const exameDTO: ExameDTO = await component.getByCodigo("0123/2024 GO")
    expect(exameDTO.material.codigo).toBe("0123/2024 GO")
  })

  it("should get a document by UF", async () => {
    const material1 = Material.create({ numero: "123", uf: "GO" })
    const material2 = Material.create({ numero: "124", uf: "go" })
    const material3 = Material.create({ numero: "225", uf: "df" })
    await component.save(Exame.create({ material: material1.toPersistence() }))
    await component.save(Exame.create({ material: material2.toPersistence() }))
    await component.save(Exame.create({ material: material3.toPersistence() }))
    expect((await component.getByUF("GO")).length).toBe(2)
    expect((await component.getByUF("df")).length).toBe(1)
  })

  // it("should dont update a blocked document by another user", async () => {
  //   await component.save(Exame.create(Material.create("123/24", "GO")))
  //   await component.save(Exame.create(Material.create("124/24", "go")))
  //   await component.save(Exame.create(Material.create("225/24", "df")))
  //   await component.block("123/24")
  //   expect((await component.getAll()).length).toBe(2)
  // })
})
