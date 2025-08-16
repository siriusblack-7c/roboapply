// import React, { useState, useEffect } from "react";
// import { IoMdClose } from "react-icons/io";
// import { errorToast } from "../../../../components/Toast";
// import Button from "../../../../components/Button";
// import SimpleInputField from "../../../../components/SimpleInputFields";
// import DatePickerInput from "../../../../components/DatePickerInput";
// import TextAreaComponent from "../../../../components/TextAreaComponent";

// const AchievementModal = ({
//   isOpen,
//   onClose,
//   onAddAchievement,
//   initialData = {},
//   onSave,
// }) => {
//   const [awardTitle, setAwardTitle] = useState(initialData.awardTitle || "");
//   const [issuer, setIssuer] = useState(initialData.issuer || "");
//   const [startDate, setStartDate] = useState(
//     initialData.startDate ? new Date(initialData.startDate) : null
//   );
//   const [endDate, setEndDate] = useState(
//     initialData.endDate ? new Date(initialData.endDate) : null
//   );
//   const [description, setDescription] = useState(initialData.description || "");

//   useEffect(() => {
//     if (isOpen) {
//       setAwardTitle(initialData.awardTitle || "");
//       setIssuer(initialData.issuer || "");
//       setStartDate(
//         initialData.startDate ? new Date(initialData.startDate) : null
//       );
//       setEndDate(initialData.endDate ? new Date(initialData.endDate) : null);
//       setDescription(initialData.description || "");
//     }
//   }, [isOpen, initialData]);

//   const handleSaveAchievement = () => {
//     if (!awardTitle || !issuer || !startDate || !description) {
//       errorToast("Please fill in all required fields.");
//       return;
//     }

//     const achievementData = {
//       awardTitle,
//       issuer,
//       startDate,
//       endDate,
//       description,
//     };

//     if (initialData.id !== undefined) {
//       onSave(initialData.id, achievementData);
//     } else {
//       onAddAchievement(achievementData);
//     }

//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       id="achievement-modal-container"
//       className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
//       onClick={(e) =>
//         e.target.id === "achievement-modal-container" && onClose()
//       }
//     >
//       <div className="bg-modalPurple rounded-lg p-4 md:p-8  max-w-[90%] md:max-w-[50%] mt-10 relative border">
//         <Button
//           onClick={onClose}
//           className="absolute top-3 right-3 bg-gradient-to-b rounded-full p-0.5 text-primary hover:ring-2 hover:ring-gradientEnd from-gradientStart to-gradientEnd"
//         >
//           <IoMdClose size={24} />
//         </Button>

//         <h2 className="text-lg md:text-2xl font-semibold text-primary mb-4">
//           {initialData.id !== undefined
//             ? "Edit Achievement"
//             : "Add Achievement"}
//         </h2>

//         <div className="md:flex md:flex-col space-y-2 border border-x-0 border-customGray py-5">
//           <div className="md:flex md:space-x-4">
//             <SimpleInputField
//               placeholder="Award Title"
//               value={awardTitle}
//               onChange={(e) => setAwardTitle(e.target.value)}
//               className="w-full"
//             />
//             <SimpleInputField
//               placeholder="Issuer"
//               value={issuer}
//               onChange={(e) => setIssuer(e.target.value)}
//               className="w-full"
//             />
//           </div>

//           <div className="md:flex md:space-x-4">
//             <DatePickerInput
//               placeholder="Start Date"
//               selectedDate={startDate}
//               onChange={setStartDate}
//               className="w-full"
//             />
//             <DatePickerInput
//               placeholder="End Date"
//               selectedDate={endDate}
//               onChange={setEndDate}
//               className="w-full"
//             />
//           </div>

//           <div className="">
//             <TextAreaComponent
//               placeholder="Description"
//               value={description}
//               onTextChange={setDescription}
//             />
//           </div>
//         </div>

//         <div className="flex justify-end mt-3 mb-5 space-x-4">
//           <Button
//             onClick={onClose}
//             className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd"
//           >
//             Close
//           </Button>
//           <Button
//             onClick={handleSaveAchievement}
//             className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd"
//           >
//             {initialData.id !== undefined ? "Save Changes" : "Add Achievement"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AchievementModal;
import React, { useState, useEffect } from "react"
import { IoMdClose } from "react-icons/io"
import { errorToast } from "../../../../components/Toast"
import Button from "../../../../components/Button"
import SimpleInputField from "../../../../components/SimpleInputFields"
import DatePickerInput from "../../../../components/DatePickerInput"
import TextAreaComponent from "../../../../components/TextAreaComponent"
import CircularIndeterminate from "../../../../components/loader/circular"
import API_ENDPOINTS from "../../../../api/endpoints"

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com"

