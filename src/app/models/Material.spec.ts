import { Material } from "."

describe("Material", () => {
  const currentYear = new Date().getFullYear()
  let material: Material

  beforeEach(() => {
    material = new Material("0001/2021")
  })

  it("should create an instance", () => {
    expect(material).toBeTruthy()
  })

  it("should accept a valid number greater than 0", () => {
    const material = new Material(`1`)
    expect(material.numero).toBe(`0001/${currentYear}`)
    expect()
  })

  it("should accept a valid number with the current year", () => {
    const material = new Material(`0001/${currentYear}`)
    expect(material.numero).toBe(`0001/${currentYear}`)
  })

  it("should accept a valid number with a past year", () => {
    let material = new Material("0001/2020")
    expect(material.numero).toBe("0001/2020")
    material = new Material("1/20")
    expect(material.numero).toBe("0001/2020")
  })

  it("should default to the current year if no year is specified", () => {
    const material = new Material("0001")
    expect(material.numero).toBe(`0001/${currentYear}`)
  })

  it("should adjust a number with an invalid format", () => {
    let material = new Material("1")
    expect(material.numero).toBe(`0001/${currentYear}`)
    material = new Material("1/24")
    expect(material.numero).toBe(`0001/2024`)
  })

  it("should throw an error for a number equal 0", () => {
    expect(() => {
      new Material(`000`)
    }).toThrowError("Número de material inválido.")
    expect(() => {
      new Material(`000/${currentYear}`)
    }).toThrowError("Número de material inválido.")
  })

  it("should throw an error for a number with a future year", () => {
    expect(() => {
      new Material(`0001/${currentYear + 1}`)
    }).toThrowError("Número de material inválido.")
  })

  it("should have a valid number", () => {
    expect(material.validateNumero()).toBe(true)
  })

  it("should throw an error for an invalid number", () => {
    expect(() => {
      new Material("0000/2022")
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
})
