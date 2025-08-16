import React, { useState, useRef, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"

import LimitCard from "../ui/LimitCard"
import { successToast, errorToast } from "../../../components/Toast"

import { ExternalMessage, ExtResp } from "@types"

import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight
} from "react-icons/fa"
import { DashboardForm, ResumeList, SearchProps } from "@types"
import SearchForm from "../ui/SearchForm"
import GradientButton from "../../../components/GradientButton"
import IntegratedPlatforms from "../ui/IntegratedPlatforms"
import { dashboardContext } from "../store"
import { getAllResumes, getResumeDetails } from "@/src/api/functions"
import {
  activateTab,
  extensionURL,
  getResponseFromExtension,
  isExtensionInstalled
} from "@/src/extension"

const DashboardHome = () => {
  const dispatch = useContext(dashboardContext).dispatch
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<Slider>(null) // Reference to the Slider

  const [resumeList, setResumeList] = useState<ResumeList[]>([])
  const [loadingResume, setLoadingResume] = useState(false)

  const [loading, setLoading] = useState(false)

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentSlide(next) // Update slide index before change
  }

  const data = [
    {
      jobLimit: 100,
      progress: 25,
      jobsLeft: 20,
      label: "80% used, today - 10 Jobs Applied",
      title: "Daily Job Limit",
      jobsLeftLabel: "Jobs Limit Left- "
    },
    {
      jobLimit: "Unlimited",
      label: "You are subscribed to Unlimited Plan",
      title: "Your Plan Details",
      jobsLeftLabel: "Lifetime Access"
    },
    {
      jobLimit: 100,
      progress: 80,
      jobsLeft: 20,
      label: "80% used, today - 10 Jobs Applied",
      title: "Total Jobs Applied",
      jobsLeftLabel: "Jobs Limit Left- "
    }
  ]

  const handleSearch = async (values: DashboardForm) => {
    if (!(await isExtensionInstalled())) {
      alert("Please install the RoboApply extension to continue!")
      return window.open(extensionURL, "_blank")
    }

    if (!values.q || values?.q?.trim() === "") {
      return alert("Please enter a valid search term.")
    }

    try {
      setLoading(true)
      const params: SearchProps = values
      const { error, resume } = await getResumeDetails(values.profile_id)
      if (error || !resume) {
        console.log({ errorInGetResumeDetails: error })
        errorToast(error)
        setLoading(false)
        return
      }

      if (!resume?.formData?.experience?.trim()) {
        errorToast("Please add experience to your resume to continue!")
        setLoading(false)
        return
      }

      dispatch({ type: "selectedResume", payload: resume })

      const response = await getResponseFromExtension({
        type: "getJobs",
        params,
        excludeCompanies:
          resume?.formData?.companiesExclude
            ?.split(",")
            ?.map((c) => c.trim()) || []
      })

      await activateTab()

      if (response?.error) {
        console.error("Error fetching jobs:", response.error)
        return alert("Error scrapping jobs: " + response.error)
      }

      if (response?.results?.length === 0) {
        alert("No jobs found for the given search criteria.")
      }

      dispatch({ type: "jobsFound", payload: response?.results || [] })
      dispatch({ type: "showComponent", payload: "jobsFound" })
    } catch (error) {
      console.error("Error scraping jobs:", error)
      alert("Something went wrong, while scraping jobs!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoadingResume(true)
    getAllResumes()
      .then((res) => {
        if (res.error) {
          console.log("Error fetching resumes:", res.error)
          errorToast(res.error)
        }
        if (res.resumes) {
          setResumeList(res.resumes)
        }
      })
      .finally(() => {
        setLoadingResume(false)
      })

    // Remove extension-related data from localStorage when the dashboard loads
    localStorage.removeItem("extensionStatus")
    localStorage.removeItem("platformName")
    localStorage.removeItem("resumeName")
    localStorage.removeItem("edited")
    localStorage.removeItem("resumeResponse")
    localStorage.removeItem("resumeUrlPath")
    localStorage.removeItem("roboapplyData")

    console.log("🧹 Removed extensionStatus and platformName from localStorage")
  }, [])

  return (
    <>
      <div className="flex justify-between   items-stretch w-full rounded-xl pb-2  ">
        <p className="text-2xl font-semibold">Overview</p>
        <GradientButton className="" onClick={() => navigate("/pricingPlan")}>
          Upgrade Plan
        </GradientButton>
      </div>

      <div className="">
        <div className="hidden md:flex items-stretch gap-4 w-full  rounded-xl ">
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 ">
                <LimitCard
                  jobLimit={item.jobLimit}
                  progressValue={item.progress}
                  jobsLeft={item.jobsLeft}
                  label={item.label}
                  title={item.title}
                  jobsLeftLabel={item.jobsLeftLabel}
                />
              </div>
              {/* {index < data.length - 1 && (
                  <div className="hidden lg:flex items-center">
                    <div className="h-full border-l border-dashed border-gray-300 mx-4"></div>
                  </div>
                )} */}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex  justify-center items-center">
        <div className="block md:hidden w-72 xxs:w-[20rem] xms:w-96 py-5 ">
          <Slider {...settings} ref={sliderRef}>
            {data.map((item, index) => (
              <div key={index}>
                <LimitCard
                  jobLimit={item.jobLimit}
                  progressValue={item.progress}
                  jobsLeft={item.jobsLeft}
                  label={item.label}
                  title={item.title}
                  jobsLeftLabel={item.jobsLeftLabel}
                />
                <div className="h-full border-l border-dashed border-gray-300 mx-4"></div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div className="flex md:hidden justify-center gap-4 mb-6">
        <FaRegArrowAltCircleLeft
          className="text-3xl text-gray-500 hover:text-white cursor-pointer"
          onClick={() => sliderRef.current?.slickPrev()}
        />
        <FaRegArrowAltCircleRight
          className="text-3xl text-gray-500 hover:text-white cursor-pointer"
          onClick={() => sliderRef.current?.slickNext()}
        />
      </div>

      {/* Jobs Search Form */}
      <SearchForm
        loading={loadingResume}
        loadingResume={loadingResume}
        disabled={loadingResume}
        resumes={resumeList}
        onFinish={handleSearch}
      />

      {/* Integrated Platforms */}
      <IntegratedPlatforms />
    </>
  )
}

export default DashboardHome
