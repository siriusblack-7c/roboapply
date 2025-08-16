// import React, { useState, useEffect } from "react";
// import { IoMdClose } from "react-icons/io";
// import { errorToast } from "../../../../components/Toast";
// import Button from "../../../../components/Button";
// import SimpleInputField from "../../../../components/SimpleInputFields";
// import DatePickerInput from "../../../../components/DatePickerInput";
// import TextAreaComponent from "../../../../components/TextAreaComponent";

// const experienceTypes = [
//   "Full-Time",
//   "Part-Time",
//   "Hybrid",
//   "Internship",
//   "Contract",
// ];

// const ExperienceModal = ({
//   isOpen,
//   onClose,
//   onAddExperience,
//   initialData = {},
//   onSave,
// }) => {
//   const [companyName, setCompanyName] = useState("");
//   const [jobTitle, setJobTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [experienceType, setExperienceType] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [isCurrentJob, setIsCurrentJob] = useState(false);
//   const [description, setDescription] = useState("");

//   // Reset form state when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setCompanyName(initialData.companyName || "");
//       setJobTitle(initialData.jobTitle || "");
//       setLocation(initialData.location || "");
//       setExperienceType(initialData.experienceType || "");
//       setStartDate(
//         initialData.startDate ? new Date(initialData.startDate) : null
//       );
//       if (initialData.endDate === "Present") {
//         setIsCurrentJob(true);
//         setEndDate(null);
//       } else {
//         setIsCurrentJob(false);
//         setEndDate(initialData.endDate ? new Date(initialData.endDate) : null);
//       }
//       setDescription(initialData.description || "");
//     }
//   }, [isOpen, initialData]);

//   const handleSaveExperience = () => {
//     if (
//       !companyName ||
//       !jobTitle ||
//       !location ||
//       !experienceType ||
//       !startDate
//     ) {
//       errorToast("Please fill in all required fields.");
//       return;
//     }

//     const experienceData = {
//       companyName,
//       jobTitle,
//       location,
//       experienceType,
//       startDate,
//       endDate: isCurrentJob ? "Present" : endDate,
//       description,
//     };

//     if (initialData.id !== undefined) {
//       onSave(initialData.id, experienceData);
//     } else {
//       onAddExperience({ ...experienceData, id: Date.now() }); // Assign unique ID
//     }

//     onClose();
//   };

//   const handleCheckboxChange = (e) => {
//     setIsCurrentJob(e.target.checked);
//     if (e.target.checked) setEndDate(null);
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       id="add-experience-modal-container"
//       className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
//       onClick={(e) =>
//         e.target.id === "add-experience-modal-container" && onClose()
//       }
//     >
//       <div className="bg-modalPurple rounded-lg p-4 md:p-8 w-full max-w-[90%] md:max-w-[50%] mt-10 relative border">
//         <Button
//           onClick={onClose}
//           className="absolute top-3 right-3 bg-gradient-to-b rounded-full p-0.5 text-primary hover:ring-2 hover:ring-gradientEnd from-gradientStart to-gradientEnd"
//         >
//           <IoMdClose size={24} />
//         </Button>

//         <h2 className="text-lg md:text-2xl font-semibold text-primary mb-4 ">
//           {initialData.id !== undefined ? "Edit Experience" : "Add Experience"}
//         </h2>

//         <div className="flex flex-col md:space-y-2 border border-x-0 border-customGray py-5">
//           <div className="space-y-2 md:flex md:space-x-4 md:space-y-0">
//             <SimpleInputField
//               placeholder="Company Name"
//               value={companyName}
//               onChange={(e) => setCompanyName(e.target.value)}
//               className="w-full"
//             />
//             <SimpleInputField
//               placeholder="Job Title"
//               value={jobTitle}
//               onChange={(e) => setJobTitle(e.target.value)}
//               className="w-full"
//             />
//           </div>

//           <SimpleInputField
//             placeholder="Location"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />

//           <div className="">
//             <select
//               id="experienceType"
//               value={experienceType}
//               onChange={(e) => setExperienceType(e.target.value)}
//               className="block w-full bg-dropdownBackground md:mt-2.5 text-primary border border-formBorders  py-3 px-3 rounded-md"
//             >
//               <option
//                 value=""
//                 className="text-primary bg-inputBackGround"
//                 disabled
//               >
//                 Experience type
//               </option>
//               {experienceTypes.map((type) => (
//                 <option
//                   className="text-primary bg-inputBackGround"
//                   key={type}
//                   value={type}
//                 >
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="md:flex md:space-x-4">
//             <DatePickerInput
//               placeholder="Start Date"
//               selectedDate={startDate}
//               onChange={setStartDate}
//               className="w-full"
//             />
//             {!isCurrentJob && (
//               <DatePickerInput
//                 placeholder="End Date"
//                 selectedDate={endDate}
//                 onChange={setEndDate}
//                 className="w-full"
//               />
//             )}
//           </div>

