import { Exame } from "./Exame"
import { Material, STEP, TAREFAS, Usuario } from "."

describe("Exame", () => {
  let exame: Exame
  let material: Material
  let usuario: Usuario

  beforeEach(() => {
    material = new Material("123/2024")
    usuario = new Usuario({
      codigo: "001",
      nome: "Usuario 1",
      uf: "GO",
      perfil: "Perito",
    })
    exame = new Exame(material, usuario)
  })

  it("should create an instance of Exame", () => {
    expect(exame).toBeInstanceOf(Exame)
  })

  it("should have the correct material", () => {
    expect(exame.material).toBe(material)
  })

  it("should have the correct usuarioAtual", () => {
    expect(exame.getUsuarioAtual()).toBe(usuario)
  })

  it("should have the correct currentStep", () => {
    expect(exame.currentStep).toBe(STEP.RECEBER_MATERIAL)
  })

  it("should have the correct tarefas", () => {
    const tarefas = exame.tarefas
    expect(tarefas.length).toBeGreaterThan(0)
    expect(tarefas[0].codigo).toBeDefined()
    expect(tarefas[0].descricao).toBeDefined()
    expect(tarefas[0].historico).toEqual([])
    expect(tarefas[0].ativa).toBe(false)
    expect(tarefas[0].concluida).toBe(false)
  })

  it("should set a tarefa as ativa", () => {
    const tarefaCodigo = TAREFAS.RECEBER_MATERIAL
    exame.setTarefaAtiva(tarefaCodigo)
    const tarefa = exame.getTarefa(tarefaCodigo)
    expect(tarefa.ativa).toBe(true)
  })

  it("should set a tarefa as inativa", () => {
    const tarefaCodigo = TAREFAS.RECEBER_MATERIAL
    exame.setTarefaAtiva(tarefaCodigo)
    exame.setTarefaInativa(tarefaCodigo)
    const tarefa = exame.getTarefa(tarefaCodigo)
    expect(tarefa.ativa).toBe(false)
  })

  it("should set a tarefa as concluida", () => {
    const tarefaCodigo = TAREFAS.RECEBER_MATERIAL
    exame.setTarefaConcluida(tarefaCodigo)
    const tarefa = exame.getTarefa(tarefaCodigo)
    expect(tarefa.ativa).toBe(true)
    expect(tarefa.concluida).toBe(true)
    expect(tarefa.historico.length).toBe(1)
    expect(tarefa.historico[0].usuario).toBe(usuario)
    expect(tarefa.historico[0].objetoAnterior).toBeDefined()
    expect(tarefa.historico[0].data).toBeInstanceOf(Date)
  })

  it("should get the active tasks", () => {
    exame.setTarefaAtiva(TAREFAS.RECEBER_MATERIAL)
    exame.setTarefaAtiva(TAREFAS.CONFERIR_LACRE)
    const activeTasks = exame.getTarefasAtivas()
    expect(activeTasks.length).toBe(2)
    expect(activeTasks[0].codigo).toBe(TAREFAS.RECEBER_MATERIAL)
    expect(activeTasks[1].codigo).toBe(TAREFAS.CONFERIR_LACRE)
  })

  it("should get the completed tasks", () => {
    exame.setTarefaConcluida(TAREFAS.RECEBER_MATERIAL)
    exame.setTarefaConcluida(TAREFAS.CONFERIR_LACRE)
    const completedTasks = exame.getTarefasConcluidas()
    expect(completedTasks.length).toBe(2)
    expect(completedTasks[0].codigo).toBe(TAREFAS.RECEBER_MATERIAL)
    expect(completedTasks[1].codigo).toBe(TAREFAS.CONFERIR_LACRE)
  })

  it("should reset the tarefas", () => {
    exame.setTarefaAtiva(TAREFAS.RECEBER_MATERIAL)
    exame.setTarefaConcluida(TAREFAS.CONFERIR_LACRE)
    exame.reset()
    const tarefas = exame.tarefas
    expect(tarefas.length).toBeGreaterThan(0)
    expect(tarefas[0].ativa).toBe(false)
    expect(tarefas[0].concluida).toBe(false)
    expect(tarefas[0].historico).toEqual([])
  })
})
