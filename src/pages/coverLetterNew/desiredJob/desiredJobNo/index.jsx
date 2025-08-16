import React, { useState } from "react";
import DashBoardLayout from "../../../../dashboardLayout";
import SimpleInputField from "../../../../components/SimpleInputFields";
import Button from "../../../../components/Button";
import { errorToast } from "../../../../components/Toast";
import { useNavigate } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";
import CircularIndeterminate from "../../../../components/loader/circular";
import API_ENDPOINTS from "../../../../api/endpoints";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

const dummyPositions = [
  "Software Developer",
  "Healthcare Professional",
  "Cybersecurity Analyst",
  "Financial Analyst",
  "IT Manager",
  "Data Scientist",
  "Marketing Manager",
  "Teacher",
];

const DesiredJobNo = () => {
  const navigate = useNavigate();
  const [desiredPosition, setDesiredPosition] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChipClick = (position) => {
    setDesiredPosition(position);
  };

  const handleContinue = async () => {
    if (!desiredPosition.trim()) {
      errorToast("Please enter or select a desired position.");
      return;
    }

    const savedDetails = JSON.parse(localStorage.getItem("detailCoverletter"));

    const coverletterDetails = {
      desiredPosition: desiredPosition.trim(),
      companyName: "",
      hiringManager: "",
      description: "",
    };

    if (
      savedDetails &&
      savedDetails.desiredPosition === desiredPosition.trim()
    ) {
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

  const handleBack = () => {
    navigate(-1);
  };

  return loading ? (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <CircularIndeterminate />
    </div>
  ) : (
    <DashBoardLayout>
      <div className="flex flex-col h-full bg-almostBlack">
        <div className="bg-almostBlack w-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
          {/* Stepper */}
          <div className="w-full py-5 px-3">
            <div className="flex items-center justify-center relative">
              <div className="flex items-center">
                {[1, 2, 3].map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          step === 1
                            ? "bg-stepperBackground text-primary"
                            : "border border-stepperBackground text-primary"
                        }`}
                      >
                        {step}
                      </div>
                      <span className="text-primary text-xs md:text-sm mt-2 absolute top-12">
                        {step === 1
                          ? "Add details"
                          : step === 2
                          ? "Personalize"
                          : "Download"}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className="flex items-center">
                        <div className="w-5 md:w-28 lg:w-32 h-1 border-t-2"></div>
                        <div className="text-lg md:text-2xl">{`>`}</div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="px-[5%] md:px-[20%] text-center pt-14 border border-l-0 border-r-0 border-t-0 border-purple pb-5">
            <p className="text-primary text-lg md:text-3xl font-semibold">
              Add your desired position
            </p>
          </div>

          {/* Input Field */}
          <div className="px-[5%] md:px-[30%] mt-20">
            <SimpleInputField
              placeholder="Product Designer"
              value={desiredPosition}
              onChange={(e) => setDesiredPosition(e.target.value)}
            />
          </div>

          {/* Chips */}
          <div className="px-[5%] md:px-[30%] mt-20 flex flex-wrap md:mt-10 gap-4">
            {dummyPositions.map((position) => (
              <div
                key={position}
                onClick={() => handleChipClick(position)}
                className={`relative text-primary py-5 px-12 rounded-lg flex items-center justify-center cursor-pointer ${
                  desiredPosition === position
                    ? "border-2 border-customPurple bg-modalPurple"
                    : "border-2 border-customGray bg-lightGreyBackground"
                }`}
              >
                {position}
                {desiredPosition === position && (
                  <IoCheckmarkCircle className="absolute bottom-[44px] right-0 text-prupleText text-2xl" />
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center space-x-4 mt-10">
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
    </DashBoardLayout>
  );
};

export default DesiredJobNo;
