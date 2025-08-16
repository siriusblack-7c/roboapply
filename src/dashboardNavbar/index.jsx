import React, { useState, useEffect, useRef } from "react"
import logo from "../assets/logo.svg"
import profilePic from "../assets/profilePic.svg"
import { HiDotsVertical } from "react-icons/hi"
import { MdManageAccounts } from "react-icons/md"
import { RiLogoutBoxRLine } from "react-icons/ri"
import dashboardIcon from "../assets/dashboardIcons/dashboardIcon.svg"
import profileIcon from "../assets/dashboardIcons/profileIcon.svg"
import analyticsIcon from "../assets/dashboardIcons/AnalyticsIcon.svg"
import coverletterIcon from "../assets/dashboardIcons/coverLetterIcon.svg"
import resumeScoreIcon from "../assets/dashboardIcons/resumeScoreIcon.svg"
import interviewGuide from "../assets/dashboardIcons/interviewGuide.svg"
import aiscore from "../assets/dashboardIcons/aiscore.svg"
import { GiMoneyStack } from "react-icons/gi"
import { FaQuestionCircle } from "react-icons/fa"
import { FaRegMoneyBillAlt } from "react-icons/fa"
import { MdOutlineNoAccounts } from "react-icons/md"

import { IoIosNotificationsOutline } from "react-icons/io"
import { Link } from "react-router-dom"
import Button from "../components/Button"

