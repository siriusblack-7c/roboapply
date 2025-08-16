import { Resume } from "@types"

function requiredFieldsChecker(
  data: Record<string, any>,
  requiredFields: string[]
) {
  let missingFields = {}
  console.log({ data })

  // Helper function to check if a value is empty
  const isEmpty = (value: any): boolean => {
    if (value === undefined || value === null) return true
    if (typeof value === "string" && value.trim() === "") return true
    if (Array.isArray(value) && value.length === 0) return true
    if (typeof value === "object" && Object.keys(value).length === 0)
      return true
    return false
  }

  // Check required fields
  for (const field of requiredFields) {
    if (isEmpty(data?.[field])) missingFields[field] = true
  }

  return missingFields
}

export function isRequiredFieldsFilled(data: Resume) {
  const requirePersonalFields: (keyof Resume["personalInformation"])[] = [
    "firstName",
    "lastName",
    "city",
    "state",
    "country",
    "email",
    "phoneNo",
    "countryCode",
    "gender"
  ]
  const requireFormFields: (keyof Resume["formData"])[] = [
    "experience",
    "disability",
    "canStartImmediately",
    "remoteSetting",
    "siteSetting",
    "hybridSetting",
    "countriesAuthorizedToWork",
    "visaSponsorshipStatus",
    "securityClearanceStatus",
    "veteranStatus",
    "expectedSalary",
    "expectedSalaryCurrency",
    "raceEthnicity",
    "highestEducation",
    "expectedJoiningDate"
  ]

  let missingPersonalFields: any = requiredFieldsChecker(
    data.personalInformation,
    requirePersonalFields
  )
  let missingFormFields: any = requiredFieldsChecker(
    data.formData,
    requireFormFields
  )

  if (
    Object.keys(missingPersonalFields).length > 0 ||
    Object.keys(missingFormFields).length > 0
  ) {
    return {
      success: false,
      message: "Please fill in all required fields",
      missingPersonalFields,
      missingFormFields
    }
  }
  return { success: true }
}