//           <div className="flex items-center pb-4 md:mx-5">
//             <input
//               type="checkbox"
//               checked={isCurrentJob}
//               onChange={handleCheckboxChange}
//               className={`form-checkbox mr-3 h-5 w-5 border-2 bg-lightGreyBackground rounded
//                 ${
//                   isCurrentJob
//                     ? "border-customGray bg-transparent text-purpleColor"
//                     : "border-customGray"
//                 } focus:ring-0`}
//             />
//             <label className="text-sm text-primary">
//               Currently working here
//             </label>
//           </div>

//           <TextAreaComponent
//             placeholder="Add Description"
//             value={description}
//             onTextChange={setDescription}
//             className=""
//           />
//         </div>

//         <div className="flex justify-end mt-3 mb-5 space-x-4">
//           <Button
//             onClick={onClose}
//             className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-primary rounded-lg hover:ring-2 hover:ring-gradientEnd"
//           >
//             Close
//           </Button>
//           <Button
//             onClick={handleSaveExperience}
//             className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-primary rounded-lg hover:ring-2 hover:ring-gradientEnd"
//           >
//             {initialData.id !== undefined ? "Save Changes" : "Add Experience"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExperienceModal;
import React, { useState, useEffect } from "react"
import { IoMdClose } from "react-icons/io"
import { errorToast } from "../../../../components/Toast"
import Button from "../../../../components/Button"
import SimpleInputField from "../../../../components/SimpleInputFields"
import DatePickerInput from "../../../../components/DatePickerInput"
import TextAreaComponent from "../../../../components/TextAreaComponent"
import { LiaRobotSolid } from "react-icons/lia"
import CircularIndeterminate from "../../../../components/loader/circular"
import API_ENDPOINTS from "../../../../api/endpoints"

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com"

const experienceTypes = [
  "Full-Time",
  "Part-Time",
  "Hybrid",
  "Internship",
  "Contract"
]

