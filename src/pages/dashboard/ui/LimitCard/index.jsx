import React from "react"
import ProgressBar from "../../../../components/progressBar"

const LimitCard = ({
  jobLimit,
  jobsLeft,
  progressValue,
  title,
  jobsLeftLabel,
  label,
  className
}) => {
  return (
    <>
      <div className={`bg-inputBackGround py-3 px-5 rounded-lg ${className}`}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between  items-center space-x-10">
            <p className="text-primary text-base md:text-lg  whitespace-nowrap font-semibold">
              {title}
            </p>
            <p className="text-primary   text-sm md:text-sm font-medium  text-center rounded-lg">
              {jobLimit}
            </p>
          </div>
          <div>
            <ProgressBar label={label} progress={progressValue} />
          </div>

          <div className="flex gap-2 text-sm font-semibold text-primary">
            <p>{jobsLeftLabel} </p>
            <p>{jobsLeft}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LimitCard
