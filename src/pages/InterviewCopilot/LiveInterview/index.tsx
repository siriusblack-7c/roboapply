import React, { useState, useEffect, useRef } from "react"
import DashBoardLayout from "../../../dashboardLayout"
import Button from "@/src/components/Button/index"
import Setting from "@/src/assets/Setting.svg"
import Upgrade from "@/src/assets/upgradeIcon.svg"
import {
  PlusOutlined,
  DownOutlined,
  CalendarOutlined,
  CodeOutlined
} from "@ant-design/icons"
import { Select, Dropdown, DatePicker } from "antd"
import CircularIndeterminate from "../../../components/loader/circular"
import { Spin } from "antd"
import moment from "moment" // For date handling

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com"

const LiveInterview = () => {
  const [loadingLoader, setLoadingLoader] = useState(false)
  const [isFirstTabActive, setFirstTabActive] = useState(true)
  const [isLVModalVisible, setLVModalVisible] = useState(false)
  const [isInterviewModalVisible, setInterviewModalVisible] = useState(false)
  const [selectedResume, setSelectedResume] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] =
    useState("General")
  const [additionalContext, setAdditionalContext] = useState("")
  const [scheduleType, setScheduleType] = useState("immediately")
  const [scheduleDateTime, setScheduleDateTime] = useState(null)
  const [timeZone, setTimeZone] = useState("UTC-07:00 America/Los_Angeles")
  const [isSessionLoading, setSessionLoading] = useState(false)

  const items = [
    {
      key: "1",
      label: (
        <div
          className="flex items-center space-x-2"
          onClick={() => handleSpecializationSelect("General")}>
          <CalendarOutlined />
          <span>General</span>
        </div>
      )
    },
    {
      type: "divider"
    },
    {
      key: "2",
      type: "group",
      label: "Specialized Skills"
    },
    {
      key: "3",
      label: (
        <div
          className="flex items-center space-x-2"
          onClick={() => handleSpecializationSelect("Coding Copilot")}>
          <CodeOutlined />
          <span>Coding Copilot</span>
        </div>
      )
    }
  ]

  const fileInputRef = useRef(null)

  const handleUpcoming = () => {
    setFirstTabActive(true)
  }

  const handleCompleted = () => {
    setFirstTabActive(false)
  }

  const handleMockupInterview = () => {}

  const handleLiveInterview = () => {
    setLVModalVisible((prev) => !prev)
  }

  const handleSpecializationSelect = (specialization) => {
    setSelectedSpecialization(specialization)
    if (specialization === "General") {
      setInterviewModalVisible(true)
    }
    if (specialization === "Coding Copilot") {
      setSessionLoading(true)
    }
  }

  const handleScheduleTypeChange = (type) => {
    setScheduleType(type)
    if (type === "datetime") {
      setScheduleDateTime(moment()) // Default to current time
    } else {
      setScheduleDateTime(null)
    }
  }

  const handleLaunch = () => {
    // Handle launch logic here
    setInterviewModalVisible(false)
  }

  const handleSaveForLater = () => {
    // Handle save for later logic here
    setInterviewModalVisible(false)
  }

  const handleCancel = () => {
    setInterviewModalVisible(false)
    setSelectedResume("")
    setSelectedRole("")
    setSelectedSpecialization("General")
    setAdditionalContext("")
    setScheduleType("immediately")
    setScheduleDateTime(null)
    setTimeZone("UTC-07:00 America/Los_Angeles")
  }

  return (
    <>
      {loadingLoader && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <CircularIndeterminate />
        </div>
      )}
      <DashBoardLayout>
        <div className="bg-almostBlack w-full h-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
          <div className="w-full px-5 md:px-10">
            <div className="pb-10 pt-10 flex justify-between items-center gap-5">
              <div className="flex flex-col w-full gap-8">
                <p className="font-bold text-3xl mb-3">Interviews</p>
                <div className="flex justify-between w-full">
                  <div className="text-[#CCCCCC] text-xl flex-1">
                    Create various types of interviews across multiple fields
                    and access professional <br />
                    insights from each one.
                  </div>
                  <div className="flex-3">
                    <Button className="py-4 flex items-center space-x-2 w-full justify-center text-xs md:text-xl whitespace-nowrap font-semibold rounded-lg bg-none text-primary border border-primary px-4">
                      <img src={Setting} />
                      <span> Setting </span>
                    </Button>
                  </div>
                </div>
                <div className="flex w-fit bg-[#454545] p-2 rounded-lg">
                  <Button
                    onClick={handleUpcoming}
                    className={`p-3 px-5 flex items-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg ${
                      isFirstTabActive &&
                      "bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                    }`}>
                    Upcoming
                  </Button>
                  <Button
                    onClick={handleCompleted}
                    className={`p-3 px-5 flex items-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg ${
                      !isFirstTabActive &&
                      "bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                    }`}>
                    Completed
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Select
                    size="large"
                    className="text-white"
                    placeholder="All Types"
                    options={[
                      { label: "All Types", value: "workType", disabled: true },
                      { label: "Type 1", value: "1" },
                      { label: "Type 2", value: "2" },
                      { label: "Type 3", value: "3" }
                    ]}
                  />
                  <div className="flex w-fit gap-4 p-2 rounded-lg">
                    <Button
                      onClick={handleMockupInterview}
                      className="p-3 px-5 flex items-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg bg-[#454545] border border-[#404040]">
                      <PlusOutlined /> <span> Mock Interview </span>
                    </Button>
                    <Dropdown
                      menu={{ items }}
                      trigger={["click"]}
                      placement="bottomRight">
                      <Button className="p-3 px-5 flex items-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd">
                        <PlusOutlined /> <span>Live Interview</span>
                        <DownOutlined />
                      </Button>
                    </Dropdown>
                  </div>
                </div>

                <div className="w-full bg-[#454545] rounded-tl-md rounded-tr-md">
                  <div className="grid grid-cols-4 text-white font-semibold text-base">
                    <div className="py-3 px-4">Interview</div>
                    <div className="py-3 px-4">Status</div>
                    <div className="py-3 px-4 flex items-center">
                      Type
                      <span className="ml-1">⇅</span>
                    </div>
                    <div className="py-3 px-4 flex items-center">
                      Appointment
                      <span className="ml-1">⇅</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashBoardLayout>

      {isInterviewModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#333333] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">
                Start Your Next Interview
              </h2>
              <button onClick={handleCancel} className="text-white text-2xl">
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[#CCCCCC] block mb-1">
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
                <label className="text-[#CCCCCC] block mb-1">
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
                <div className="flex justify-between text-center">
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
                  options={[{ label: "General", value: "General" }]}
                  disabled
                />
              </div>
              <div>
                <div className="flex justify-between text-center">
                  <label className="text-white font-bold block mb-1">
                    Additional Context
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
                  // onScroll={(e) => {
                  //   const textarea = e.target
                  //   if (textarea.scrollHeight > textarea.clientHeight) {
                  //     textarea.classList.add("scrolling")
                  //     // Clear any existing timeout to reset the debounce
                  //     clearTimeout(textarea.scrollTimeout)
                  //     // Set a timeout to remove the scrolling class after scrolling stops (e.g., 200ms)
                  //     textarea.scrollTimeout = setTimeout(() => {
                  //       textarea.classList.remove("scrolling")
                  //     }, 200)
                  //   }
                  // }}
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
                onClick={handleCancel}
                className="p-2 px-4 bg-[#454545] text-white rounded">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {isSessionLoading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          role="alert"
          aria-live="polite">
          <div className="flex flex-col items-center gap-6 bg-[#333333] rounded-xl p-8 w-full max-w-sm shadow-lg ">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              </div>
              {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold animate-pulse">
                ⏳
              </div> */}
            </div>
            <p className="text-white font-bold text-xl text-center">
              Session Loading...
            </p>
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="alert"
                className="bg-[#4B555F] text-white p-3 rounded-md text-sm text-center animate-fade transform transition-all duration-300 animate-pulse" >
                Connecting to Copilot Server
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LiveInterview