const ExperienceModal = ({
  isOpen,
  onClose,
  onAddExperience,
  initialData = {},
  onSave
}) => {
  const [companyName, setCompanyName] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")
  const [experienceType, setExperienceType] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isCurrentJob, setIsCurrentJob] = useState(false)
  const [description, setDescription] = useState("")
  const [isAILoading, setIsAILoading] = useState(false)
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState("")
  const [showAiResponse, setShowAiResponse] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCompanyName(initialData.companyName || "")
      setJobTitle(initialData.jobTitle || "")
      setLocation(initialData.location || "")
      setExperienceType(initialData.experienceType || "")
      setStartDate(
        initialData.startDate ? new Date(initialData.startDate) : null
      )
      if (initialData.endDate === "Present") {
        setIsCurrentJob(true)
        setEndDate(null)
      } else {
        setIsCurrentJob(false)
        setEndDate(initialData.endDate ? new Date(initialData.endDate) : null)
      }
      setDescription(initialData.description || "")
    }
  }, [isOpen, initialData])

  const handleClose = () => {
    setDescription("")
    setAiGeneratedDescription("")
    setShowAiResponse(false)
    onClose()
  }

  const handleSaveExperience = () => {
    if (
      !companyName ||
      !jobTitle ||
      !location ||
      !experienceType ||
      !startDate
    ) {
      errorToast("Please fill in all required fields.")
      return
    }

    const experienceData = {
      companyName,
      jobTitle,
      location,
      experienceType,
      startDate,
      endDate: isCurrentJob ? "Present" : endDate,
      description
    }

    if (initialData.id !== undefined) {
      onSave(initialData.id, experienceData)
    } else {
      onAddExperience({ ...experienceData, id: Date.now() })
    }

    onClose()
  }

  const handleAddAiDescription = () => {
    setDescription(aiGeneratedDescription)
    setShowAiResponse(false)
    setAiGeneratedDescription("")
  }

  const handleCheckboxChange = (e) => {
    setIsCurrentJob(e.target.checked)
    if (e.target.checked) setEndDate(null)
  }

  const handleAISuggestion = async () => {
    if (!companyName || !location || !jobTitle || !experienceType) {
      errorToast(
        "Please fill in Company Name, Location, Job Title, and Experience Type before using AI Suggestion."
      )
      return
    }

    const requestData = {
      companyName,
      location,
      jobTitle,
      experienceType
    }

    setIsAILoading(true)

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GenerateJobDescription}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        }
      )

      const result = await response.json()

      if (result.description) {
        setAiGeneratedDescription(result.description)
        setShowAiResponse(true)
      } else {
        errorToast("No description generated. Please try again.")
      }
    } catch (error) {
      console.error("AI Suggestion error:", error)
      errorToast("Error generating AI suggestion.")
    } finally {
      setIsAILoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      id="add-experience-modal-container"
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) =>
        e.target.id === "add-experience-modal-container" && onClose()
      }>
      <div className="bg-modalPurple rounded-lg p-4 md:p-8 w-full max-w-[90%] md:max-w-[50%] mt-10 relative border">
        <Button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gradient-to-b rounded-full p-0.5 text-primary hover:ring-2 hover:ring-gradientEnd from-gradientStart to-gradientEnd">
          <IoMdClose size={24} />
        </Button>

        <h2 className="text-lg md:text-2xl font-semibold text-primary mb-4 ">
          {initialData.id !== undefined ? "Edit Experience" : "Add Experience"}
        </h2>

        <div className="flex flex-col md:space-y-2 border border-x-0 border-customGray py-5">
          <div className="space-y-2 md:flex md:space-x-4 md:space-y-0">
            <SimpleInputField
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full"
            />
            <SimpleInputField
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full"
            />
          </div>

          <SimpleInputField
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <div className="">
            <select
              id="experienceType"
              value={experienceType}
              onChange={(e) => setExperienceType(e.target.value)}
              className="block w-full bg-dropdownBackground md:mt-2.5 text-primary border border-formBorders  py-3 px-3 rounded-md">
              <option
                value=""
                className="text-primary bg-inputBackGround"
                disabled>
                Experience type
              </option>
              {experienceTypes.map((type) => (
                <option
                  className="text-primary bg-inputBackGround"
                  key={type}
                  value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="md:flex md:space-x-4">
            <DatePickerInput
              placeholder="Start Date"
              selectedDate={startDate}
              onChange={setStartDate}
              className="w-full"
            />
            {!isCurrentJob && (
              <DatePickerInput
                placeholder="End Date"
                selectedDate={endDate}
                onChange={setEndDate}
                className="w-full"
              />
            )}
          </div>

          <div className="flex items-center pb-4 md:mx-5">
            <input
              type="checkbox"
              checked={isCurrentJob}
              onChange={handleCheckboxChange}
              className={`form-checkbox mr-3 h-5 w-5 border-2 bg-lightGreyBackground rounded  
                ${
                  isCurrentJob
                    ? "border-customGray bg-transparent text-purpleColor"
                    : "border-customGray"
                } focus:ring-0`}
            />
            <label className="text-sm text-primary">
              Currently working here
            </label>
          </div>

          <TextAreaComponent
            placeholder="Add Description"
            value={description}
            onTextChange={setDescription}
            className="pb-10"
          />

          {/* AI Interaction Section */}
          <div className="relative mt-4">
            {showAiResponse ? (
              <>
                <TextAreaComponent
                  placeholder="AI Generated Description"
                  value={aiGeneratedDescription}
                  onTextChange={setAiGeneratedDescription}
                />
                <div className="flex justify-end mt-2 space-x-3">
                  {isAILoading ? (
                    <CircularIndeterminate />
                  ) : (
                    <>
                      <Button
                        onClick={handleAISuggestion}
                        className="bg-primary text-purple font-semibold rounded-full px-6 py-2 text-sm"
                        title="Retry AI Suggestion">
                        Retry
                      </Button>
                      <Button
                        onClick={handleAddAiDescription}
                        className="bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-full px-8 py-3 text-sm font-medium"
                        title="Add AI Description to Main Description">
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-end">
                <Button
                  onClick={handleAISuggestion}
                  disabled={isAILoading}
                  className="bg-primary text-purple rounded-full px-6 py-3 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="AI Suggestion for Description">
                  {isAILoading ? (
                    <CircularIndeterminate />
                  ) : (
                    <p className="font-semibold">Suggestion with AI</p>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-5 mb-2 space-x-4">
          <Button
            onClick={handleClose}
            className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-primary rounded-lg hover:ring-2 hover:ring-gradientEnd">
            Close
          </Button>
          <Button
            onClick={handleSaveExperience}
            className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-primary rounded-lg hover:ring-2 hover:ring-gradientEnd">
            {initialData.id !== undefined ? "Save Changes" : "Add Experience"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ExperienceModal
