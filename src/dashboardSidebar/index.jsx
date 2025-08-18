import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import dashboardIcon from "../assets/dashboardIcons/dashboardIcon.svg"
import profileIcon from "../assets/dashboardIcons/profileIcon.svg"
import analyticsIcon from "../assets/dashboardIcons/AnalyticsIcon.svg"
import coverletterIcon from "../assets/dashboardIcons/coverLetterIcon.svg"
import resumeScoreIcon from "../assets/dashboardIcons/resumeScoreIcon.svg"
import interviewGuide from "../assets/dashboardIcons/interviewGuide.svg"
import LiveInterview from "../assets/dashboardIcons/LiveInterview.svg"
import AddYourPosition from "../assets/dashboardIcons/AddYourPosition.svg"
import AddYourResume from "../assets/dashboardIcons/AddYourResume.svg"
import AIInterviewCopilot from "../assets/dashboardIcons/AIInterviewCopilot.svg"

import aiscore from "../assets/dashboardIcons/aiscore.svg"
import sidebarContactUs from "../assets/logo.svg"
import { VscLayoutSidebarRight } from "react-icons/vsc"
import { VscLayoutSidebarLeft } from "react-icons/vsc"
import { RiContactsBookFill } from "react-icons/ri"
import { FaEnvelope } from "react-icons/fa6"
import { MdWifiCalling3 } from "react-icons/md"

