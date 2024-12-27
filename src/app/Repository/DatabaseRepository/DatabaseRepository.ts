import { Injectable } from "@angular/core"
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from "@angular/fire/compat/firestore"
import { EyedropsRepository } from "../EyedropsRepository"
import { Exame } from "src/app/models"
import "firebase/compat/firestore"
import { ExameDTO } from "src/app/models/ExameDTO"
import { firstValueFrom, map } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class DatabaseRepository implements EyedropsRepository {
  eyedropsCollection: AngularFirestoreCollection
  eyedropsCollectionRef: CollectionReference

  constructor(public firestore: AngularFirestore) {
    this.eyedropsCollection = this.firestore.collection("eyedrops")
    this.eyedropsCollectionRef = this.firestore.collection("eyedrops").ref
  }

  async getAll(): Promise<ExameDTO[]> {
    return firstValueFrom(
      this.eyedropsCollection.snapshotChanges().pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as ExameDTO
            const id = a.payload.doc.id
            return { id, ...data }
          })
        )
      )
    )
  }

  async getByCodigo(codigo: string): Promise<ExameDTO> {
    try {
      const eyedropsRef = this.eyedropsCollectionRef.where("codigo", "==", codigo)
      const eyedropsQuery = await eyedropsRef.limit(1).get()
      if (eyedropsQuery.empty) return null
      const exame: ExameDTO = await eyedropsQuery.docs.map(async (doc: any) => {
        const data: any = {
          id: doc.id,
          ...doc.data(),
        }
        return data
      })[0]
      return exame
    } catch (error) {
      console.error(`Erro ao buscar documento codigo:${codigo}`, error)
      throw error
    }
  }

  async getByUF(uf: string): Promise<ExameDTO[]> {
    try {
      const eyedropsRef = this.eyedropsCollectionRef.where("uf", "==", uf.toUpperCase())
      const eyedropsQuery = await eyedropsRef.get()
      if (eyedropsQuery.empty) return []
      const exames: ExameDTO[] = eyedropsQuery.docs.map((doc: any) => {
        const data: ExameDTO = {
          id: doc.id,
          ...doc.data(),
        }
        return data
      })
      return exames
    } catch (error) {
      console.error(`Erro ao buscar documento uf:${uf}`, error)
      throw error
    }
  }

  async save(exame: Exame): Promise<void> {
    try {
      const exists = await this.getByCodigo(exame.material.codigo)
      if (!exists) {
        await this.eyedropsCollection.doc().set(exame.toPersistence())
      } else {
        await this.eyedropsCollection.doc(exists.id).set(exame.toPersistence())
      }
    } catch (error) {
      console.error("Erro ao criar o documento:", error)
      throw new Error(error.message)
    }
  }

  // async remove(gradeId: string): Promise<void> {
  //   try {
  //     const gradeRef = this.#gradeCollection.doc(gradeId)
  //     if (!gradeRef) throw Error(`Grade ID: ${gradeId} não existe no repositório!`)
  //     await gradeRef.delete()
  //     return null
  //   } catch (error) {
  //     console.error(`Erro ao buscar documento ID:${gradeId}`, error)
  //     throw error
  //   }
  // }

  async truncate() {
    return Promise.resolve()
  }
}
