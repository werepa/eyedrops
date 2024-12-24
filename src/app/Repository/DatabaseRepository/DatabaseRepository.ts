import { Injectable } from "@angular/core"
import { AngularFirestore, CollectionReference } from "@angular/fire/compat/firestore"
import { EyedropsRepository } from "../EyedropsRepository"
import { Exame } from "src/app/models"
import "firebase/compat/firestore"

@Injectable({
  providedIn: "root",
})
export class DatabaseRepository implements EyedropsRepository {
  eyedropsCollection: CollectionReference

  constructor(private firestore: AngularFirestore) {
    this.eyedropsCollection = this.firestore.collection("eyedrops").ref
    this.getByCodigo("0123/2024 GO")
      .then((exame) => {
        console.log("exame", exame)
      })
      .catch((error) => {
        console.error("Error getting document: ", error)
      })
  }
  async getByCodigo(codigo: string): Promise<any> {
    try {
      const eyedropsRef = this.eyedropsCollection.where("codigo", "==", codigo)
      const eyedropsQuery = await eyedropsRef.limit(1).get()
      if (eyedropsQuery.empty) return null
      const exame: Exame = await eyedropsQuery.docs.map(async (doc: any) => {
        const data: any = {
          ...doc.data(),
          id: doc.id,
          exame: doc.data(),
        }
        return data
      })[0]
      return exame
    } catch (error) {
      console.error(`Erro ao buscar documento codigo:${codigo}`, error)
      throw error
    }
  }
  getByUF(codigo: string): Promise<any[]> {
    throw new Error("Method not implemented.")
  }

  async save(exame: Exame): Promise<void> {
    try {
      const query = await this.eyedropsCollection.where("codigo", "==", exame.material.codigo).get()
      if (query.empty) {
        console.log("save - create", query.empty)
        await this.eyedropsCollection.doc().set({ codigo: exame.material.codigo, exame: JSON.stringify(exame) })
      } else {
        console.log("save - update", query.docs[0].id)
        await this.eyedropsCollection
          .doc(query.docs[0].id)
          .set({ codigo: exame.material.codigo, exame: JSON.stringify(exame) })
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