const DashboardNavbar = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [notification, setNotification] = useState(true)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const menuRef = useRef(null)
  const notificationRef = useRef(null)
  const menuButtonRef = useRef(null)
  const notificationButtonRef = useRef(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data"))
    if (userData) {
      setFullName(
        userData.fullName || `${userData.firstName} ${userData.lastName}`
      )
      setEmail(userData.email)

      // Validate the image URL
      if (userData.imageUrl && userData.imageUrl.startsWith("http")) {
        setImageUrl(userData.imageUrl)
      } else {
        setImageUrl(profilePic) // Fallback to default image
      }
    }

    const handleClickOutside = (event) => {
      // Handle menu clicks
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
      }

      // Handle notification clicks
      if (
        notificationOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setNotificationOpen(false)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpen, notificationOpen])

  const toggleMenu = (e) => {
    e.stopPropagation()
    if (notificationOpen) setNotificationOpen(false)
    setMenuOpen(!menuOpen)
  }

  const toggleNotification = (e) => {
    e.stopPropagation()
    if (menuOpen) setMenuOpen(false)
    setNotificationOpen(!notificationOpen)
  }

  const handleLogout = () => {
    // console.log("object")
    localStorage.removeItem("access_token")
  }

  return (
    <nav className="flex justify-between items-center bg-almostBlack pt-8 pl-4 lg:pl-12 pb-8">
      <div>
        {/* <Link to="https://beta.robo-apply.com/">
          <img
            src={logo}
            alt="Logo"
            className="w-32 md:w-48 h-9"
            loading="lazy"
          />
        </Link> */}
        <a
          href="https://beta.robo-apply.com/"
          target="_blank"
          rel="noopener noreferrer">
          <img
            src={logo}
            alt="Logo"
            className="w-32 md:w-48 h-9"
            loading="lazy"
          />
        </a>
      </div>
      <div className="hidden  lg:flex">
        <div className=" mr-10 gap-2 flex">
          <div className="flex w-full justify-center items-center text-left space-x-2 bg-totalBlack rounded-xl">
            <img
              src={imageUrl}
              alt="Profile"
              className="w-12 h-12 p-1.5 pl-2 rounded-full"
              loading="lazy"
            />
            <div className="mt-2  pr-2">
              <p className="text-[14px] font-semibold text-primary">
                {fullName}
              </p>
              <p className="text-primary text-[11px] font-medium">{email}</p>
            </div>
            <Button
              onClick={toggleMenu} // Toggle the menu on button click
              className="flex items-center justify-center font-semibold w-full min-w-max h-12 px-2"
              ref={menuButtonRef}>
              <HiDotsVertical />
            </Button>
            {menuOpen && ( // Show menu if open
              <div
                ref={menuRef}
                className="hidden lg:block absolute right-20 top-16 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg">
                <Link
                  to="/dashboard"
                  className="flex gap-1 items-center justify-left px-4 py-2 text-white rounded-t-lg hover:bg-gray-700">
                  <img
                    src={dashboardIcon}
                    className="w-4 h-4 "
                    loading="lazy"
                  />
                  Home
                </Link>
                <Link
                  to="/edit-profile"
                  className="flex gap-1 items-center justify-left px-4 py-2 text-white rounded-t-lg hover:bg-gray-700">
                  <MdManageAccounts />
                  Edit Profile
                </Link>
                <Link
                  to="/billing"
                  className="flex gap-1 items-center justify-left px-4 py-2 text-white rounded-t-lg hover:bg-gray-700">
                  <FaRegMoneyBillAlt />
                  Account & Billing
                </Link>
                <Link
                  to="https://beta.robo-apply.com/pricing/"
                  className="flex gap-1 items-center justify-left px-4 py-2 text-white rounded-t-lg hover:bg-gray-700">
                  <GiMoneyStack />
                  Pricing
                </Link>
                <Link
                  to="/analytics"
                  className="flex gap-1 items-center justify-left px-4 py-2 text-white rounded-t-lg hover:bg-gray-700">
                  <img src={analyticsIcon} className="w-4 h-4" loading="lazy" />
                  Analytics
                </Link>

                <Link
                  to="https://app.robo-apply.com/faq/"
                  className="flex gap-1 items-center justify-left px-4 py-2 text-white rounded-t-lg hover:bg-gray-700">
                  <FaQuestionCircle />
                  Faq
                </Link>

                <Link
                  to="/"
                  className="flex gap-1 items-center justify-left px-4 py-2 text-white rounded-b-lg hover:bg-gray-700">
                  <RiLogoutBoxRLine />
                  Logout
                </Link>
              </div>
            )}
          </div>
          <div className="relative items-center justify-center flex">
            {/* Bell Icon */}
            <IoIosNotificationsOutline
              className="w-7 h-7 cursor-pointer"
              onClick={toggleNotification}
              ref={notificationButtonRef}
            />

            {notification && (
              <span
                className="absolute top-5 right-2 w-2 h-2 bg-dangerColor rounded-full"
                style={{
                  transform: "translate(50%, -50%)"
                }}></span>
            )}
            {notificationOpen && (
              <div
                ref={notificationRef}
                className="absolute right-0 top-0 mt-12 w-72 bg-gray-800 text-white rounded-lg shadow-lg p-4">
                <p className="font-semibold mb-2">Notifications</p>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <p className="text-sm">New job alert: Software Engineer</p>
                  </div>
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <p className="text-sm">Your resume has been reviewed</p>
                  </div>
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <p className="text-sm">Interview scheduled for 5th Oct</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hamburger Menu for Small Screens */}
      <div className="lg:hidden">
        <div className="flex gap-2 mr-3 bg-almostBlack">
          <div className="flex  bg-totalBlack rounded-xl ">
            <img
              src={imageUrl}
              alt="Profile"
              className="w-12 h-12 p-1.5 rounded-full"
              loading="lazy"
            />

            <Button
              onClick={toggleMenu} // Toggle the menu on button click
              className="flex items-center justify-center font-semibold w-full min-w-max h-12 px-2 "
              ref={menuButtonRef}>
              <HiDotsVertical />
            </Button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-4 top-20 mt-0 w-48 bg-gray-800 rounded-lg shadow-lg z-30">
                <Link
                  to="/dashboard"
                  className="flex gap-2 px-4 py-2 text-white rounded-t-lg hover:bg-gray-700">
                  <img src={dashboardIcon} className="w-4 h-4 " />
                  Dashboard
                </Link>
                <Link
                  to="/resume-manager"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <img src={profileIcon} className="w-4 h-4 " loading="lazy" />
                  Resume Manager
                </Link>
                <Link
                  to="/analytics"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <img
                    src={analyticsIcon}
                    className="w-4 h-4 "
                    loading="lazy"
                  />
                  Analytics
                </Link>
                <Link
                  to="/dashboard-cover"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <img
                    src={coverletterIcon}
                    className="w-4 h-4 "
                    loading="lazy"
                  />
                  AI Cover Letter
                </Link>
                <Link
                  to="/scan-resume"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <img
                    src={resumeScoreIcon}
                    className="w-4 h-4 "
                    loading="lazy"
                  />
                  AI Resume Builder
                </Link>

                <Link
                  to="/interview-Guide"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <img
                    src={interviewGuide}
                    className="w-4 h-4"
                    alt="Resume Score"
                    loading="lazy"
                  />
                  AI Interview Guide
                </Link>
                <Link
                  to="/scan"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <img
                    src={aiscore}
                    className="w-4 h-4"
                    alt="Resume Score"
                    loading="lazy"
                  />
                  AI Resume Score
                </Link>
                <Link
                  to="https://beta.robo-apply.com/pricing/"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <GiMoneyStack />
                  Pricing
                </Link>
                <Link
                  to="/edit-profile"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <MdManageAccounts />
                  Edit Profile
                </Link>
                <Link
                  to="/billing"
                  className="flex gap-1 items-center justify-left px-4 py-2 text-white rounded-t-lg hover:bg-gray-700">
                  <FaRegMoneyBillAlt />
                  Account & Billing
                </Link>
                <Link
                  to="https://app.robo-apply.com/faq/"
                  className="flex gap-2  px-4 py-2 text-white hover:bg-gray-700">
                  <FaQuestionCircle />
                  Faq
                </Link>

                <Link
                  to="/"
                  className="flex gap-2  px-4 py-2 text-white rounded-b-lg hover:bg-gray-700"
                  onClick={handleLogout}>
                  <RiLogoutBoxRLine />
                  Logout
                </Link>
              </div>
            )}
          </div>
          <div className="relative items-center justify-center flex">
            {/* Bell Icon */}
            <IoIosNotificationsOutline
              className="w-7 h-7 cursor-pointer"
              onClick={toggleNotification}
              ref={notificationButtonRef}
            />

            {notification && (
              <span
                className="absolute top-5 right-2 w-2 h-2 bg-dangerColor rounded-full"
                style={{
                  transform: "translate(50%, -50%)"
                }}></span>
            )}
            {notificationOpen && (
              <div
                ref={notificationRef}
                className="absolute right-0 top-1 mt-12 w-72 bg-gray-800 text-white rounded-lg shadow-lg p-4 z-20">
                <p className="font-semibold mb-2">Notification</p>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <p className="text-sm">New job alert: Software Engineer</p>
                  </div>
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <p className="text-sm">Your resume has been reviewed</p>
                  </div>
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <p className="text-sm">Interview scheduled for 5th Oct</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
