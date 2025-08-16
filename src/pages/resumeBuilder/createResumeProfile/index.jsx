import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LiaRobotSolid } from "react-icons/lia"
import DashBoardLayout from "../../../dashboardLayout"
import SimpleInputField from "../../../components/SimpleInputFields"
import urlImg from "../../../assets/resumeBuilder/urlImg.svg"
import { RiDeleteBin5Line } from "react-icons/ri"
import Button from "../../../components/Button"
import API_ENDPOINTS from "../../../api/endpoints"
import CircularIndeterminate from "../../../components/loader/circular"
import { errorToast, successToast } from "../../../components/Toast"
import TextAreaComponent from "../../../components/TextAreaComponent"

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com"

const CreateResumeProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    linkedin: "",
    website: [],
    summary: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  })

  const [websiteInput, setWebsiteInput] = useState("")

  const [aiGeneratedSummary, setAiGeneratedSummary] = useState("")
  const [showAiSummaryResponse, setShowAiSummaryResponse] = useState(false)
  const [isAISummaryLoading, setIsAISummaryLoading] = useState(false)

  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddWebsite = () => {
    if (websiteInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        website: [...prev.website, websiteInput.trim()]
      }))
      setWebsiteInput("")
    }
  }

  const handleDeleteWebsite = (index) => {
    setFormData((prev) => ({
      ...prev,
      website: prev.website.filter((_, i) => i !== index)
    }))
  }

  const handleNavigateToWebsite = (url) => {
    window.open(url, "_blank")
  }

  const handleContinue = () => {
    localStorage.setItem("resumeBuilderPersonalData", JSON.stringify(formData))
    const resumeTitle = localStorage.getItem("resumeTitle")

    setFieldErrors({})

    const requiredFields = [
      { field: "name", label: "Name" },
      { field: "jobTitle", label: "Job Title" },
      { field: "email", label: "Email" },
      { field: "phone", label: "Phone" },
      { field: "linkedin", label: "LinkedIn" },
      { field: "summary", label: "Summary" },
      { field: "address", label: "Address" },
      { field: "city", label: "City" },
      { field: "state", label: "State/Region" },
      { field: "postalCode", label: "Postal Code" },
      { field: "country", label: "Country" }
    ]

    const missingFields = requiredFields.filter(
      ({ field }) => !formData[field]?.trim()
    )

    if (missingFields.length > 0) {
      // Set error state for missing fields
      const newFieldErrors = {}
      missingFields.forEach(({ field }) => {
        newFieldErrors[field] = true
      })
      setFieldErrors(newFieldErrors)

      const missingFieldNames = missingFields
        .map(({ label }) => label)
        .join(", ")
      errorToast(
        `Please fill in the following required fields: ${missingFieldNames}`
      )
      return
    }

    if (!resumeTitle && !formData.name.trim()) {
      errorToast("Please enter your name atleast.")
      return
    }

    const finalFormData = {
      ...formData,
      resumeTitle: resumeTitle
    }

    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) {
      console.error("Access token is missing")
      errorToast("You must be logged in to continue.")
      return
    }

    setLoading(true)

    const storedResumeId = localStorage.getItem("ResumeBuilder-Id")
    const isUpdate = !!storedResumeId

    const url = isUpdate
      ? `${BASE_URL}${API_ENDPOINTS.UpdateResumeBuilder}/${storedResumeId}`
      : `${BASE_URL}${API_ENDPOINTS.CreateResumeBuilder}`

    fetch(url, {
      method: isUpdate ? "PATCH" : "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(finalFormData)
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Resume API response:", responseData)

        if (responseData.success) {
          successToast("Resume data partially saved!")

          const userId = responseData?.resume?._id
          if (userId) {
            localStorage.setItem("ResumeBuilder-Id", userId)
          }

          navigate("/scan-resume/addExperience")
        } else {
          errorToast("Failed to save partial resume data!")
          console.error("Resume save failed:", responseData)
        }
      })
      .catch((error) => {
        console.error("Error during resume save:", error)
        errorToast("Something went wrong while saving resume.")
      })
      .finally(() => {
        setLoading(false) // Ensure spinner stops in all cases
      })
  }

  const handleBack = () => {
    navigate("/scan-resume/create")
  }

  const handleAISummaryAddition = () => {
    setFormData((prev) => ({ ...prev, summary: aiGeneratedSummary }))
    setAiGeneratedSummary("")
    setShowAiSummaryResponse(false)
  }

  const tones = [
    "Professional",
    "Confident",
    "Concise/Direct",
    "Enthusiastic",
    "Results-Oriented",
    "Proactive",
    "Collaborative",
    "Analytical",
    "Strategic",
    "Positive",
    "Formal",
    "Authoritative",
    "Empathetic",
    "Persuasive"
  ]

  const getRandomTone = () => {
    const randomIndex = Math.floor(Math.random() * tones.length)
    return tones[randomIndex]
  }

  const handleAISummarySuggestion = async () => {
    if (!formData.jobTitle || !formData.summary) {
      errorToast(
        "Please fill in Job Title and Summary before using AI Summary Suggestion."
      )
      return
    }

    const summaryData = new FormData()
    summaryData.append("JobTitle", formData.jobTitle)
    summaryData.append("Summary", formData.summary)

    const randomTone = getRandomTone()
    summaryData.append("Tone", randomTone)

    setIsAISummaryLoading(true)

    setShowAiSummaryResponse(false)

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GenerateSummary}`,
        {
          method: "POST",
          body: summaryData
          // No need to set headers; browser will set the correct multipart boundary
        }
      )

      if (!response.ok) throw new Error("Failed to fetch AI summary suggestion")

      const data = await response.json()

      if (data?.Suggested_summary) {
        setAiGeneratedSummary(data.Suggested_summary)
        setShowAiSummaryResponse(true)
      } else {
        errorToast("No summary received from AI.")
      }
    } catch (error) {
      console.error("AI Summary Suggestion Error:", error)
      errorToast("Error generating AI summary suggestion.")
    } finally {
      setIsAISummaryLoading(false)
    }
  }

  useEffect(() => {
    const savedData = localStorage.getItem("resumeBuilderPersonalData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)

      // Remove old `websites` key if present
      delete parsedData.websites

      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        website: Array.isArray(parsedData.website)
          ? parsedData.website
          : parsedData.website
          ? [parsedData.website]
          : []
      }))
    }
  }, [])

  return (
    <>
      <DashBoardLayout>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <CircularIndeterminate />
          </div>
        ) : (
          <div className="flex flex-col h-full bg-almostBlack">
            <div className="bg-almostBlack w-full   border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
              <div className="w-full">
                <div className="w-full py-5 px-3">
                  <div className="flex items-center justify-center relative">
                    <div className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-stepperBackground text-primary">
                          1
                        </div>
                        <span className="text-primary text-xs md:text-sm mt-2 absolute top-12 ">
                          Profile
                        </span>
                      </div>
                      <div className="flex items-center ">
                        <div className=" w-5 md:w-28 lg:w-32 h-1 flex-grow border-t-2 "></div>
                        <div className=" text-lg  md:text-2xl">{`>`}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-stepperBackground text-primary">
                          2
                        </div>
                        <span className="text-primary text-xs md:text-sm mt-2 absolute top-12">
                          Experience
                        </span>
                      </div>
                      <div className="flex items-center ">
                        <div className=" w-5 md:w-28 lg:w-32 h-1 flex-grow border-t-2 "></div>
                        <div className="text-lg  md:text-2xl">{`>`}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-stepperBackground text-primary">
                          3
                        </div>
                        <span className="text-primary text-xs md:text-sm mt-2 absolute top-12">
                          Education
                        </span>
                      </div>
                      <div className="flex items-center ">
                        <div className=" w-5 md:w-28 lg:w-32 h-1 flex-grow border-t-2 "></div>
                        <div className="text-lg  md:text-2xl">{`>`}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-stepperBackground text-primary">
                          4
                        </div>
                        <span className="text-primary text-xs md:text-sm mt-2 absolute top-12">
                          Additional
                        </span>
                      </div>
                      <div className="flex items-center ">
                        <div className=" w-5 md:w-28 lg:w-32 h-1 flex-grow border-t-2 "></div>
                        <div className="text-lg  md:text-2xl">{`>`}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full border border-purple text-primary">
                          5
                        </div>
                        <span className="text-primary text-xs md:text-sm mt-2 absolute top-12">
                          Done
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-[5%] md:px-[10%]">
                  <div className="text-center pt-14 border border-l-0 border-r-0 border-t-0 border-purple pb-5">
                    <p className="text-primary text-lg md:text-3xl font-semibold">
                      Lets employers know who you are
                    </p>
                    <p className="text-primary text-base md:text-xl font-normal pt-2">
                      Include your full name and an email for employers to
                      contact you
                    </p>
                  </div>
                </div>
                <div className="px-[5%] md:px-[30%] mt-20">
                  <SimpleInputField
                    label="Name"
                    placeholder="Philip Mya"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={fieldErrors.name}
                  />
                  <SimpleInputField
                    label="Job Title"
                    value={formData.jobTitle}
                    onChange={(e) => handleChange("jobTitle", e.target.value)}
                    error={fieldErrors.jobTitle}
                  />
                  <SimpleInputField
                    label="Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={fieldErrors.email}
                  />
                  <SimpleInputField
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    error={fieldErrors.phone}
                  />
                  <SimpleInputField
                    label="LinkedIn"
                    value={formData.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    error={fieldErrors.linkedin}
                  />
                  {/* <SimpleInputField
                label="Website"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
              /> */}

                  <SimpleInputField
                    label="Website"
                    value={websiteInput}
                    onChange={(e) => setWebsiteInput(e.target.value)}
                  />

                  <Button
                    onClick={handleAddWebsite}
                    className="px-4 pt-2 text-primary text-base font-semibold hover:text-primary">
                    + Add More
                  </Button>
                  <div className="mt-4">
                    {/* {websites.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-primary my-3 py-4 pl-5 pr-3 border border-formBorders rounded bg-dropdownBackground"
                  >
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => handleNavigateToWebsite(url)}
                    >
                      <img src={urlImg} alt="URL Icon" />
                      <p className="text-base font-normal" loading="lazy">
                        {url}
                      </p>
                    </div>
                    <RiDeleteBin5Line
                      className="text-purple cursor-pointer"
                      size={22}
                      onClick={() => handleDeleteWebsite(index)}
                    />
                  </div>
                ))} */}

                    {formData.website.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-primary my-3 py-4 pl-5 pr-3 border border-formBorders rounded bg-dropdownBackground">
                        <div
                          className="flex items-center space-x-2 cursor-pointer"
                          onClick={() => handleNavigateToWebsite(url)}>
                          <img src={urlImg} alt="URL Icon" />
                          <p className="text-base font-normal" loading="lazy">
                            {url}
                          </p>
                        </div>
                        <RiDeleteBin5Line
                          className="text-purple cursor-pointer"
                          size={22}
                          onClick={() => handleDeleteWebsite(index)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* <div className="">
                    <label className="text-primary text-lg font-semibold">
                      Summary
                    </label>
                    <textarea
                      className="w-full p-3 my-2  text-base text-primary placeholder:text-primary border border-formBorders rounded bg-dropdownBackground resize-none"
                      placeholder="Write a brief summary about yourself."
                      value={formData.summary}
                      onChange={(e) => handleChange("summary", e.target.value)}
                      rows="5"
                    />
                  </div> */}

                  <div className="relative">
                    <label className="text-primary text-lg font-semibold">
                      Summary
                    </label>

                    {/* AI Suggestion Button */}
                    <Button
                      onClick={handleAISummarySuggestion}
                      disabled={isAISummaryLoading}
                      className="absolute bottom-6 right-7  bg-primary text-purple rounded-full p-2 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      title="AI Suggestion for Summary">
                      {isAISummaryLoading ? (
                        <CircularIndeterminate />
                      ) : (
                        // <LiaRobotSolid size={24} />
                        <p className="p-2 font-semibold">Suggestions with AI</p>
                      )}
                    </Button>

                    <textarea
                      className={`w-full p-3 text-justify my-2 pb-20 text-base text-primary placeholder:text-primary border rounded bg-dropdownBackground resize-none ${
                        fieldErrors.summary
                          ? "border-red-500 focus:ring-red-500"
                          : "border-formBorders"
                      }`}
                      placeholder="Write a brief summary about yourself."
                      value={formData.summary}
                      onChange={(e) => handleChange("summary", e.target.value)}
                      rows="5"
                    />
                    {fieldErrors.summary && (
                      <p className="text-red-500 text-sm mt-1">
                        This field is required
                      </p>
                    )}
                  </div>

                  {/* AI Generated Summary Textarea */}
                  {showAiSummaryResponse && (
                    <div className="relative mt-4">
                      <TextAreaComponent
                        placeholder="AI Generated Summary"
                        value={aiGeneratedSummary}
                        onTextChange={setAiGeneratedSummary}
                        className="mb-16 text-justify pb-5"
                      />
                      <Button
                        onClick={handleAISummarySuggestion}
                        className="absolute bottom-2 right-28 bg-primary text-purple font-semibold rounded-full px-8 py-3 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center text-sm "
                        title="Add AI Summary to Main Summary">
                        Retry
                      </Button>
                      <Button
                        onClick={handleAISummaryAddition}
                        className="absolute bottom-2 right-0 bg-gradient-to-b from-gradientStart to-gradientEnd text-primary font-semibold rounded-full px-8 py-3 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center text-sm "
                        title="Add AI Summary to Main Summary">
                        Add
                      </Button>
                    </div>
                  )}

                  <SimpleInputField
                    label="Address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    error={fieldErrors.address}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div>
                      <SimpleInputField
                        label="City"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        error={fieldErrors.city}
                      />
                    </div>
                    <div>
                      <SimpleInputField
                        label="State/Region"
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        error={fieldErrors.state}
                      />
                    </div>
                    <div>
                      <SimpleInputField
                        label="Postal Code"
                        value={formData.postalCode}
                        onChange={(e) =>
                          handleChange("postalCode", e.target.value)
                        }
                        error={fieldErrors.postalCode}
                      />
                    </div>
                    <div>
                      <SimpleInputField
                        label="Country"
                        value={formData.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                        error={fieldErrors.country}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center my-10 space-x-4">
                    <Button
                      onClick={handleBack}
                      // className="p-3 px-10 text-xl font-semibold border-2 border-purple  text-primary rounded-full hover:ring-2 hover:bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                      className="p-2 sm:p-3 px-8 md:px-6  flex items-center justify-center bg-almostBlack text-navbar font-bold rounded-full border-2 border-purple hover:ring-2 hover:ring-purple focus:ring-2 focus:ring-purple">
                      Back
                    </Button>
                    <Button
                      onClick={handleContinue}
                      // className="p-3 px-10 text-xl font-semibold bg-gradient-to-b from-gradientStart to-gradientEnd text-primary rounded-full hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                      className="p-2 sm:p-3 px-4 sm:px-6 flex items-center justify-center text-navbar font-bold rounded-full bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd">
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashBoardLayout>
    </>
  )
}

export default CreateResumeProfile
