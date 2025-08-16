// import React, { useState, useEffect } from "react";
// import { IoMdClose } from "react-icons/io";
// import { LiaRobotSolid } from "react-icons/lia";
// import { errorToast } from "../../Toast";
// import SimpleInputField from "../../SimpleInputFields";
// import DatePickerInput from "../../DatePickerInput";
// import Button from "../../Button";
// import TextAreaComponent from "../../TextAreaComponent";

// const AddAchievementModal = ({
//   isOpen,
//   onClose,
//   onAddAchievement,
//   initialData = {},
//   onSave,
// }) => {
//   const [awardTitle, setAwardTitle] = useState("");
//   const [issuer, setIssuer] = useState("");
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [description, setDescription] = useState("");

//   useEffect(() => {
//     if (isOpen) {
//       setAwardTitle(initialData.awardTitle || "");
//       setIssuer(initialData.issuer || "");

//       if (
//         initialData.startDate &&
//         initialData.startDate !== "null" &&
//         initialData.startDate !== ""
//       ) {
//         const parsedStart = new Date(initialData.startDate);
//         setStartDate(isNaN(parsedStart) ? null : parsedStart);
//       } else {
//         setStartDate(null);
//       }

//       if (
//         initialData.endDate &&
//         initialData.endDate !== "null" &&
//         initialData.endDate !== ""
//       ) {
//         const parsedEnd = new Date(initialData.endDate);
//         setEndDate(isNaN(parsedEnd) ? null : parsedEnd);
//       } else {
//         setEndDate(null);
//       }

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

//   // AI Suggestion Button Handler
//   const handleAISuggestion = () => {
//     if (!awardTitle || !issuer) {
//       errorToast(
//         "Please fill in Award Title, Issuer, Start Date, and End Date before using AI Suggestion."
//       );
//       return;
//     }
//     const formData = {
//       awardTitle,
//       issuer,
//     };

//     console.log("AI Suggestion - Achievement Form Data:", formData);

//     // You can add your AI suggestion logic here
//     // For example, call an API to get description suggestions
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       id="add-achievement-modal-container"
//       className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
//       onClick={(e) =>
//         e.target.id === "add-achievement-modal-container" && onClose()
//       }
//     >
//       <div className="bg-modalPurple rounded-lg p-8 w-full md:max-w-[50%] mt-10 relative border border-customGray">
//         <Button
//           onClick={onClose}
//           className="absolute top-3 right-3 bg-gradient-to-b rounded-full p-0.5 text-primary hover:ring-2 hover:ring-gradientEnd from-gradientStart to-gradientEnd"
//         >
//           <IoMdClose size={30} />
//         </Button>

//         {/* AI Suggestion Button - Bottom Right Corner */}
//         <Button
//           onClick={handleAISuggestion}
//           className="absolute bottom-36 right-10 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-full p-3 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center"
//           title="AI Suggestion for Description"
//         >
//           <LiaRobotSolid size={24} />
//         </Button>

//         <h2 className="text-2xl font-semibold text-primary mb-4">
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

//           <div className="md:mx-2">
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

// export default AddAchievementModal;

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { LiaRobotSolid } from "react-icons/lia";
import { errorToast } from "../../Toast";
import SimpleInputField from "../../SimpleInputFields";
import DatePickerInput from "../../DatePickerInput";
import Button from "../../Button";
import TextAreaComponent from "../../TextAreaComponent";
import CircularIndeterminate from "../../loader/circular";
import API_ENDPOINTS from "../../../api/endpoints";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