const DashboardSidebar = () => {
  const location = useLocation()
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(
    () => JSON.parse(localStorage.getItem("isSidebarCollapsed")) || false
  )

  const [isCopilotVisible, setIsCopilotVisible] = useState(() =>
  ["/live-interview", "/add-your-resume", "/add-your-position"].some((path) =>
    location.pathname.startsWith(path)
  )
)

  useEffect(() => {
    localStorage.setItem(
      "isSidebarCollapsed",
      JSON.stringify(isSidebarCollapsed)
    )
  }, [isSidebarCollapsed])

  const isActive = (paths) =>
    paths.some((path) => {
      const normalizedPath = `/${path.replace(/^\/+/, "")}` // Ensure path starts with a single '/'
      return (
        location.pathname === normalizedPath ||
        location.pathname.startsWith(`${normalizedPath}/`)
      )
    })


  const handleCopilotClick = () => {
    setIsCopilotVisible((prev) => !prev)   // toggle visibility
  }
  
  const isCopilotRouteActive = isActive([
    "/live-interview",
    "/add-your-resume",
    "/add-your-position"
  ])

  const styles = {
    active:
      "text-primary px-3 py-3 w-48 rounded-lg bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] font-semibold",
    inactive:
      "text-primary px-3 py-3 w-48 rounded-lg hover:bg-gray-700 hover:text-purple-300 font-normal"
  }

  return (
    // <aside
    //   className={`h-full flex flex-col justify-between pb-14 ${
    //     isSidebarCollapsed ? "w-20" : "w-64"
    //   } p-4 space-y-4 bg-almostBlack border-t-dashboardborderColor border-r-dashboardborderColor border border-l-0 border-b-0 transition-width duration-300`}
    // >
    <aside
      className={`h-full flex flex-col pb-14 ${
        isSidebarCollapsed ? "w-20" : "w-64"
      } p-4 space-y-10 bg-almostBlack border-t-dashboardborderColor border-r-dashboardborderColor border border-l-0 border-b-0 transition-width duration-300`}>
      <nav className="flex flex-col space-y-4 ">
        <button
          className="text-primary  focus:outline-none flex justify-end mr-3.5"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}>
          {isSidebarCollapsed ? (
            <VscLayoutSidebarLeft className="w-6 h-6" />
          ) : (
            <VscLayoutSidebarRight className="w-6 h-6" />
          )}
        </button>

        <Link
          to="/dashboard"
          className={`flex items-center w-10 ${
            isActive(["/dashboard"])
              ? isSidebarCollapsed
                ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                : styles.active
              : isSidebarCollapsed
              ? "hover:bg-gray-700 p-3 rounded-full"
              : styles.inactive
          }`}>
          <img
            src={dashboardIcon}
            className="w-5 h-5"
            alt="Dashboard"
            loading="lazy"
          />
          {!isSidebarCollapsed && <span className="ml-2">Dashboard</span>}
        </Link>

        <Link
          to="/resume-manager"
          className={`flex items-center w-10 ${
            isActive(["/resume-manager"])
              ? isSidebarCollapsed
                ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                : styles.active
              : isSidebarCollapsed
              ? "hover:bg-gray-700 p-3 rounded-full"
              : styles.inactive
          }`}>
          <img
            src={profileIcon}
            className="w-5 h-5"
            alt="Resume Manager"
            loading="lazy"
          />
          {!isSidebarCollapsed && <span className="ml-2">Resume Manager</span>}
        </Link>

        <Link
          to="/analytics"
          className={`flex items-center w-10 ${
            isActive(["/analytics"])
              ? isSidebarCollapsed
                ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                : styles.active
              : isSidebarCollapsed
              ? "hover:bg-gray-700 p-3 rounded-full"
              : styles.inactive
          }`}>
          <img
            src={analyticsIcon}
            className="w-5 h-5"
            alt="Analytics"
            loading="lazy"
          />
          {!isSidebarCollapsed && <span className="ml-2">Analytics</span>}
        </Link>

        <Link
          to="/dashboard-cover"
          // to="/main-coverletter"
          className={`flex items-center w-10 ${
            isActive(["/dashboard-cover"])
              ? // isActive(["/main-coverletter"])
                isSidebarCollapsed
                ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                : styles.active
              : isSidebarCollapsed
              ? "hover:bg-gray-700 p-3 rounded-full"
              : styles.inactive
          }`}>
          <img
            src={coverletterIcon}
            className="w-5 h-5"
            alt="AI Cover Letter"
            loading="lazy"
          />
          {!isSidebarCollapsed && <span className="ml-2">AI Cover Letter</span>}
        </Link>

        <Link
          to="/scan-resume"
          className={`flex items-center w-10 ${
            isActive(["/scan-resume"])
              ? isSidebarCollapsed
                ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                : styles.active
              : isSidebarCollapsed
              ? "hover:bg-gray-700 p-3 rounded-full"
              : styles.inactive
          }`}>
          <img
            src={resumeScoreIcon}
            className="w-5 h-5"
            alt="Resume Score"
            loading="lazy"
          />
          {!isSidebarCollapsed && (
            <span className="ml-2">AI Resume Builder</span>
          )}
        </Link>

        <Link
          to="/interview-Guide"
          className={`flex items-center w-10 ${
            isActive(["/interview-Guide"])
              ? isSidebarCollapsed
                ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                : styles.active
              : isSidebarCollapsed
              ? "hover:bg-gray-700 p-3 rounded-full"
              : styles.inactive
          }`}>
          <img
            src={interviewGuide}
            className="w-5 h-5"
            alt="Interview Guide"
            loading="lazy"
          />
          {!isSidebarCollapsed && (
            <span className="ml-2">AI Interview Guide</span>
          )}
        </Link>

        <Link
          to="/live-interview"
          onClick={handleCopilotClick} // ensure submenu opens
          className={`${
            isCopilotVisible || isCopilotRouteActive ? "bg-gray-700" : ""
          } flex items-center p-3 rounded-lg`}>
          <img
            src={AIInterviewCopilot}
            className="w-5 h-5"
            alt="AI Interview Copilot"
            loading="lazy"
          />
          <p className="pl-2">AI Interview Copilot</p>
        </Link>

        {isCopilotVisible ? (
          <div className="border-l-2 border-[#676767] p-4">
            <Link
              to="/live-interview"
              className={`flex items-center w-10 ${
                isActive(["/live-interview"])
                  ? isSidebarCollapsed
                    ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                    : styles.active
                  : isSidebarCollapsed
                  ? "hover:bg-gray-700 p-3 rounded-full"
                  : styles.inactive
              }`}>
              <img
                src={LiveInterview}
                className="w-5 h-5"
                alt="Interview Guide"
                loading="lazy"
              />
              {!isSidebarCollapsed && (
                <span className="ml-2">Live Interview</span>
              )}
            </Link>

            <Link
              to="/add-your-resume"
              className={`flex items-center w-10 ${
                isActive(["/add-your-resume"])
                  ? isSidebarCollapsed
                    ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                    : styles.active
                  : isSidebarCollapsed
                  ? "hover:bg-gray-700 p-3 rounded-full"
                  : styles.inactive
              }`}>
              <img
                src={AddYourResume}
                className="w-5 h-5"
                alt="Interview Guide"
                loading="lazy"
              />
              {!isSidebarCollapsed && (
                <span className="ml-2">Add Your Resume</span>
              )}
            </Link>

            <Link
              to="/add-your-position"
              className={`flex items-center w-10 ${
                isActive(["/add-your-position"])
                  ? isSidebarCollapsed
                    ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                    : styles.active
                  : isSidebarCollapsed
                  ? "hover:bg-gray-700 p-3 rounded-full"
                  : styles.inactive
              }`}>
              <img
                src={AddYourPosition}
                className="w-5 h-5"
                alt="Interview Guide"
                loading="lazy"
              />
              {!isSidebarCollapsed && (
                <span className="ml-2">Add Your Position</span>
              )}
            </Link>
          </div>
        ) : (
          <></>
        )}

        <Link
          to="/scan"
          className={`flex items-center w-10 ${
            isActive(["/scan"])
              ? isSidebarCollapsed
                ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8] p-3 rounded-full"
                : styles.active
              : isSidebarCollapsed
              ? "hover:bg-gray-700 p-3 rounded-full"
              : styles.inactive
          }`}>
          <img
            src={aiscore}
            className="w-5 h-5"
            alt="AI Resume Score"
            loading="lazy"
          />
          {!isSidebarCollapsed && <span className="ml-2">AI Resume Score</span>}
        </Link>
      </nav>
      {/* Contact box */}
      {!isSidebarCollapsed && (
        <div className="w-full py-8 px-6  text-black border-2 border-purple rounded-xl space-y-5">
          <img
            src={sidebarContactUs}
            className="w-full h-auto"
            alt="Contact"
            loading="lazy"
          />
          <div className="text-primary flex flex-col justify-end items-center space-y-2">
            <Link
              to="https://beta.robo-apply.com/#contact"
              className="underline font-semibold gap-2 flex text-base items-center">
              Contact Us <RiContactsBookFill />
            </Link>
            <a
              href="mailto:info@robo-apply.com"
              className="gap-2 flex text-sm font-normal whitespace-nowrap items-center text-primary hover:underline">
              <FaEnvelope className="w-5 h-4" />
              info@robo-apply.com
            </a>

            <p className="gap-2 flex text-sm font-normal items-center">
              <MdWifiCalling3 className="w-5 h-5" />
              +1 (570) 397-4189
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}

export default DashboardSidebar
