import React, { useState, useEffect, useRef } from "react"
import DashBoardLayout from "../../../dashboardLayout"
import Button from "@/src/components/Button/index"
import Setting from "@/src/assets/Setting.svg"
import {
  PlusOutlined,
  DownOutlined,
  CalendarOutlined,
  CodeOutlined
} from "@ant-design/icons"
import { Select, Dropdown } from "antd"

import CircularIndeterminate from "../../../components/loader/circular"

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com"

const LiveInterview = () => {
  const [loadingLoader, setLoadingLoader] = useState(false)
  const [isFirstTabActive, setFirstTabActive] = useState(true)
  const [isLVModalVisible, setLVModalVisible] = useState(false)

  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center space-x-2">
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
        <div className="flex items-center space-x-2">
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

  return (
    <>
      {loadingLoader && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <CircularIndeterminate />
        </div>
      )}
      <DashBoardLayout>
        <div className="bg-almostBlack w-full h-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
          {/* scroll to the bottom */}
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
                    <Button
                      // onClick={() => setActiveComponent("platform")}
                      className="py-4 flex items-center  space-x-2 w-full justify-center text-xs md:text-xl whitespace-nowrap font-semibold rounded-lg bg-none text-primary border border-primary px-4">
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
                      {/* optional sort icon */}
                      <span className="ml-1">⇅</span>
                    </div>
                    <div className="py-3 px-4 flex items-center">
                      Appointment
                      {/* optional sort icon */}
                      <span className="ml-1">⇅</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </>
  )
}

export default LiveInterview
