import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MainPage } from "./main.page"
import { STEP } from "../models/listas"
import { Exame, Material, Usuario } from "../models"
import { AuthService } from "../services/auth.service"

describe("MainPage", () => {
  let component: MainPage
  let fixture: ComponentFixture<MainPage>
  let exame: Exame

  const authServiceMock = {
    getUsuarioAtual: () =>
      new Usuario({
        codigo: "002",
        nome: "Usuario 2",
        perfil: "Perito",
      }),
  }

  beforeEach(async () => {
    fixture = await TestBed.configureTestingModule({
      imports: [MainPage],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents()
    fixture = TestBed.createComponent(MainPage)
    component = fixture.componentInstance
    component.ngOnInit()
    exame = new Exame(new Material("123/2024"), new Usuario({ codigo: "001", nome: "Usuario 1", perfil: "Perito" }))
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize with correct values", () => {
    expect(component.materialAtual).toBe("")
    expect(component.listaExames).toEqual([])
    expect(component.currentStep).toEqual(STEP.RECEBER_MATERIAL)
  })

  it("should create exame when calling getExame if not exists", () => {
    const nrMaterial = "123/24"
    expect(component.listaExames.length).toBe(0)
    const exame = component.getExame(nrMaterial)
    expect(exame).toBeDefined()
    expect(exame.material.numero).toBe(nrMaterial)
    expect(component.listaExames.length).toBe(1)
    component.getExame(nrMaterial)
    expect(component.listaExames.length).toBe(1)
  })

  it("should return the correct exame when calling getExame", () => {
    const nrMaterial1 = "123/24"
    const nrMaterial2 = "456/24"
    component.getExame(nrMaterial1)
    component.getExame(nrMaterial2)
    const exame = component.getExame(nrMaterial1)
    expect(exame).toBeDefined()
    expect(exame.material.numero).toBe(nrMaterial1)
  })

  it("should update exame usuarioAtual when changing materialAtual", () => {
    const nrMaterial1 = "123/24"
    const nrMaterial2 = "456/24"
    component.getExame(nrMaterial1)
    component.getExame(nrMaterial2)
    expect(component.materialAtual).toBe("")
    component.onChangeMaterialAtual(nrMaterial1)
    expect(component.materialAtual).toBe(nrMaterial1)
  })

  it("should add a new material form control when calling addNrMaterial", () => {
    let nrMateriais = component.getNrMateriaisControls()
    expect(nrMateriais.length).toBe(1)
    component.addNrMaterial()
    expect(component.getNrMateriaisControls().length).toBe(2)
  })

  it("should return the current exame when calling getExameAtual", () => {
    const nrMaterial1 = "123/24"
    const nrMaterial2 = "456/24"
    component.getExame(nrMaterial1)
    component.getExame(nrMaterial2)
    component.onChangeMaterialAtual(nrMaterial1)
    const exameAtual = component.getExameAtual()
    expect(exameAtual).toBeDefined()
    expect(exameAtual.material.numero).toBe(nrMaterial1)
  })

  it("should update exame fotosEmbalagem when calling onFotosEmbalagem", async () => {
    const nrMaterial = "123/24"
    component.getExame(nrMaterial)
    component.onChangeMaterialAtual(nrMaterial)
    const fotos = ["foto1.jpg", "foto2.jpg"]
    await component.onFotosEmbalagem(fotos)
    const exameAtual = component.getExameAtual()
    expect(exameAtual.material.fotos.embalagem).toEqual(fotos)
  })

  it("should update exame fotosLacre when calling onFotosLacre", async () => {
    const nrMaterial = "123/24"
    component.getExame(nrMaterial)
    component.onChangeMaterialAtual(nrMaterial)
    const fotos = ["foto1.jpg", "foto2.jpg"]
    await component.onFotosLacre(fotos)
    const exameAtual = component.getExameAtual()
    expect(exameAtual.material.fotos.lacre).toEqual(fotos)
  })

  it("should update exame fotosMaterial when calling onFotosMaterial", async () => {
    const nrMaterial = "123/24"
    component.getExame(nrMaterial)
    component.onChangeMaterialAtual(nrMaterial)
    const fotos = ["foto1.jpg", "foto2.jpg"]
    await component.onFotosMaterial(fotos)
    const exameAtual = component.getExameAtual()
    expect(exameAtual.material.fotos.detalhes).toEqual(fotos)
  })

  it("should update exame fotosSimCards when calling onFotosSimCards", async () => {
    const nrMaterial = "123/24"
    component.getExame(nrMaterial)
    component.onChangeMaterialAtual(nrMaterial)
    const fotos = ["foto1.jpg", "foto2.jpg"]
    await component.onFotosSimCards(fotos)
    const exameAtual = component.getExameAtual()
    expect(exameAtual.material.fotos.simCards).toEqual(fotos)
  })

  it("should update exame fotosMemoryCard when calling onFotosMemoryCard", async () => {
    const nrMaterial = "123/24"
    component.getExame(nrMaterial)
    component.onChangeMaterialAtual(nrMaterial)
    const fotos = ["foto1.jpg", "foto2.jpg"]
    await component.onFotosMemoryCard(fotos)
    const exameAtual = component.getExameAtual()
    expect(exameAtual.material.fotos.memoryCard).toEqual(fotos)
  })

  it("should return an array of AbstractControl when calling getNrMateriaisControls", () => {
    const nrMateriaisControls = component.getNrMateriaisControls()
    expect(nrMateriaisControls).toBeDefined()
    expect(nrMateriaisControls.length).toBe(1)
  })

  it("should update currentStep when calling nextStep", () => {
    const nextStep = STEP.VERIFICAR_EXTRACAO_OK
    component.nextStep(nextStep)
    expect(component.currentStep).toBe(nextStep)
  })

  // it("should receive the material when calling receberMaterial", () => {
  //   component.receberMaterial()
  //   expect(component.currentStep).toBe(STEP.REGISTRAR_LACRE)
  // })

  //   it("should update exame materialRecebidoLacrado when calling materialRecebidoLacrado", () => {
  //     const value = true
  //     component.materialRecebidoLacrado(value)
  //     const exameAtual = component.getExameAtual()
  //     expect(exameAtual.materialRecebidoLacrado).toBe(value)
  //   })

  //   it("should update exame registrarLacreConfere when calling registrarLacreConfere", () => {
  //     const value = true
  //     component.registrarLacreConfere(value)
  //     const exameAtual = component.getExameAtual()
  //     expect(exameAtual.registrarLacreConfere).toBe(value)
  //   })

  //   it("should update exame registrarExcecaoLacre when calling registrarExcecaoLacre", () => {
  //     component.registrarExcecaoLacre()
  //     const exameAtual = component.getExameAtual()
  //     expect(exameAtual.registrarExcecaoLacre).toBe(true)
  //   })

  //   it("should update exame registrarModoAviao when calling registrarModoAviao", () => {
  //     const value = true
  //     component.registrarModoAviao(value)
  //     const exameAtual = component.getExameAtual()
  //     expect(exameAtual.registrarModoAviao).toBe(value)
  //   })

  //   it("should update exame telaFuncionando when calling telaFuncionando", () => {
  //     const value = true
  //     component.telaFuncionando(value)
  //     const exameAtual = component.getExameAtual()
  //     expect(exameAtual.telaFuncionando).toBe(value)
  //   })

  //   it("should call the appropriate method when calling tirarFotoSimCard", () => {
  //     spyOn(component, "onFotosSimCards")
  //     component.tirarFotoSimCard()
  //     expect(component.onFotosSimCards).toHaveBeenCalled()
  //   })

  //   it("should call the appropriate method when calling tirarFotoMemoryCard", () => {
  //     spyOn(component, "onFotosMemoryCard")
  //     component.tirarFotoMemoryCard()
  //     expect(component.onFotosMemoryCard).toHaveBeenCalled()
  //   })

  //   it("should call the appropriate method when calling tirarFotoMaterial", () => {
  //     spyOn(component, "onFotosMaterial")
  //     component.tirarFotoMaterial()
  //     expect(component.onFotosMaterial).toHaveBeenCalled()
  //   })

  //   it("should call the appropriate method when calling finalizar", () => {
  //     spyOn(component, "printExame")
  //     component.finalizar()
  //     expect(component.printExame).toHaveBeenCalled()
  //   })
  // })
})
