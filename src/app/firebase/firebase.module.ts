import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import { DatabaseRepository } from "../Repository"

const firebaseProvider = {
  provide: "FIREBASE_APP",
  useFactory: () => {
    const firebaseConfig = {
      apiKey: "AIzaSyCychbq3p2CtKdv1-Q5ABJB7gA_r_En_x0",
      authDomain: "grade-anp.firebaseapp.com",
      projectId: "grade-anp",
      storageBucket: "grade-anp.firebasestorage.app",
      messagingSenderId: "761229602912",
      appId: "1:761229602912:web:67aa3a36a10111fb965305",
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }

    return firebase.firestore()
  },
}

@Module({
  providers: [
    firebaseProvider,
    {
      provide: DatabaseRepository,
      useFactory: (db: any) => {
        return new DatabaseRepository(db)
      },
      inject: ["FIREBASE_APP"],
    },
  ],
  exports: [DatabaseRepository],
})
export class FirebaseModule {}
