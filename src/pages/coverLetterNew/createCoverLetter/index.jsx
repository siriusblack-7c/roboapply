import React, { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { errorToast } from "../../../components/Toast"
import uploadResumeIcon from "../../../assets/resumeBuilder/uploadResumeIcon.svg"
import createResumeIcon from "../../../assets/resumeBuilder/createResumeIcon.svg"
import DashboardNavbar from "../../../dashboardNavbar"
import LoaderBar from "../../../components/loader/LoaderBar"
import DashBoardLayout from "../../../dashboardLayout"
import API_ENDPOINTS from "../../../api/endpoints"

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com"

const CreateCoverLetter = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]

    if (file) {
      const validFormats = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ]

      if (!validFormats.includes(file.type)) {
        errorToast(
          "Invalid file format. Please upload a .doc, .docx, or .pdf file."
        )
        return
      }

      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINTS.FileuploadResumeBuilder}`,
          {
            method: "POST",
            body: formData
          }
        )

        const result = await response.json()
        console.log("Upload Result:", result)

        for (const [key, value] of Object.entries(result)) {
          localStorage.setItem(key, JSON.stringify(value))
        }
        navigate("/scan-resume/create")
      } catch (error) {
        console.error("File upload error:", error)
        errorToast("Error uploading file.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleUploadResumeClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleCreateResumeClick = () => {
    navigate("/dashboard-cover")
  }

  return (
    <div className="flex flex-col h-screen bg-almostBlack">
      {loading ? (
        <>
          <header>
            <DashboardNavbar />
          </header>
          <div className="flex items-center justify-center h-[75vh]">
            <LoaderBar />
          </div>
        </>
      ) : (
        <DashBoardLayout>
          <div className="bg-almostBlack w-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
            <div className="w-full p-3 md:p-10">
              <div className="flex items-center justify-between md:px-7">
                <p className="text-primary text-xl md:text-3xl font-medium">
                  Cover Letter
                </p>
              </div>

              {/* Choose how to make cover letter */}
              <div className="items-center justify-between text-center pt-5 md:pt-28 pb-10 md:pb-20 space-y-5 md:space-y-10">
                <p className="text-primary text-xl md:text-2xl font-semibold">
                  How will you make your cover letter?
                </p>
                <p className="text-primary text-lg font-medium">
                  Build a free cover letter that gets you interviewed by
                  employers
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:space-x-20">
                <div
                  className="border border-primary rounded-md px-5 md:px-20 py-20 items-center justify-center text-center cursor-pointer "
                  onClick={handleCreateResumeClick}>
                  <img
                    src={createResumeIcon}
                    className="mx-auto"
                    alt="Create Cover Letter"
                    loading="lazy"
                  />
                  <p className="text-primary text-2xl font-medium pt-3">
                    Start from scratch
                  </p>
                  <p className="text-lightestGrey text-base font-normal">
                    We will guide you with our AI helper
                  </p>
                  <p className="text-lightestGrey text-base font-normal">
                    step-by-step
                  </p>
                </div>

                <div
                  className="border border-primary rounded-md px-5 md:px-20 py-20 items-center justify-center text-center cursor-pointer"
                  onClick={handleUploadResumeClick}>
                  <img
                    src={uploadResumeIcon}
                    className="mx-auto"
                    alt="Upload Resume"
                    loading="lazy"
                  />
                  <p className="text-primary text-2xl font-medium pt-3">
                    Import from resume
                  </p>
                  <p className="text-lightestGrey text-base font-normal">
                    We will use your resume to create a
                  </p>
                  <p className="text-lightestGrey text-base font-normal">
                    cover letter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DashBoardLayout>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".doc,.docx,.pdf"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </div>
  )
}

export default CreateCoverLetter
