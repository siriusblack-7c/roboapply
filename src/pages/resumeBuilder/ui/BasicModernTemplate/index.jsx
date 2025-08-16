import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js"; // Import html2pdf.js
import Button from "../../../../components/Button";
import CircularIndeterminate from "../../../../components/loader/circular";
import API_ENDPOINTS from "../../../../api/endpoints";
import { errorToast, successToast } from "../../../../components/Toast";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

// Function to format date (same as before)
const formatDate = (dateString) => {
  if (!dateString) return "Present";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Present";
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

const BasicModernTemplate = ({
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

      // Add a class to force A4 layout during PDF generation
      resumeContent.classList.add("pdf-mode");

      const opt = {
        margin: [10, 7, 0, 7],
        filename: `${localStorage.getItem("resumeTitle") || "Resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().from(resumeContent).set(opt).save();

      // Clean up
      resumeContent.classList.remove("pdf-mode");
      buttonsContainer.style.display = "flex";

      setIsPdfGenerating(false);
      navigate("/scan-resume/complete");
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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <CircularIndeterminate />
        </div>
      ) : (
        <>
          <style>
            {`
          /* Default mobile styles - 80mm width */
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

          /* PDF generation mode - A4 size */
          #resume-content.pdf-mode {
            width: 200mm !important;
            padding: 20px;
          }

          /* Responsive text sizes */
          .mobile-text-xs {
            font-size: 8px;
          }
          .mobile-text-sm {
            font-size: 10px;
          }
          .mobile-text-base {
            font-size: 12px;
          }
          .mobile-text-lg {
            font-size: 14px;
          }
          .mobile-text-xl {
            font-size: 16px;
          }

          /* PDF mode text sizes */
          .pdf-mode .mobile-text-xs {
            font-size: 12px;
          }
          .pdf-mode .mobile-text-sm {
            font-size: 14px;
          }
          .pdf-mode .mobile-text-base {
            font-size: 16px;
          }
          .pdf-mode .mobile-text-lg {
            font-size: 18px;
          }
          .pdf-mode .mobile-text-xl {
            font-size: 24px;
          }
        `}
          </style>
          <div className="h-auto max-h-[950px] overflow-auto ">
            <div
              id="resume-content"
              className="w-full bg-primary text-black"
              style={{
                width: "200mm",
                margin: "auto",
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                boxSizing: "border-box",
              }}
            >
              <div className="text-center w-full pb-1">
                <p className=" text-2xl whitespace-nowrap md:text-4xl font-bold">
                  {personalData.name}
                </p>
              </div>
              <div className="text-center text-[8px] md:text-xs flex justify-center pt-1 space-x-1">
                <p>{personalData.address},</p>
                <p>{personalData.city},</p>
                <p>{personalData.country} |</p>
                <p>{personalData.phone}</p>
              </div>
              <div className="text-center text-[10px] md:text-base flex justify-center space-x-1">
                <p>{personalData.linkedin} </p>
                <p>{personalData.website}</p>
              </div>

              <hr className="border-t-2 border-black my-6" />

              {/* Professional Summary */}
              <div>
                <p className="md:text-xl font-bold pb-3">
                  Professional Summary
                </p>
                <p className="text-sm md:text-base text-justify">
                  {personalData.summary}
                </p>
              </div>

              {/* Education */}
              {qualifications.length > 0 && (
                <div>
                  <hr className="border-t-2 border-black my-6" />
                  <p className="md:text-xl font-bold pb-4">Education</p>
                  <div>
                    {qualifications.map((qualification, index) => (
                      <div key={index} className="mb-4 space-y-1">
                        <div className="w-full text-sm md:text-base flex justify-between">
                          <p>{qualification.institutionName}</p>
                          <p>
                            {formatDate(qualification.startDate)} -{" "}
                            {formatDate(qualification.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm md:text-base font-bold">
                            {qualification.degreeType} in {qualification.major}
                          </p>
                        </div>
                        <div className="flex text-sm md:text-base">
                          <p className="font-bold pr-2">GPA: </p>
                          <p>{qualification.gpa}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Relevant Experience */}
              {experiences.length > 0 && (
                <div>
                  <hr className="border-t-2 border-black my-6" />
                  <p className="md:text-xl font-bold pb-4">
                    Relevant Experience
                  </p>
                  {experiences.map((experience, index) => (
                    <div
                      key={index}
                      className="mb-5 space-y-1 text-sm md:text-base"
                    >
                      <div className="w-full flex justify-between">
                        <p>{experience.companyName}</p>
                        <p>
                          {formatDate(experience.startDate)} -{" "}
                          {formatDate(experience.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">{experience.jobTitle}</p>
                      </div>
                      <div>
                        <p>{experience.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Achievements */}
              {achievements.length > 0 && (
                <div>
                  <hr className="border-t-2 border-black my-6" />
                  <p className="md:text-xl font-bold pb-4">Achievements</p>
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="mb-5 space-y-1 text-sm md:text-base"
                    >
                      <div className="w-full flex justify-between">
                        <p>{achievement.awardTitle}</p>
                        <p>
                          {formatDate(achievement.startDate)} -{" "}
                          {formatDate(achievement.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">{achievement.issuer}</p>
                      </div>
                      <div>
                        <p>{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <hr className="border-t-2 border-black my-6" />

              {/* Certifications */}
              {certifications.length > 0 && (
                <div className="flex text-sm md:text-base">
                  <p className="font-bold pr-1">Certifications: </p>
                  <p className="">
                    {certifications
                      .map(
                        (certification) => `${certification.certificationTitle}`
                      )
                      .join(", ")}
                  </p>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="flex text-sm md:text-base">
                  <p className="font-bold pr-1">Skills: </p>
                  <p>{skills.map((skill) => `${skill.skill}`).join(", ")}</p>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div className="flex ">
                  <p className="font-bold pr-1">Languages: </p>
                  <p>
                    {languages
                      .map((language) => `${language.language}`)
                      .join(", ")}
                  </p>
                </div>
              )}

              <hr className="border-t-2 border-black my-6" />
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

export default BasicModernTemplate;
