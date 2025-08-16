import React, { useState, useEffect, useRef } from "react";
import DashBoardLayout from "../../dashboardLayout";
import {
  FaChevronLeft,
  FaRegThumbsUp,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import Button from "../../components/Button";
import regenerateIcon from "../../assets/generateAiCoverLetterIcons/reGenerateIcon.svg";
import copyIcon from "../../assets/generateAiCoverLetterIcons/copyIcon.svg";
import TextAreaComponent from "../../components/TextAreaComponent";
import aiIcon from "../../assets/generateAiCoverLetterIcons/aiIcon.svg";
import userIcon from "../../assets/generateAiCoverLetterIcons/youIcon.svg";
import { errorToast, successToast } from "../../components/Toast";
import API_ENDPOINTS from "../../api/endpoints";
import CircularIndeterminate from "../../components/loader/circular";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

const InterviewGuide = () => {
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showResponse, setShowResponse] = useState(false);
  const [uploadedResumeName, setUploadedResumeName] = useState(null);
  const [resumeOptions, setResumeOptions] = useState([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [loadingLoader, setLoadingLoader] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResumesForSelect();
  }, []);

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadFile = async (file) => {
    if (!file) {
      errorToast("Please upload a file.");
      return null;
    }
    setLoadingLoader(true);
    const fullUrl = `${BASE_URL}${API_ENDPOINTS.FileUpload}`;
    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch(fullUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "File upload failed!");
      }

      if (data.success && data.files && data.files.length > 0) {
        const fileUrlPath = data.files[0].urlPath;
        localStorage.setItem("resumeUrlPath", fileUrlPath);
        successToast("File uploaded successfully!");
        return fileUrlPath;
      } else {
        errorToast(data.message || "File upload failed!");
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      errorToast(error.message || "Error uploading file.");
      return null;
    } finally {
      setLoadingLoader(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && /\.(pdf|doc|docx)$/i.test(file.name)) {
      setUploadedFile(file);
      setUploadedResumeName(file.name);

      const uploadedPath = await uploadFile(file);
      if (uploadedPath) {
        setUploadedFilePath(uploadedPath);
      } else {
        setUploadedFile(null);
        setUploadedResumeName(null);
        setUploadedFilePath(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      }
    } else {
      errorToast("Please upload a PDF, DOC, or DOCX file.");
      e.target.value = null;
    }
  };

  const handleGenerateClick = async () => {
    console.log("Job Description:", jobDescription);
    console.log("Selected Resume (ID):", selectedResume);
    console.log("Uploaded Resume File Path:", uploadedFilePath);

    if (!selectedResume && !uploadedFilePath) {
      errorToast("Please either select a resume or upload a resume!");
      return;
    }

    if (!jobDescription) {
      errorToast("Please enter the job description!");
      return;
    }

    const formData = new FormData();
    formData.append("description", jobDescription);

    if (uploadedFilePath) {
      formData.append("url", uploadedFilePath);
    } else if (selectedResume) {
      formData.append("resume_id", selectedResume);
    }

    setLoadingLoader(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GenerateInterviewGuide}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate interview guide");
      }

      // Expecting `data.interviewGuide` array in response
      setAiResponse(data.interviewGuide || []);
      setConversationHistory([]); // Reset conversation history for new generation
      setShowResponse(true);
    } catch (error) {
      console.error("Error generating interview guide:", error);
      errorToast(error.message || "Error generating interview guide.");
    } finally {
      setLoadingLoader(false);
    }
  };

  const handleUserResponseSubmit = async () => {
    if (userResponse.trim() === "") {
      errorToast("Please enter a question before submitting!");
      return;
    }

    const currentQuestion = userResponse;
    setUserResponse(""); // Clear input
    setLoadingLoader(true);

    try {
      // Prepare historical questions including the initial AI response and conversation history
      const historicalQuestions = [
        ...aiResponse, // Initial interview guide questions
        ...conversationHistory, // Previous conversation Q&As
      ];

      const formData = new FormData();
      formData.append(
        "historical_questions",
        JSON.stringify(historicalQuestions)
      );
      formData.append("question", currentQuestion);

      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.InterviewGuideQuestions}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      const queryRes = result?.["Query Response"];

      if (!response.ok || !queryRes?.Question || !queryRes?.Answer) {
        throw new Error("Invalid response from server.");
      }

      // Create new conversation entry
      const newConversationEntry = {
        Question: currentQuestion,
        Answer: queryRes.Answer,
        type: "conversation", // To distinguish from initial interview guide
      };

      // Update conversation history
      setConversationHistory((prev) => [...prev, newConversationEntry]);
    } catch (error) {
      console.error("Error:", error);
      errorToast(error.message || "Error getting response.");
    } finally {
      setLoadingLoader(false);
    }
  };

  const handleRegenerateClick = () => {
    setSelectedResume("");
    setJobDescription("");
    setAiResponse("");
    setUserResponse("");
    setConversationHistory([]);
    setShowResponse(false);
    setUploadedResumeName("");
    setUploadedFile(null);
    setUploadedFilePath(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const fetchResumesForSelect = async () => {
    setIsLoadingResumes(true);
    const token = localStorage.getItem("access_token");

    if (!token) {
      errorToast("You are not authorized.");
      setIsLoadingResumes(false);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GetAllResumes}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success && result.resumes?.docs) {
        const formatted = result.resumes.docs.map((doc) => ({
          id: doc._id,
          label: doc.resumeName,
        }));
        setResumeOptions(formatted);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      errorToast("Failed to load resumes");
    } finally {
      setIsLoadingResumes(false);
    }
  };

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
              <p className="md:text-lg font-light text-primary">
                Choose a resume as the source of information to answer questions
              </p>
              <div className="flex">
                <Button
                  onClick={handleRegenerateClick}
                  className="p-1 md:p-2 bg-blue h-10 w-10 flex items-center justify-center hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition duration-300"
                >
                  <img
                    src={regenerateIcon}
                    className="w-6 h-6"
                    alt="Regenerate"
                    loading="lazy"
                  />
                </Button>
                <Button className="p-2 bg-primary h-10 flex items-center justify-center hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition duration-300">
                  <img
                    src={copyIcon}
                    className="w-6 h-6"
                    alt="Copy"
                    loading="lazy"
                  />
                </Button>
              </div>
            </div>

            <div className="w-full">
              <div className="pb-5">
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="block w-full md:w-[80%] bg-dropdownBackground text-primary border border-formBorders py-3 px-3 rounded-md shadow-sm"
                >
                  <option
                    className="text-primary bg-inputBackGround"
                    value=""
                    disabled
                  >
                    {isLoadingResumes ? "Loading resumes..." : "Select Resume"}
                  </option>
                  {resumeOptions.map((option) => (
                    <option
                      className="text-primary bg-inputBackGround"
                      key={option.id}
                      value={option.id}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pb-5">
                {uploadedResumeName ? (
                  <p className="text-lg text-primary">
                    <strong>Uploaded Resume:</strong> {uploadedResumeName}
                  </p>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <Button
                      onClick={handleFileInputClick}
                      className="px-4 py-3 min-w-max flex gap-3 items-center justify-center text-lg text-primary font-semibold hover:text-primary"
                    >
                      Upload Resume
                    </Button>
                  </>
                )}
              </div>

              <div className="pb-10 w-full md:w-[80%]">
                <TextAreaComponent
                  placeholder="Add Job Description..."
                  value={jobDescription}
                  onTextChange={setJobDescription}
                />
              </div>

              <div className="pb-10">
                <Button
                  onClick={handleGenerateClick}
                  className="px-4 py-3 bg-gradient-to-b min-w-max flex gap-3 w-40 items-center justify-center text-base md:text-xl font-semibold from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd"
                >
                  Generate
                  <FaRegThumbsUp />
                </Button>
              </div>

              {showResponse && (
                <div className="bg-inputBackGround w-full md:w-[80%] md:px-4 py-4 mb-10 overflow-y-auto rounded-lg">
                  {/* Initial AI Interview Guide Response */}
                  <div className="p-3 space-y-5">
                    <div className="flex gap-4">
                      <img
                        src={aiIcon}
                        alt="AI"
                        className="w-6 h-6"
                        loading="lazy"
                      />
                      <p className="items-center text-primary text-xl font-medium">
                        AI-JOBS Reply
                      </p>
                    </div>

                    {Array.isArray(aiResponse) && aiResponse.length > 0 ? (
                      aiResponse.map((item, index) => (
                        <div key={index} className="p-4 ">
                          <p className="text-primary text-justify font-semibold mb-2">
                            Q{index + 1}: {item.Question}
                          </p>
                          <p className="text-primary text-justify">
                            <span className="font-semibold ">Ans:</span>{" "}
                            {item.Answer}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No response yet.</p>
                    )}
                  </div>

                  {/* Conversation History */}
                  {conversationHistory.map((conversation, index) => (
                    <div key={`conversation-${index}`}>
                      {/* User Question */}
                      <div className="p-3 space-y-2 border-t border-gray-600 mt-4">
                        <div className="flex gap-4">
                          <img
                            src={userIcon}
                            alt="User"
                            className="w-6 h-6"
                            loading="lazy"
                          />
                          <p className="items-center text-primary text-xl font-medium">
                            You
                          </p>
                        </div>
                        <div className="px-4 ">
                          <p className="text-primary font-semibold mb-2">
                            {conversation.Question}
                          </p>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="p-3 space-y-2">
                        <div className="flex gap-4">
                          <img
                            src={aiIcon}
                            alt="AI"
                            className="w-6 h-6"
                            loading="lazy"
                          />
                          <p className="items-center text-primary text-xl font-medium">
                            AI-JOBS Reply
                          </p>
                        </div>
                        <div className="px-4 py-2">
                          <p className="text-primary text-justify">
                            {conversation.Answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showResponse && (
                <div className="pb-10 flex gap-4 w-full md:w-[80%] items-center">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                    <input
                      type="text"
                      placeholder="Type your question..."
                      className="w-full pl-10 text-primary text-lg placeholder:text-primary pr-10 py-5 bg-inputBackGround rounded-lg border border-customGray focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUserResponseSubmit();
                        }
                      }}
                    />
                    <Button onClick={handleUserResponseSubmit}>
                      <FaArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary cursor-pointer" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </>
  );
};

export default InterviewGuide;
