import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js"; // Import html2pdf.js
import Button from "../../../../components/Button";
import CircularIndeterminate from "../../../../components/loader/circular";
import API_ENDPOINTS from "../../../../api/endpoints";
import { errorToast, successToast } from "../../../../components/Toast";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

// Function to format the date
const formatDate = (dateString) => {
  if (!dateString) return "Present"; // If date is null, undefined, or empty, return "Present"
  const date = new Date(dateString);
  // Check if date is invalid
  if (isNaN(date.getTime())) return "Present";
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const ClassicalProfessional = ({
  personalData,
  skills,
  achievements,
  certifications,
  experiences,
  languages,
  qualifications,
}) => {
  const navigate = useNavigate();
  const [loading, SetLoading] = useState(false);

  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const generatePDF = async () => {
    const resumeContent = document.getElementById("resume-content");
    if (!resumeContent) return;
    SetLoading(true);

    try {
      setIsPdfGenerating(true);
      const buttonsContainer = document.getElementById("buttons-container");
      buttonsContainer.style.display = "none";

      // Add PDF generation mode class
      resumeContent.classList.add("pdf-mode");

      const opt = {
        margin: [10, 7, 0, 7],
        filename: `${localStorage.getItem("resumeTitle") || "Resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().from(resumeContent).set(opt).save();

      // Cleanup
      resumeContent.classList.remove("pdf-mode");
      buttonsContainer.style.display = "flex";
      navigate("/scan-resume/complete");
      setIsPdfGenerating(false);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleResetResume = async () => {
    SetLoading(true);

    const userId = localStorage.getItem("ResumeBuilder-Id");
    const accessToken = localStorage.getItem("access_token");

    if (!userId || !accessToken) {
      errorToast("Missing resume ID or access token.");
      SetLoading(false);
      return;
    }

    const deleteUrl = `${BASE_URL}${API_ENDPOINTS.DeleteResumeBuilder}/${userId}`;

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        successToast("Resume reset successfully!");

        // Clear related localStorage data
        localStorage.removeItem("ResumeBuilder-Id");
        localStorage.removeItem("resumeTitle");
        localStorage.removeItem("resumeBuilderPersonalData");
        localStorage.removeItem("resumeBuilderExperiences");
        localStorage.removeItem("resumeBuilderQualifications");
        localStorage.removeItem("resumeBuilderSkills");
        localStorage.removeItem("resumeBuilderAchievements");
        localStorage.removeItem("resumeBuilderLanguages");
        localStorage.removeItem("resumeBuilderCertifications");
        localStorage.removeItem("selectedTemplate");

        navigate("/scan-resume");
      } else {
        throw new Error(responseData?.msg || "Failed to delete resume");
      }
    } catch (error) {
      console.error("Error resetting resume:", error);
      errorToast("Something went wrong while resetting the resume.");
    } finally {
      SetLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <CircularIndeterminate />
        </div>
      ) : (
        <>
          <style>
            {`
          /* Mobile-first styles */
          #resume-content {
            width: 80mm !important;
            margin: auto;
            font-family: Arial, sans-serif;
            padding: 10px;
            box-sizing: border-box;
            background-color: white;
            color: black;
          }

               /* Make resume-content 200mm on large screens */
    @media screen and (min-width: 768px) {
      #resume-content {
        width: 200mm !important;
      }
    }

          /* PDF generation mode */
          #resume-content.pdf-mode {
            width: 200mm !important;
            padding: 20px;
          }

          /* Mobile text sizes */
          .resume-name {
            font-size: 16px;
          }
          .resume-job-title {
            font-size: 14px;
          }
          .section-heading {
            font-size: 14px;
          }
          .content-text {
            font-size: 12px;
          }
          .small-text {
            font-size: 10px;
          }

          /* PDF mode text sizes */
          .pdf-mode .resume-name {
            font-size: 24px;
          }
          .pdf-mode .resume-job-title {
            font-size: 18px;
          }
          .pdf-mode .section-heading {
            font-size: 20px;
          }
          .pdf-mode .content-text {
            font-size: 16px;
          }
          .pdf-mode .small-text {
            font-size: 14px;
          }

          /* Responsive contact info */
          @media (max-width: 80mm) {
            .contact-info {
              flex-direction: column;
              gap: 0.5rem;
            }
            .contact-info > div {
              width: 100%;
              text-align: center;
            }
          }
        `}
          </style>

          <div className="h-auto max-h-[950px] overflow-auto">
            <div
              id="resume-content"
              className="main-page bg-white text-black"
              style={{
                width: "200mm",
                margin: "auto",
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                boxSizing: "border-box",
              }}
            >
              <div className="flex-grow">
                {/* Resume Content: Name, Contact Information, Education, etc. */}
                <p className="text-center text-xl  md:text-3xl font-medium">
                  {personalData.name}
                </p>
                <div className="text-center md:text-lg flex justify-center ">
                  <p>{personalData.jobTitle}</p>
                </div>
                <hr className="border-t border-black my-4" />

                {/* Professional Summary */}
                <div>
                  <p className="md:text-lg font-semibold pb-2 text-center">
                    Professional Summary
                  </p>
                  <p className="text-center text-xs md:text-base italic">
                    {personalData.summary}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="flex justify-between  pt-6 gap-x-2 md:gap-x-4">
                  <div className="flex-1 text-center">
                    <p className="text-[10px] md:text-sm px-1 md:px-2 ">
                      <strong>Phone</strong> <br />
                      {personalData.phone}
                    </p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-[10px] md:text-sm px-1 md:px-2 ">
                      <strong>Email</strong> <br /> {personalData.email}
                    </p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-[10px] md:text-sm px-1 md:px-2 ">
                      <strong>Address</strong> <br /> {personalData.address}
                    </p>
                  </div>
                </div>

                {/* Education Section */}
                {qualifications.length > 0 && (
                  <div className="mt-4">
                    <p className="md:text-xl font-bold pb-4">Education</p>
                    <div>
                      {qualifications.map((qualification, index) => (
                        <div key={index} className="mb-4 space-y-1 ">
                          <p className="font-semibold text-sm md:text-base">
                            {qualification.degreeType} in {qualification.major}{" "}
                            | {formatDate(qualification.startDate)} -{" "}
                            {formatDate(qualification.endDate)}
                          </p>
                          <p className="text-sm md:text-base">
                            {qualification.institutionName},{" "}
                            {qualification.institutionCity}
                          </p>
                          <p className="text-sm md:text-base">
                            <strong>GPA:</strong> {qualification.gpa}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Experience */}
                {experiences.length > 0 && (
                  <div className="mt-4">
                    <p className="md:text-xl font-bold pb-4">Experience</p>
                    {experiences.map((experience, index) => (
                      <div key={index} className="mb-4 space-y-1">
                        <p className="text-sm md:text-base font-semibold">
                          {experience.jobTitle} |{" "}
                          {formatDate(experience.startDate)} -{" "}
                          {formatDate(experience.endDate)}
                        </p>
                        <p className=" text-sm md:text-base">
                          {experience.companyName}, {experience.location}
                        </p>
                        <p className=" text-sm md:text-base text-justify">
                          {experience.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div className="mt-4">
                    <p className="md:text-xl font-bold pb-2">Certifications</p>
                    <ul className="list-disc list-inside space-y-2">
                      {certifications.map((certification, index) => (
                        <li
                          key={index}
                          className="font-semibold text-sm md:text-base"
                        >
                          {certification.certificationTitle} |{" "}
                          {formatDate(certification.startDate)} -{" "}
                          {formatDate(certification.endDate)}
                          {certification.certificationUrl && (
                            <p className="text-xs md:text-sm text-blue-500 underline pl-5">
                              <a
                                href={certification.certificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {certification.certificationUrl}
                              </a>
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Achievements */}
                {achievements.length > 0 && (
                  <div className="mt-4">
                    <p className="md:text-lg font-bold pb-2">Achievements</p>
                    <ul className="list-disc list-inside space-y-1">
                      {achievements.map((achievement, index) => (
                        <li key={index} className="text-sm md:text-base">
                          <strong>{achievement.awardTitle}</strong>,{" "}
                          {achievement.issuer}{" "}
                          {formatDate(achievement.startDate)} |{" "}
                          {formatDate(achievement.endDate)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <hr className="border-t border-black mt-4" />
            </div>
          </div>
          <div
            id="buttons-container"
            className="flex items-center px-1 md:px-10 py-10 justify-center space-x-2 md:space-x-10"
          >
            <Button
              // onClick={() => navigate("/scan-resume")}
              onClick={handleResetResume}
              className="p-3 flex items-center space-x-2 w-full whitespace-nowrap md:w-64 justify-center text-center text-navbar font-bold rounded-full bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
              disabled={isPdfGenerating}
            >
              Reset resume & start over
            </Button>
            <Button
              onClick={generatePDF}
              className="p-3 flex items-center space-x-2 w-full whitespace-nowrap md:w-64 justify-center text-center text-navbar font-bold rounded-full bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
              disabled={isPdfGenerating}
            >
              {isPdfGenerating ? "Generating PDF..." : "Continue"}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ClassicalProfessional;
