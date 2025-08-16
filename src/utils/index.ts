import { Resume } from "@types"

// Interfaces and types
import type { ICountryData } from "countries-list"

// Utils
import {
  getCountryCode,
  getCountryDataList,
  getEmojiFlag
} from "countries-list"

const countries = getCountryDataList()

function getCountryData(name: string): ICountryData | undefined {
  if (!name || name.trim() == "") return undefined
  const data = countries.find((country) => {
    return (
      name.toLowerCase().includes(country.name.toLowerCase()) ||
      name.toLowerCase().split(" ").includes(country.iso3.toLowerCase()) ||
      name.toLowerCase().split(" ").includes(country.iso2.toLowerCase())
    )
  })
  return data
}

export { countries, getCountryCode, getCountryData, getEmojiFlag }

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getLocalDateStr(dateString: string | number) {
  if (!dateString) return ""

  const date = new Date(dateString)

  return date.toLocaleDateString()
}