const AchievementModal = ({
  isOpen,
  onClose,
  onAddAchievement,
  initialData = {},
  onSave
}) => {
  const [awardTitle, setAwardTitle] = useState("")
  const [issuer, setIssuer] = useState("")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [description, setDescription] = useState("")

  const [aiGeneratedDescription, setAiGeneratedDescription] = useState("")
  const [showAiResponse, setShowAiResponse] = useState(false)
  const [isAILoading, setIsAILoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setAwardTitle(initialData.awardTitle || "")
      setIssuer(initialData.issuer || "")
      setDescription(initialData.description || "")

      const parseDate = (date) => {
        if (!date || date === "null" || date === "") return null
        const parsed = new Date(date)
        return isNaN(parsed) ? null : parsed
      }

      setStartDate(parseDate(initialData.startDate))
      setEndDate(parseDate(initialData.endDate))
    }
  }, [isOpen, initialData])

  const handleClose = () => {
    setAiGeneratedDescription("")
    setShowAiResponse(false)
    onClose()
  }

  const handleSaveAchievement = () => {
    if (!awardTitle || !issuer || !startDate || !description) {
      errorToast("Please fill in all required fields.")
      return
    }

    const achievementData = {
      awardTitle,
      issuer,
      startDate,
      endDate,
      description
    }

    if (initialData.id !== undefined) {
      onSave(initialData.id, achievementData)
    } else {
      onAddAchievement(achievementData)
    }

    onClose()
  }

  const handleAddAiDescription = () => {
    setDescription(aiGeneratedDescription)
    setAiGeneratedDescription("")
    setShowAiResponse(false)
  }

  const handleAISuggestion = async () => {
    if (!awardTitle || !issuer) {
      errorToast(
        "Please fill in Award Title and Issuer before using AI Suggestion."
      )
      return
    }

    const formData = { awardTitle, issuer }

    setIsAILoading(true)

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GenerateAchivementDescription}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      )

      if (!response.ok) throw new Error("Failed to fetch AI suggestion")

      const data = await response.json()

      if (data?.description) {
        setAiGeneratedDescription(data.description)
        setShowAiResponse(true)
      } else {
        errorToast("No description received from AI.")
      }
    } catch (error) {
      console.error("AI Suggestion Error:", error)
      errorToast("Error generating AI suggestion.")
    } finally {
      setIsAILoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      id="achievement-modal-container"
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) =>
        e.target.id === "achievement-modal-container" && onClose()
      }>
      <div className="bg-modalPurple rounded-lg p-4 md:p-8 max-w-[90%] md:max-w-[50%] mt-10 relative border">
        <Button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-gradient-to-b rounded-full p-0.5 text-primary hover:ring-2 hover:ring-gradientEnd from-gradientStart to-gradientEnd">
          <IoMdClose size={24} />
        </Button>

        <h2 className="text-lg md:text-2xl font-semibold text-primary mb-4">
          {initialData.id !== undefined
            ? "Edit Achievement"
            : "Add Achievement"}
        </h2>

        <div className="flex flex-col space-y-2 border border-x-0 border-customGray py-5">
          <div className="md:flex md:space-x-4">
            <SimpleInputField
              placeholder="Award Title"
              value={awardTitle}
              onChange={(e) => setAwardTitle(e.target.value)}
              className="w-full"
            />
            <SimpleInputField
              placeholder="Issuer"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="md:flex md:space-x-4">
            <DatePickerInput
              placeholder="Start Date"
              selectedDate={startDate}
              onChange={setStartDate}
              className="w-full"
            />
            <DatePickerInput
              placeholder="End Date"
              selectedDate={endDate}
              onChange={setEndDate}
              className="w-full"
            />
          </div>

          <TextAreaComponent
            placeholder="Description"
            value={description}
            onTextChange={setDescription}
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
                    <p className="font-semibold">Suggestions with AI</p>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-5 mb-2 space-x-4">
          <Button
            onClick={handleClose}
            className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd">
            Close
          </Button>
          <Button
            onClick={handleSaveAchievement}
            className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd">
            {initialData.id !== undefined ? "Save Changes" : "Add Achievement"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AchievementModal
