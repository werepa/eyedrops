import { TestBed } from "@angular/core/testing"
import { ExameService } from "./exame.service"
import { DatabaseRepository } from "../Repository"
import "firebase/firestore"
import { AngularFireModule } from "@angular/fire/compat"
import { AngularFirestoreModule } from "@angular/fire/compat/firestore"

xdescribe("ExameService", () => {
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

  it("should block a document", async () => {})
})
