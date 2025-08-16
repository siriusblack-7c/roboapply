import React, { useState } from "react";
import DashBoardLayout from "../../dashboardLayout";
import Dropdown from "../../components/dropdown";
import SimpleInputField from "../../components/SimpleInputFields";
import Button from "../../components/Button";
import { successToast, errorToast } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import TextAreaComponent from "../../components/TextAreaComponent";
import coverLetterService from "../../api/aiService";
import CircularIndeterminate from "../../components/loader/circular";

const AiCoverLetterGenerator = () => {
  const navigate = useNavigate();
  const [selectedTone, setSelectedTone] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const [inputFields, setInputFields] = useState([
    { label: "Job Title", placeholder: "Designer", value: "" },
    { label: "Your Name", placeholder: "Philip", value: "" },
    { label: "Company Name", placeholder: "Unknown", value: "" },
    {
      label: "Your Skills",
      placeholder: "Skills will be separated using ,",
      value: "",
    },
    { label: "Role Type", placeholder: "Full time", value: "" },
    { label: "Job Location", placeholder: "Remote", value: "" },
  ]);

  const toneOptions = [
    "Formal",
    "Professional",
    "Convincing",
    "Assertive",
    "Inspirational",
    "Informational",
  ];

  const roleTypeOptions = ["Full Time", "Part Time", "Internship", "Freelance"];
  const jobLocationOptions = ["Remote", "Onsite", "Hybrid"];

  const handleToneChange = (event) => {
    setSelectedTone(event.target.value);
  };

  const handleInputChange = (event, index) => {
    const newInputFields = [...inputFields];
    newInputFields[index].value = event.target.value;
    setInputFields(newInputFields);
  };

  const handleSubmit = async () => {
    if (selectedTone === "") {
      errorToast("Please select a tone.");
      return;
    }

    const emptyInput = inputFields.find((input) => input.value === "");
    if (emptyInput) {
      errorToast(`Please fill the ${emptyInput.label} field.`);
      return;
    }

    const formData = {
      tone: selectedTone,
      job_title: inputFields[0].value,
      your_name: inputFields[1].value,
      applying_for_company: inputFields[2].value,
      your_skills: inputFields[3].value,
      role_type: inputFields[4].value,
      job_location: inputFields[5].value,
      job_description: additionalInfo,
    };

    setLoading(true);
    try {
      const response = await coverLetterService.generateCoverLetter(formData);

      if (response.cover_letter) {
        successToast("Cover letter generated successfully!");
        localStorage.setItem("coverLetterFormData", JSON.stringify(formData));
        navigate("/dashboard-cover/generate-cover", {
          state: { coverLetter: response.cover_letter },
        });
      } else {
        errorToast(response.message || "Failed to generate cover letter.");
      }
    } catch (error) {
      console.error("Error:", error);
      errorToast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <CircularIndeterminate />
        </div>
      )}
      <DashBoardLayout>
        <div className="bg-almostBlack w-full h-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
          <div className="w-full">
            <div className="text-center space-y-3 pt-5 md:pt-10 md:pb-5">
              <p className="text-xl md:text-3xl font-normal text-primary">
                AI Cover Letter Generator
              </p>
              <p className="text-sm md:text-base px-3 pb-3 md:px-0 md:pb-0 font-normal text-primary">
                Create your personalized cover letter for job applications,
                powered by AI technology—fast and free!
              </p>
            </div>
            <hr className="border-t-2 border-simplePurple mb-5 w-[60%] md:w-[40%] mx-auto" />

            <div className="w-full px-5 md:px-10 py-5 ">
              <Dropdown
                className="py-3"
                label="Select a tone"
                placeholder="Formal"
                options={toneOptions}
                onChange={handleToneChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {inputFields.map((input, index) => {
                  if (input.label === "Role Type") {
                    return (
                      <div key={index}>
                        <label className="block text-primary mb-2">
                          {input.label}
                        </label>
                        <select
                          value={input.value}
                          onChange={(event) => handleInputChange(event, index)}
                          className="block w-full bg-dropdownBackground text-primary border border-formBorders py-3 px-3 rounded-md shadow-sm"
                        >
                          <option
                            className="text-primary bg-inputBackGround"
                            value=""
                            disabled
                          >
                            Select Role Type
                          </option>
                          {roleTypeOptions.map((role) => (
                            <option
                              className="text-primary bg-inputBackGround"
                              key={role}
                              value={role}
                            >
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (input.label === "Job Location") {
                    return (
                      <div key={index}>
                        <label className="block text-primary mb-2">
                          {input.label}
                        </label>
                        <select
                          value={input.value}
                          onChange={(event) => handleInputChange(event, index)}
                          className="block w-full bg-dropdownBackground text-primary border border-formBorders py-3 px-3 rounded-md shadow-sm"
                        >
                          <option
                            className="text-primary bg-inputBackGround"
                            value=""
                            disabled
                          >
                            Select Job Location
                          </option>
                          {jobLocationOptions.map((loc) => (
                            <option
                              className="text-primary bg-inputBackGround"
                              key={loc}
                              value={loc}
                            >
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  return (
                    <SimpleInputField
                      key={index}
                      label={input.label}
                      placeholder={input.placeholder}
                      value={input.value}
                      onChange={(event) => handleInputChange(event, index)}
                    />
                  );
                })}
              </div>

              <div className="mt-5">
                <label className="block text-primary mb-2">
                  Job Description
                </label>
                <TextAreaComponent
                  placeholder="Enter job description"
                  value={additionalInfo}
                  onTextChange={setAdditionalInfo}
                />
              </div>
            </div>

            <div className="flex justify-center py-5 md:py-10">
              <Button
                onClick={handleSubmit}
                className="p-3 px-10 whitespace-nowrap md:px-20 flex items-center space-x-2 max-w-60 min-w-max h-12 text-navbar rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </>
  );
};

export default AiCoverLetterGenerator;
