import { inject } from "@angular/core"
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals"
import { Exame, STEP, TAREFAS, Usuario } from "../models"
import { ExameService } from "../services/exame.service"
import { AuthService } from "../services/auth.service"

export type ExameState = {
  user: Usuario
  error: Error
  message: string
  action: TAREFAS
  status: STEP
  listaExames: Exame[]
  materialAtual: string
}

const initialState: ExameState = {
  user: null,
  error: null,
  message: "Receber material na secretaria do SETEC",
  action: TAREFAS.RECEBER_MATERIAL,
  status: STEP.RECEBER_MATERIAL,
  listaExames: [],
  materialAtual: "",
}

export type ExameStore = InstanceType<typeof ExameStore>
export const ExameStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withMethods(
    (store, exameService: ExameService = inject(ExameService), authService: AuthService = inject(AuthService)) => ({
      handleError(error: any) {
        let errorMesage = "Algo inesperado aconteceu. Tente novamente mais tarde"
        if (error.code === "Auth/invalid-credential") errorMesage = "Credenciais inválidas"
        patchState(store, { user: null, status: STEP.RECEBER_MATERIAL, error: { ...error, message: errorMesage } })
      },
      changeAction(action: TAREFAS) {
        patchState(store, { action })
      },
      async login(credentials: { email: string; password: string }) {
        try {
          const user = authService.getUsuarioAtual()
          patchState(store, { user })
        } catch (error) {
          this.handleError(error)
        }
      },
      // async register(credentials: { email: string; password: string }) {
      //   try {
      //     this.patchLoadingState("registering")
      //     await ExameService.createAccount(credentials)
      //     authService.createUser(credentials.email, credentials.password).subscribe((user) => {
      //       patchState(store, { user, isLoading: false, status: "success", action: "login" })
      //     })
      //   } catch (error) {
      //     this.handleError(error)
      //   }
      // },
      async logout() {
        authService.logout()
        patchState(store, {
          user: null,
        })
      },
    })
  )
)
