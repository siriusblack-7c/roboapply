export type Miscellaneous = {
  experience: string
  veteranStatus: string
  disability: string
  willingToRelocate: string
  raceEthnicity: string
  noticePeriod: string
  expectedSalary: string
  expectedSalaryCurrency: string
  currentSalary: string
  currentSalaryCurrency: string
  drivingLicense: string
  highestEducation: string
  expectedJoiningDate: string
  companiesExclude: string
  visaSponsorshipStatus: "yes" | "no"
  securityClearanceStatus: "yes" | "no"
  countriesAuthorizedToWork: string
  canStartImmediately: "yes" | "no"
  remoteSetting: "yes" | "no"
  siteSetting: "yes" | "no"
  hybridSetting: "yes" | "no"
}

export type Qualification = {
  institutionName: string
  institutionType: string
  institutionCity: string
  institutionState: string
  major: string
  degreeType: string
  gpa: string
  startDate: string
  endDate: string
  _id: string
}

export type Experience = {
  jobTitle: string
  companyName: string
  location: string
  experienceType: string
  startDate: string
  endDate: string
  description: string
  _id: string
}

export type PersonalInfo = {
  firstName: string
  lastName: string
  email: string
  phoneNo: string
  state: string
  city: string
  country: string
  countryCode: string
  gender: string
}

export type Language = {
  language: string
  proficiency: string
  _id: string
}

export type Certification = {
  certificationTitle: string
  startDate: string
  endDate: string
  certificationUrl: string
  _id: string
}

export type Skill = {
  skill: string
  yearsOfExperience: string
  _id: string
}

export type SocialLinks = {
  github: string
  linkedin: string
  dribble: string
  portfolio: string
  otherLink: string
}

export type Achievement = {
  awardTitle: string
  issuer: string
  startDate: string
  endDate: string
  description: string
  _id?: string
}

export type Resume = {
  socialMediaLinks: SocialLinks
  personalInformation: PersonalInfo
  formData: Miscellaneous
  _id?: string
  userId?: string
  resumeName: string
  resumeUrl: string
  experiences: Experience[]
  qualifications: Qualification[]
  skills: Skill[]
  languagesList: Language[]
  achievements: Achievement[]
  certifications: Certification[]
  coverLetter: string
  deleted?: string
  isComplete?: boolean
  projects?: []
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export type ResumeState = {
  resume: Resume
  title: string
  dateAddedAt: string
  updatedAt: string
  _id: string
}

export type SearchProps = {
  q: string
  jobType?: "F" | "C" | "I" | "O"
  location?: string
  time?: string
  experience?: "1" | "2" | "3" | "4" | "5" | "6"
  workType?: "1" | "2" | "3"
  target: string
}

export type DashboardForm = {
  q: string
  target: string
  plateform: string
  profile_id: string
  location?: SearchProps["location"]
  jobType?: SearchProps["jobType"]
  workType?: SearchProps["workType"]
  experience?: SearchProps["experience"]
}

export type ResumeList = {
  _id: string
  name: string
  status: "Completed" | "Not Completed"
}

export type Job = {
  company: string
  id: string
  title: string
  url: string
  tabURL: string
  selected?: boolean
}

export type JobHistory = {
  job: Job
  status: "applied" | "rejected" | "interviewed" | "offer" | "hired" | "skipped"
  dateApplied: string
  resumeId: string
  resumeTitle: string
}

export type Question = {
  parentEl: HTMLDivElement
  inputEl: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  label: string
  type: "mcq" | "selection" | "text" | "checkbox"
  required: boolean
  listbox: boolean
  numeric: boolean
}

export type ShowModalType = {
  type: "showModal"
  job?: Job // Replace with actual Job type
  currentIndex: number
  totalJobsApply: number
  resume: Resume
  response?: {
    message: "applied" | "skipped" | "stop" | "error"
    error?: string
  }
}
export type ApplyType = {
  type: "applyJob"
  job?: Job // Replace with actual Job type
  currentIndex: number
  totalJobsApply: number
  resume: Resume
  response?: {
    message: "applied" | "skipped" | "stop" | "error"
    error?: string
  }
}

export type ScrapperType = {
  type: "getJobs"
  params: SearchProps
  excludeCompanies: string[]
  response?: {
    results: Job[]
    error: string
  }
}

export type ExternalMessage =
  | ApplyType
  | ScrapperType
  | ShowModalType
  | { type: "activateTab"; response?: "Tab Activated!" }
  | { type: "isExtensionInstalled"; response?: { installed: boolean } }

// Helper type to extract response type from message
export type ExtResp<T extends ExternalMessage["type"]> = Extract<
  ExternalMessage,
  { type: T }
> extends { response?: infer R }
  ? R
  : void
