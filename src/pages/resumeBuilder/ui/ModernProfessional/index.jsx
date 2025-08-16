import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js"; // Import html2pdf.js
import Button from "../../../../components/Button";
import CircularIndeterminate from "../../../../components/loader/circular";
import API_ENDPOINTS from "../../../../api/endpoints";
import { errorToast, successToast } from "../../../../components/Toast";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

const formatDate = (dateString) => {
  if (!dateString) return "Present"; // If date is null, undefined, or empty, return "Present"
  const date = new Date(dateString);
  // Check if date is invalid
  if (isNaN(date.getTime())) return "Present";
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const ModernProfessional = ({
  personalData,
  skills,
  achievements,
  certifications,
  experiences,
  languages,
  qualifications,
}) => {
  const navigate = useNavigate();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [loading, SetLoading] = useState(false);

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

      const options = {
        margin: [10, 10, 5, 10],
        filename: `${localStorage.getItem("resumeTitle") || "Resume"}.pdf`,
        image: { type: "png", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().from(resumeContent).set(options).save();

      // Cleanup
      resumeContent.classList.remove("pdf-mode");
      buttonsContainer.style.display = "flex";
      navigate("/scan-resume/complete");
      setIsPdfGenerating(false);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
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
            padding: 15px;
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
            width: 210mm !important;
            padding: 40px;
          }

          /* Mobile text sizes */
          .resume-name {
            font-size: 20px;
          }
          .resume-job-title {
            font-size: 16px;
          }
          .contact-info {
            font-size: 10px;
            white-space: normal;
            word-wrap: break-word;
          }
          .section-heading {
            font-size: 16px;
            padding: 8px 16px;
            margin-bottom: 12px;
          }
          .content-text {
            font-size: 12px;
          }

          /* PDF mode text sizes */
          .pdf-mode .resume-name {
            font-size: 32px;
          }
          .pdf-mode .resume-job-title {
            font-size: 24px;
          }
          .pdf-mode .contact-info {
            font-size: 14px;
          }
          .pdf-mode .section-heading {
            font-size: 20px;
            padding: 8px 16px;
            margin-bottom: 20px;
          }
          .pdf-mode .content-text {
            font-size: 16px;
          }

          /* Skills grid for mobile */
          .skills-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding-left: 12px;
          }

          /* Skills grid for PDF */
          .pdf-mode .skills-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            padding-left: 20px;
          }

          /* Responsive flex containers */
          .flex-container {
            display: flex;
            flex-direction: column;
          }

          .pdf-mode .flex-container {
            flex-direction: row;
            justify-content: space-between;
          }

          @media (max-width: 80mm) {
            .contact-info {
              flex-direction: column;
              gap: 4px;
            }
          }
        `}
          </style>
          <div className="h-auto max-h-[950px]  overflow-auto">
            <div
              id="resume-content"
              className="w-full bg-white text-black"
              style={{
                width: "200mm",
                margin: "auto",
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                boxSizing: "border-box",
              }}
            >
              <style>
                {`
      @media (min-width: 768px) {
        #resume-content {
          padding: 40px !important;
        }
      }
    `}
              </style>
              <p className="text-left text-2xl md:text-4xl font-bold">
                {personalData.name}
              </p>
              <p className="text-left text-lg md:text-2xl font-bold">
                {personalData.jobTitle}
              </p>

              <div className="text-left text-[10px] md:text-sm flex pt-1 space-x-1">
                <p>
                  {personalData.state}, {personalData.city},{" "}
                  {personalData.country} | {personalData.phone} |{" "}
                  {personalData.linkedin} | {personalData.website}
                </p>
              </div>

              {/* Professional Summary */}
              <div className="mt-5">
                <p className=" md:text-xl font-bold py-2 px-4 mb-5 rounded-full italic border bg-lightestGrey">
                  Summary
                </p>
                <p className="text-sm md:text-normal text-justify">
                  {personalData.summary}
                </p>
              </div>

              {skills.length > 0 && (
                <div className="my-5">
                  <p className="md:text-xl font-bold py-2 px-4 mb-5 rounded-full italic border bg-lightestGrey">
                    Skills
                  </p>
                  <div className="flex flex-wrap ml-5 gap-y-2">
                    {skills.map((skill, index) => (
                      <p
                        key={index}
                        className="w-1/3 text-left text-xs md:text-base break-words"
                      >
                        {skill.skill}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Experience */}
              {experiences.length > 0 && (
                <div className="my-5">
                  <p className="md:text-xl font-bold py-2 px-4 mb-5 rounded-full italic border bg-lightestGrey">
                    Professional Experience
                  </p>
                  {experiences.map((experience, index) => (
                    <div key={index} className="mb-4 space-y-1">
                      <div className="w-full flex text-[10px] md:text-normal font-semibold items-center">
                        <p className="flex-grow ">
                          {experience.companyName}, {experience.jobTitle}
                        </p>
                        <p className="flex-grow text-left text-[8px] md:text-normal">
                          {formatDate(experience.startDate)} -{" "}
                          {formatDate(experience.endDate)}
                        </p>
                      </div>
                      <div className="text-[10px] md:text-normal text-justify">
                        <p>{experience.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {qualifications.length > 0 && (
                <div className="my-5">
                  <p className="md:text-xl font-bold py-2 px-4 mb-5 rounded-full italic border bg-lightestGrey">
                    Education
                  </p>
                  <div>
                    {qualifications.map((qualification, index) => (
                      <div
                        key={index}
                        className="mb-4 space-y-1 text-[10px] md:text-normal"
                      >
                        <div className="w-full flex font-semibold items-center">
                          <p className="flex-grow">
                            {qualification.degreeType} in {qualification.major}
                          </p>
                          <p className="text-[8px] md:text-normal flex-grow text-left">
                            {formatDate(qualification.startDate)} -{" "}
                            {formatDate(qualification.endDate)}
                          </p>
                        </div>
                        <div>
                          <p>{qualification.institutionName}</p>
                        </div>
                        <div className="flex">
                          <p className="font-bold pr-2">GPA: </p>
                          <p>{qualification.gpa}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="my-5">
                <p className="md:text-xl font-bold py-2 px-4 mb-5 rounded-full italic border bg-lightestGrey">
                  Additional Information
                </p>
                <div className="text-[10px] md:text-normal items-center">
                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <div className="flex mb-1">
                      <p className="font-bold pr-1">Certifications: </p>
                      <p>
                        {certifications
                          .map(
                            (certification) =>
                              `${certification.certificationTitle}`
                          )
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Languages */}
                  {languages.length > 0 && (
                    <div className="flex pt-1 mb-1">
                      <p className="font-bold pr-1">Languages: </p>
                      <p>
                        {languages
                          .map((language) => `${language.language}`)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Achievements */}
                  {achievements.length > 0 && (
                    <div className="flex pt-1">
                      <p className="font-bold pr-1">Achievements: </p>
                      <p>
                        {achievements
                          .map((achievement) => `${achievement.awardTitle}`)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
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

export default ModernProfessional;
