import React, { useState, useEffect } from "react";
import DashBoardLayout from "../../../../dashboardLayout";
import SimpleInputField from "../../../../components/SimpleInputFields";
import Button from "../../../../components/Button";
import { errorToast } from "../../../../components/Toast";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../../../api/endpoints";
import CircularIndeterminate from "../../../../components/loader/circular";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

const DesiredJobYes = () => {
  const navigate = useNavigate();
  const [desiredPosition, setDesiredPosition] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem("detailCoverletter"));
    if (savedDetails) {
      setDesiredPosition(savedDetails.desiredPosition || "");
      setCompanyName(savedDetails.companyName || "");
      setHiringManager(savedDetails.hiringManager || "");
      setDescription(savedDetails.description || "");
    }
  }, []);

  // Handle Continue
  const handleContinue = async () => {
    if (!desiredPosition.trim()) {
      errorToast("Desired position is required.");
      return;
    }

    const savedDetails = JSON.parse(localStorage.getItem("detailCoverletter"));

    const coverletterDetails = {
      desiredPosition,
      companyName: companyName?.trim() || "",
      hiringManager: hiringManager?.trim() || "",
      description: description?.trim() || "",
    };

    // If saved desiredPosition is the same, skip API call
    if (savedDetails && savedDetails.desiredPosition === desiredPosition) {
      navigate("/coverletter/professionalSkills");
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      errorToast("Access token is missing.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GenerateSkillsCoverLetter}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(coverletterDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate cover letter data");
      }

      const responseData = await response.json();

      localStorage.setItem(
        "detailCoverletter",
        JSON.stringify(coverletterDetails)
      );
      localStorage.setItem(
        "skillsDataCoverLetter",
        JSON.stringify(responseData.skills)
      );

      setLoading(false);
      navigate("/coverletter/professionalSkills");
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      errorToast("Something went wrong while generating cover letter.");
    }
  };

  // Handle Back
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <>
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <CircularIndeterminate />
        </div>
      ) : (
        <DashBoardLayout>
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
                          Add details
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
                          Personalize
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
                          Download
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-[5%] md:px-[20%] ">
                  <div className="text-center pt-14 border border-l-0 border-r-0 border-t-0 border-purple pb-5">
                    <p className="text-primary text-lg md:text-3xl font-semibold">
                      Please provide details of your desired job
                    </p>
                    <p className="text-primary text-base md:text-xl font-normal pt-2">
                      To craft a personalized and impactful cover letter, we
                      need some details about the job you’re targeting. This
                      helps our AI tailor your strengths, experience, and goals
                      to match the role perfectly.
                    </p>
                  </div>
                </div>
                <div className="px-[5%] md:px-[30%] mt-20 ">
                  <SimpleInputField
                    label="Add your desired position"
                    placeholder="Product Designer"
                    value={desiredPosition}
                    onChange={(e) => setDesiredPosition(e.target.value)} // Update desired position
                  />
                  <SimpleInputField
                    label="Company Name (optional)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)} // Update company name
                  />
                  <SimpleInputField
                    label="Hiring Manager Name"
                    placeholder="Philip Maya"
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)} // Update hiring manager
                  />
                  <div className="">
                    <label className="text-primary text-lg font-semibold">
                      Enter Description
                    </label>
                    <textarea
                      className="w-full p-3 my-2 text-base text-primary placeholder:text-primary border border-formBorders rounded bg-dropdownBackground resize-none"
                      rows="5"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)} // Update description
                    />
                  </div>
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <Button
                      onClick={handleBack}
                      className="py-3 px-8 md:px-12 flex items-center justify-center bg-almostBlack text-xl font-bold rounded-full border-2 border-purple hover:ring-2 hover:ring-purple focus:ring-2 focus:ring-purple"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="py-3 px-4 sm:px-10 flex items-center justify-center text-xl font-bold rounded-full bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashBoardLayout>
      )}
    </>
  );
};

export default DesiredJobYes;
