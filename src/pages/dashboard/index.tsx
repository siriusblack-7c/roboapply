import { useContext } from "react"
import DashboardHome from "./home"
import DashboardContextProvider, { dashboardContext } from "./store"
import ResultReport from "./ResultReport"
import JobsFound from "./JobsFound"

import DashBoardLayout from "../../dashboardLayout"

function Dashboard() {
  return (
    <DashboardContextProvider>
      <DashboardContent />
    </DashboardContextProvider>
  )
}

// Move context usage to a child component
function DashboardContent() {
  const { showComponent } = useContext(dashboardContext)

  return (
    <DashBoardLayout>
      <div className=" flex flex-col gap-5 px-10 pt-10  w-full h-full ">
        {showComponent === "home" && <DashboardHome />}
        {showComponent === "jobsFound" && <JobsFound />}
        {showComponent === "ResultReport" && <ResultReport />}
      </div>
    </DashBoardLayout>
  )
}

export default Dashboard
