import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { errorToast } from "../../Toast";
import SimpleInputField from "../../SimpleInputFields";
import DatePickerInput from "../../DatePickerInput";
import Button from "../../Button";
import TextAreaComponent from "../../TextAreaComponent";
import { LiaRobotSolid } from "react-icons/lia";

import API_ENDPOINTS from "../../../api/endpoints";
import CircularIndeterminate from "../../loader/circular";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

const experienceTypes = [
  "Full-Time",
  "Part-Time",
  "Hybrid",
  "Internship",
  "Contract",
];

const AddExperienceModal = ({
  isOpen,
  onClose,
  onAddExperience,
  initialData = {},
  onSave,
}) => {
  const [companyName, setCompanyName] = useState(initialData.companyName || "");
  const [jobTitle, setJobTitle] = useState(initialData.jobTitle || "");
  const [location, setLocation] = useState(initialData.location || "");
  const [experienceType, setExperienceType] = useState(
    initialData.experienceType || ""
  );
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [description, setDescription] = useState(initialData.description || "");
  const [isAILoading, setIsAILoading] = useState(false); // Add loading state
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState(""); // AI response
  const [showAiResponse, setShowAiResponse] = useState(false); // Show/hide AI textarea

  useEffect(() => {
    if (isOpen) {
      setCompanyName(initialData.companyName || "");
      setJobTitle(initialData.jobTitle || "");
      setLocation(initialData.location || "");
      setExperienceType(initialData.experienceType || "");
      setDescription(initialData.description || "");

      // Start Date
      if (
        initialData.startDate &&
        initialData.startDate !== "null" &&
        initialData.startDate !== ""
      ) {
        const validStart = new Date(initialData.startDate);
        setStartDate(isNaN(validStart) ? null : validStart);
      } else {
        setStartDate(null);
      }

      // End Date
      if (
        initialData.endDate === "Present" ||
        initialData.endDate === "present" ||
        initialData.endDate === null ||
        initialData.endDate === ""
      ) {
        setEndDate(null);
        setIsCurrentJob(true);
      } else {
        const validEnd = new Date(initialData.endDate);
        setEndDate(isNaN(validEnd) ? null : validEnd);
        setIsCurrentJob(false);
      }
    }
  }, [isOpen, initialData]);

  const handleClose = () => {
    setAiGeneratedDescription("");
    setShowAiResponse(false);
    onClose();
  };

  const handleSaveExperience = () => {
    if (
      !companyName ||
      !jobTitle ||
      !location ||
      !experienceType ||
      !startDate
    ) {
      errorToast("Please fill in all required fields.");
      return;
    }

    const experienceData = {
      companyName,
      jobTitle,
      location,
      experienceType,
      startDate,
      endDate: isCurrentJob ? "Present" : endDate,
      description,
    };

    if (initialData.id !== undefined) {
      onSave(initialData.id, experienceData);
    } else {
      onAddExperience(experienceData);
    }

    onClose();
  };
  // Handle adding AI generated description to main description
  const handleAddAiDescription = () => {
    setDescription(aiGeneratedDescription);
    setShowAiResponse(false);
    setAiGeneratedDescription("");
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsCurrentJob(checked);
    if (checked) {
      setEndDate(null);
    }
  };

  // AI Suggestion Button Handler with API call
  const handleAISuggestion = async () => {
    if (!companyName || !location || !jobTitle || !experienceType) {
      errorToast(
        "Please fill in Company Name, Location, Job Title, and Experience Type before using AI Suggestion."
      );
      return;
    }

    const requestData = {
      companyName,
      location,
      jobTitle,
      experienceType,
    };

    setIsAILoading(true); // Start loading

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GenerateJobDescription}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();
      console.log("AI Suggestion Result:", result);

      // Assuming the API returns a description field
      if (result.description) {
        setAiGeneratedDescription(result.description);
        setShowAiResponse(true);
      } else {
        errorToast("No description generated. Please try again.");
      }
    } catch (error) {
      console.error("AI Suggestion error:", error);
      errorToast("Error generating AI suggestion.");
    } finally {
      setIsAILoading(false); // Stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="add-experience-modal-container"
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) =>
        e.target.id === "add-experience-modal-container" && onClose()
      }
    >
      <div className="bg-modalPurple rounded-lg p-8 w-full md:max-w-[50%] mt-10 relative border">
        <Button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gradient-to-b rounded-full p-0.5 text-primary hover:ring-2 hover:ring-gradientEnd from-gradientStart to-gradientEnd"
        >
          <IoMdClose size={24} />
        </Button>

        {/* AI Suggestion Button - Bottom Right Corner */}
        {/* <Button
          onClick={handleAISuggestion}
          disabled={isAILoading}
          className="absolute bottom-36 right-10 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-full p-2 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          title="AI Suggestion for Description"
        >
          {isAILoading ? (
            <CircularIndeterminate />
          ) : (
            <LiaRobotSolid size={30} />
          )}
        </Button> */}

        <h2 className="text-2xl font-semibold text-primary mb-4">
          {initialData.id !== undefined ? "Edit Experience" : "Add Experience"}
        </h2>

        <div className="md:flex flex-col space-y-2 border border-x-0 border-customGray py-5">
          <div className="md:flex md:space-x-4">
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

          <div>
            <select
              id="experienceType"
              value={experienceType}
              onChange={(e) => setExperienceType(e.target.value)}
              className="block w-full bg-dropdownBackground md:mt-2.5 text-primary border border-formBorders py-3 px-3 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            >
              <option
                className="text-dropdownBackground bg-inputBackGround"
                value=""
                disabled
              >
                Experience type
              </option>
              {experienceTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                  className="text-lightGrey bg-inputBackGround"
                >
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

          <div className="flex items-center pb-2 md:pb-4 md:mx-5">
            <input
              type="checkbox"
              checked={isCurrentJob}
              onChange={handleCheckboxChange}
              className="form-checkbox mr-3 h-5 w-5 border-2 bg-lightGreyBackground rounded border-customGray focus:ring-0"
            />
            <label className="text-sm text-primary">
              Currently working here
            </label>
          </div>

          <TextAreaComponent
            placeholder="Add Description"
            value={description}
            onTextChange={setDescription}
          />

          {/* AI Generated Description Textarea */}
          {showAiResponse && (
            <div className="relative">
              <TextAreaComponent
                placeholder="AI Generated Description"
                value={aiGeneratedDescription}
                onTextChange={setAiGeneratedDescription}
                className="mb-20" // Add padding to avoid overlap with the button
              />
              <Button
                onClick={handleAddAiDescription}
                className="absolute bottom-1 right-0 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-full px-10 py-4 shadow-lg hover:ring-2 hover:ring-blue-400 hover:shadow-xl transition-all duration-200 flex items-center justify-center text-sm font-medium"
                title="Add AI Description to Main Description"
              >
                Add
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-3 mb-5 space-x-4">
          <Button
            // onClick={onClose}
            onClick={handleClose}
            className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-primary rounded-lg hover:ring-2 hover:ring-gradientEnd"
          >
            Close
          </Button>
          <Button
            onClick={handleSaveExperience}
            className="px-4 py-3 font-medium bg-gradient-to-b min-w-max w-40 from-gradientStart to-gradientEnd text-primary rounded-lg hover:ring-2 hover:ring-gradientEnd"
          >
            {initialData.id !== undefined ? "Save Changes" : "Add Experience"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddExperienceModal;
