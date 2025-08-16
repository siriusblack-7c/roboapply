import { PieChart, Pie, Cell } from "recharts"
import { useContext } from "react"

import Heading from "@/src/components/Heading"
import GradientButton from "@/src/components/GradientButton"
import { dashboardContext } from "../store"

function ResultReport() {
  const { jobsFound, applyResults, loading, dispatch } =
    useContext(dashboardContext)

  const chartData = [
    {
      name: "Applied",
      value: applyResults.filter((result) => result.status == "applied").length
    },
    {
      name: "Failed",
      value: applyResults.filter((result) => result.status == "skipped").length
    }
  ]

  function onstartNewSearch() {
    dispatch({ type: "showComponent", payload: "home" })
    dispatch({ type: "applyResults", payload: [] })
    dispatch({ type: "jobsFound", payload: [] })
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading type="h1">Application Results</Heading>
        <GradientButton onClick={onstartNewSearch}>
          Start New Search
        </GradientButton>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 rounded-md bg-inputBackGround p-2 pl-4 pr-8">
          <span className="text-white text-base font-semibold">Status</span>
          <span className="">{loading ? "Applying" : "Completed"}</span>
        </div>
        <div className="flex flex-col gap-2 rounded-md bg-inputBackGround p-2 pl-4 pr-8">
          <span className="text-white text-base font-semibold">
            Total Jobs Applied
          </span>
          <span>
            {applyResults.length}/
            {jobsFound.filter((job) => job.selected).length}
          </span>
        </div>
      </div>
      <div className="flex flex-row sm:flex-col gap-5">
        {/* Result Chart */}
        <PieChart className=" *:outline-none  " width={350} height={250}>
          <Pie
            className="outline-none"
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            legendType="circle"
            outerRadius={80}
            label={(props) => `${props.name}: ${props.value}`}>
            <Cell fill="rgba(255, 193, 7, 1)" /> {/* Applied */}
            <Cell fill="#ff7f7f" /> {/* Failed */}
          </Pie>
          {/* Centered text */}
          <text
            x={175} // half of width
            y={115} // half of height
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14}
            fontWeight="bold"
            fill="#fff">
            {/* percentage */}
            {`${getPercentage(
              jobsFound.filter((job) => job.selected).length,
              applyResults.filter((job) => job.status == "applied").length
            )}%`}
          </text>
          <text
            x={175} // half of width
            y={135} // half of height
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14}
            fontWeight="bold"
            fill="#fff">
            {"Succes Rate"}
          </text>
        </PieChart>

        <div className="bg-w flex flex-col gap-2"></div>
      </div>
    </>
  )
}

function getPercentage(total: number, applied: number) {
  return ((applied / total) * 100).toFixed(0)
}

export default ResultReport
