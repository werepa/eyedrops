import { Material } from "."
import { MaterialDTO } from "./MaterialDTO"

describe("Material", () => {
  const currentYear = new Date().getFullYear()
  let material: Material

  beforeEach(() => {
    material = Material.create({ numero: "0001/2021" })
  })

  it("should accept a valid number greater than 0", () => {
    const material = Material.create({ numero: "1" })
    expect(material.numero).toBe(`0001/${currentYear}`)
    expect()
  })

  it("should accept a valid number with the current year", () => {
    const material = Material.create({ numero: `0001/${currentYear}` })
    expect(material.numero).toBe(`0001/${currentYear}`)
  })

  it("should accept a valid number with a past year", () => {
    let material = Material.create({ numero: "0001/2020" })
    expect(material.numero).toBe("0001/2020")
    material = Material.create({ numero: "1/20" })
    expect(material.numero).toBe("0001/2020")
  })

  it("should default to the current year if no year is specified", () => {
    const material = Material.create({ numero: "0001" })
    expect(material.numero).toBe(`0001/${currentYear}`)
  })

  it("should adjust a number with an invalid format", () => {
    let material = Material.create({ numero: "1" })
    expect(material.numero).toBe(`0001/${currentYear}`)
    material = Material.create({ numero: "1/24" })
    expect(material.numero).toBe(`0001/2024`)
  })

  it("should throw an error for a number equal 0", () => {
    expect(() => {
      Material.create({ numero: "000" })
    }).toThrowError("Número de material inválido.")
    expect(() => {
      Material.create({ numero: `000/${currentYear}` })
    }).toThrowError("Número de material inválido.")
  })

  it("should throw an error for a number with a future year", () => {
    expect(() => {
      Material.create({ numero: `0001/${currentYear + 1}` })
    }).toThrowError("Número de material inválido.")
  })

  it("should have a valid number", () => {
    expect(material.validateNumero()).toBe(true)
  })

  it("should throw an error for an invalid number", () => {
    expect(() => {
      Material.create({ numero: "0000/2022" })
    }).toThrowError("Número de material inválido.")
  })

  it("should have an empty lacre by default", () => {
    expect(material.lacre).toBe("")
  })

  it("should have empty foto arrays by default", () => {
    expect(material.fotos.embalagem).toEqual([])
    expect(material.fotos.lacre).toEqual([])
    expect(material.fotos.detalhes).toEqual([])
    expect(material.fotos.simCards).toEqual([])
    expect(material.fotos.memoryCard).toEqual([])
  })

  it("should convert Material to MaterialDTO", () => {
    const materialDTO: MaterialDTO = {
      numero: "0001/2023",
      uf: "SP",
      codigo: "0001/2023 SP",
      lacre: "123456",
      recebidoLigado: true,
      bateria: 1,
      telaFuncionando: 1,
      recebidoModoAviao: false,
      recebidoBloqueado: true,
      senhaFornecida: true,
      senha: "1234",
      fotos: {
        embalagem: JSON.stringify(["foto1.jpg"]),
        lacre: JSON.stringify(["foto2.jpg"]),
        detalhes: JSON.stringify(["foto3.jpg"]),
        simCards: JSON.stringify(["foto4.jpg"]),
        memoryCard: JSON.stringify(["foto5.jpg"]),
      },
      descricao: "Material de teste",
      codigoEpol: "EPOL123",
      estado_conservacao: "Bom",
      aparencia_tela: "Sem arranhões",
      funcionamento_tela: "Funcionando",
      funcionamento_touch: "Funcionando",
      funcionamento_botoes: "Funcionando",
      funcionamento_conector_dados: "Funcionando",
      outros_defeitos_observados: "Nenhum",
      qtde_simcard: 1,
      simcard1_operadora: "Operadora1",
      simcard1_numero: "123456789",
      simcard2_operadora: "",
      simcard2_numero: "",
      simcard3_operadora: "",
      simcard3_numero: "",
      qtde_memorycard: 1,
      fabricante: "Fabricante1",
      modelo: "Modelo1",
      imei1: "IMEI123456789",
      imei2: "",
      serial: "SERIAL123456",
      is_modo_aviao: false,
      is_simcard1_extracted: false,
      is_simcard2_extracted: false,
      is_simcard3_extracted: false,
      is_memorycard1_extracted: false,
      is_memorycard2_extracted: false,
      is_memorycard3_extracted: false,
      is_inseyets_extracting: false,
      inseyets_laped_machine: "",
      is_physical_analyzer_opening: false,
      physical_analyzer_laped_machine: "",
      whatsapp_physical_analyzer: "",
      dados_usuario: "",
      is_iped_opening: false,
      is_iped_ok: false,
      is_zipping: false,
      is_zip_ok: false,
      is_zip_moving: false,
    }
    const material = Material.create(materialDTO)
    const result = material.toPersistence()
    expect(result).toEqual(materialDTO)
  })
})
