import Button from "@/src/components/Button/index"
import { Select, DatePicker } from "antd"
import { useState } from "react"
import Upgrade from "@/src/assets/upgradeIcon.svg"

import moment from "moment"

interface InterviewModalProps {
  specialization: string
  handleInterviewModalVisible: (visible: boolean) => void
  cancel: () => void
}

const InterviewModal = ({
  specialization,
  handleInterviewModalVisible,
  cancel
}: InterviewModalProps) => {
  const [selectedResume, setSelectedResume] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] =
    useState(specialization)
  const [scheduleType, setScheduleType] = useState("immediately")
  const [scheduleDateTime, setScheduleDateTime] = useState(null)
  const [timeZone, setTimeZone] = useState("UTC-07:00 America/Los_Angeles")
  const [additionalContext, setAdditionalContext] = useState("")

  const handleLaunch = () => {
    // Handle launch logic here
    handleInterviewModalVisible(false)
  }

  const handleSaveForLater = () => {
    // Handle save for later logic here
    handleInterviewModalVisible(false)
  }

  const handleScheduleTypeChange = (type) => {
    setScheduleType(type)
    if (type === "datetime") {
      setScheduleDateTime(moment()) // Default to current time
    } else {
      setScheduleDateTime(null)
    }
  }

  const handleModalCancel = () => {
    cancel()
    setSelectedResume("")
    setSelectedRole("")
    setAdditionalContext("")
    setScheduleType("immediately")
    setScheduleDateTime(null)
    setTimeZone("UTC-07:00 America/Los_Angeles")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#333333] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">
            Start Your Next Interview
          </h2>
          <button onClick={handleModalCancel} className="text-white text-2xl">
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[#CCCCCC] block mb-3">
              {" "}
              <b>Resume</b> <span className="text-sm">optional</span>
            </label>
            <Select
              size="large"
              className="w-full text-white bg-[#454545] rounded"
              placeholder="Resume (optional)"
              value={selectedResume}
              onChange={setSelectedResume}
              options={[
                { label: "Resume Example.pdf", value: "ResumeExample.pdf" },
                {
                  label: "Resume Example2.pdf",
                  value: "ResumeExample2.pdf"
                }
              ]}
            />
          </div>
          <div>
            <label className="text-[#CCCCCC] block mb-3">
              <b>Role</b> <span className="text-sm">optional</span>
            </label>
            <Select
              size="large"
              className="w-full text-white bg-[#454545] rounded"
              placeholder="Role (optional)"
              value={selectedRole}
              onChange={setSelectedRole}
              options={[
                {
                  label: "Position Example @ Company Example",
                  value: "PositionExample@CompanyExample"
                },
                {
                  label: "Position Example2 @ Company Example2",
                  value: "PositionExample2@CompanyExample2"
                }
              ]}
            />
          </div>
          <div>
            <div className="flex justify-between items-center text-center mb-3">
              <label className="text-[#CCCCCC] block mb-1">
                <b>Specialization (S)</b>
                <span className="text-sm"> optional</span>
              </label>
              <p className="text-white text-sm flex items-center">
                <span>Upgrade Now</span>
                <img src={Upgrade} alt="" />
              </p>
            </div>

            <Select
              size="large"
              className="w-full text-white bg-[#454545] rounded"
              value={selectedSpecialization}
              onChange={setSelectedSpecialization}
              options={[
                { label: "General", value: "General" },
                { label: "Mock Interview", value: "mock" }
              ]}
            />
          </div>
          <div>
            <div className="flex justify-between items-center text-center mb-3">
              <label className="text-white block mb-1">
                <b>Additional Context</b>
              </label>
              <p className="text-white text-sm flex items-center">
                <span>Upgrade Saved Context</span>
                <img src={Upgrade} alt="" />
              </p>
            </div>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Lorem ipsum dolor sit amet consectetur. Blandit ut malesuada ac morbi erat.Lorem ipsum dolor sit amet consectetur. Blandit ut malesuada ac morbi erat.Lorem ipsum dolor sit amet consectetur. Blandit ut malesuada ac morbi erat."
              className="w-full p-2 bg-[#454545] text-white rounded h-24 resize-none custom-scrollbar"
            />
          </div>
          <div>
            <div className="flex space-x-4 bg-[#454545] p-2 rounded-md">
              <Button
                onClick={() => handleScheduleTypeChange("immediately")}
                className={`p-3 px-5 flex-1 text-white rounded ${
                  scheduleType === "immediately"
                    ? "bg-gradient-to-b from-gradientStart to-gradientEnd"
                    : "bg-[#454545]"
                }`}>
                Immediately
              </Button>
              <Button
                onClick={() => handleScheduleTypeChange("datetime")}
                className={`p-3 px-5 flex-1 text-white rounded ${
                  scheduleType === "datetime"
                    ? "bg-gradient-to-b from-gradientStart to-gradientEnd"
                    : "bg-[#454545]"
                }`}>
                Set Date and Time
              </Button>
            </div>

            {scheduleType === "datetime" && (
              <div className="mt-2 space-y-2">
                <p className="my-4 font-bold">When</p>
                <div className="flex space-x-4">
                  <DatePicker
                    value={scheduleDateTime}
                    onChange={setScheduleDateTime}
                    className="w-full text-white bg-[#454545] rounded"
                    placeholder="Pick a date"
                  />
                  <Select
                    value={
                      scheduleDateTime
                        ? moment(scheduleDateTime).format("LT")
                        : ""
                    }
                    // onChange={
                    //   (time) =>
                    //   setScheduleDateTime(
                    //     moment(
                    //       `${moment(scheduleDateTime).format(
                    //         "YYYY-MM-DD"
                    //       )} ${time}`,
                    //       "YYYY-MM-DD LT"
                    //     )
                    //   )
                    // }
                    className="w-full text-white bg-[#454545] rounded"
                    placeholder="Select your time"
                    options={[
                      { label: "12:00 AM", value: "12:00 AM" },
                      { label: "1:00 AM", value: "1:00 AM" }
                      // Add more time options as needed
                    ]}
                  />
                </div>
                <p className="my-4 font-bold">Timezone</p>
                <Select
                  value={timeZone}
                  onChange={setTimeZone}
                  className="w-full text-white bg-[#454545] rounded"
                  placeholder="Time Zone"
                  options={[
                    {
                      label: "UTC-07:00 America/Los_Angeles",
                      value: "UTC-07:00 America/Los_Angeles"
                    },
                    {
                      label: "UTC+09:00 Asia/Tokyo",
                      value: "UTC+09:00 Asia/Tokyo"
                    }
                  ]}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-4 space-x-4">
          <div className="flex gap-4">
            <Button
              onClick={handleLaunch}
              className="p-2 px-4 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded">
              Launch
            </Button>
            <Button
              onClick={handleSaveForLater}
              className="p-2 px-4 bg-[#454545] text-white rounded">
              Save for Later
            </Button>
          </div>
          <Button
            onClick={handleModalCancel}
            className="p-2 px-4 bg-[#454545] text-white rounded">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewModal
