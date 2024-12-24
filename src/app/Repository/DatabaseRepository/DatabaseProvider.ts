import { ExameService } from "src/app/services/exame.service"
import { DatabaseRepository } from "./DatabaseRepository"
import firebase from "firebase/compat/app"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDpMfldg10XJfdkap0lsQkfaFTzbVTv3Lo",
  authDomain: "grade-anp-testes.firebaseapp.com",
  projectId: "grade-anp-testes",
  storageBucket: "grade-anp-testes.firebasestorage.app",
  messagingSenderId: "486118580910",
  appId: "1:486118580910:web:de3c6d36d5b1672d86c33f",
}

export const DatabaseProvider = [
  // provider for ExameService
  {
    provide: ExameService,
    useFactory: (repository: any) => {
      return new ExameService(repository)
    },
    inject: [DatabaseRepository],
  },
  // provider for DatabaseRepository
  {
    provide: "EYEDROPS_REPOSITORY",
    useClass: DatabaseRepository,
  },
  // provider for firebase
  {
    provide: firebase.initializeApp(firebaseConfig),
    useValue: firebase.initializeApp(firebaseConfig),
  },
]