const AddAchievementModal = ({
  isOpen,
  onClose,
  onAddAchievement,
  initialData = {},
  onSave,
}) => {
  const [awardTitle, setAwardTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");

  const [aiGeneratedDescription, setAiGeneratedDescription] = useState("");
  const [showAiResponse, setShowAiResponse] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAwardTitle(initialData.awardTitle || "");
      setIssuer(initialData.issuer || "");

      if (
        initialData.startDate &&
        initialData.startDate !== "null" &&
        initialData.startDate !== ""
      ) {
        const parsedStart = new Date(initialData.startDate);
        setStartDate(isNaN(parsedStart) ? null : parsedStart);
      } else {
        setStartDate(null);
      }

      if (
        initialData.endDate &&
        initialData.endDate !== "null" &&
        initialData.endDate !== ""
      ) {
        const parsedEnd = new Date(initialData.endDate);
        setEndDate(isNaN(parsedEnd) ? null : parsedEnd);
      } else {
        setEndDate(null);
      }

      setDescription(initialData.description || "");
    }
  }, [isOpen, initialData]);

  const handleSaveAchievement = () => {
    if (!awardTitle || !issuer || !startDate || !description) {
      errorToast("Please fill in all required fields.");
      return;
    }

    const achievementData = {
      awardTitle,
      issuer,
      startDate,
      endDate,
      description,
    };

    if (initialData.id !== undefined) {
      onSave(initialData.id, achievementData);
    } else {
      onAddAchievement(achievementData);
    }

    setAiGeneratedDescription("");
    setShowAiResponse(false);
    onClose();
  };

  const handleAddAiDescription = () => {
    setDescription(aiGeneratedDescription);
    setAiGeneratedDescription("");
    setShowAiResponse(false);
  };

  const handleAISuggestion = async () => {
    if (!awardTitle || !issuer) {
      errorToast(
        "Please fill in Award Title and Issuer before using AI Suggestion."
      );
      return;
    }

    const formData = {
      awardTitle,
      issuer,
    };

    setIsAILoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GenerateAchivementDescription}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch AI suggestion");

      const data = await response.json();

      if (data?.description) {
        setAiGeneratedDescription(data.description);
        setShowAiResponse(true);
      } else {
        errorToast("No description received from AI.");
      }
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      errorToast("Error generating AI suggestion.");
    } finally {
      setIsAILoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="add-achievement-modal-container"
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) =>
        e.target.id === "add-achievement-modal-container" && onClose()
      }
    >
      <div className="bg-modalPurple rounded-lg p-8 w-full md:max-w-[50%] mt-10 relative border border-customGray">
        <Button
          onClick={() => {
            setAiGeneratedDescription("");
            setShowAiResponse(false);
            onClose();
          }}
          className="absolute top-3 right-3 bg-gradient-to-b rounded-full p-0.5 text-primary hover:ring-2 hover:ring-gradientEnd from-gradientStart to-gradientEnd"
        >
          <IoMdClose size={30} />
        </Button>

        {/* <Button
          onClick={handleAISuggestion}
          disabled={isAILoading}
          className="absolute bottom-36 right-10 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-full p-3 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          title="AI Suggestion for Description"
        >
          {isAILoading ? (
            <CircularIndeterminate />
          ) : (
            <LiaRobotSolid size={24} />
          )}
        </Button> */}

        <h2 className="text-2xl font-semibold text-primary mb-4">
          {initialData.id !== undefined
            ? "Edit Achievement"
            : "Add Achievement"}
        </h2>

        <div className="md:flex md:flex-col space-y-2 border border-x-0 border-customGray py-5">
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

          <div className="">
            <TextAreaComponent
              placeholder="Description"
              value={description}
              onTextChange={setDescription}
            />
          </div>

          {showAiResponse && (
            <div className="relative">
              <TextAreaComponent
                placeholder="AI Generated Description"
                value={aiGeneratedDescription}
                onTextChange={setAiGeneratedDescription}
                className="mb-20"
              />
              <Button
                onClick={handleAddAiDescription}
                className="absolute bottom-2 right-0 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-full px-10 py-4 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center text-sm font-medium"
                title="Add AI Description to Main Description"
              >
                Add
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-3 mb-5 space-x-4">
          <Button
            onClick={() => {
              setAiGeneratedDescription("");
              setShowAiResponse(false);
              onClose();
            }}
            className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd"
          >
            Close
          </Button>
          <Button
            onClick={handleSaveAchievement}
            className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd"
          >
            {initialData.id !== undefined ? "Save Changes" : "Add Achievement"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAchievementModal;
