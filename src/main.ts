import { enableProdMode, importProvidersFrom } from "@angular/core"
import { bootstrapApplication } from "@angular/platform-browser"
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from "@angular/router"
import { IonicRouteStrategy, provideIonicAngular } from "@ionic/angular/standalone"

import { routes } from "./app/app.routes"
import { AppComponent } from "./app/app.component"
import { environment } from "./environments/environment"

import { AngularFireModule } from "@angular/fire/compat"
import { AngularFirestoreModule } from "@angular/fire/compat/firestore"
import { DatabaseRepository } from "./app/Repository"

if (environment.production) {
  enableProdMode()
}

const firebaseConfig = {
  apiKey: "AIzaSyCychbq3p2CtKdv1-Q5ABJB7gA_r_En_x0",
  authDomain: "grade-anp.firebaseapp.com",
  projectId: "grade-anp",
  storageBucket: "grade-anp.firebasestorage.app",
  messagingSenderId: "761229602912",
  appId: "1:761229602912:web:67aa3a36a10111fb965305",
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AngularFireModule.initializeApp(firebaseConfig), AngularFirestoreModule),
    { provide: "EYEDROPS_REPOSITORY", useClass: DatabaseRepository },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
})
