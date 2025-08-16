import { Job, JobHistory, Resume } from "@types"
import { createContext, ReactNode, useReducer } from "react"
import { dummyJobs } from "../JobsFound"

interface ReportProps {
  loading: boolean
  applyResults: JobHistory[]
  jobsFound: Job[]
}

let state = {
  showComponent: "home" as "home" | "ResultReport" | "jobsFound",
  loading: false as boolean,
  selectedResume: {} as Resume,
  applyResults: [] as JobHistory[],
  jobsFound: dummyJobs as Job[]
}

export const initialState = {
  dispatch: <K extends keyof typeof state>({
    type,
    payload
  }: {
    type: K
    payload: (typeof state)[K]
  }) => {
    // Your dispatch logic here
  },
  ...state
}

export const dashboardContext = createContext(initialState)

function reducer(
  state: typeof initialState,
  action: {
    type: keyof typeof state
    payload: any
  }
) {
  switch (action.type) {
    case "showComponent":
      return { ...state, [action.type]: action.payload }

    default:
      return { ...state, [action.type]: action.payload }
  }
}

function DashboardContextProvider({ children }: { children: ReactNode }) {
  const [newState, dispatch] = useReducer(reducer, initialState)

  return (
    <dashboardContext.Provider value={{ ...newState, dispatch }}>
      {children}
    </dashboardContext.Provider>
  )
}

export default DashboardContextProvider
