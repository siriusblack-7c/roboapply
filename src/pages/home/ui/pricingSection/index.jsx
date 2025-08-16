import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Button from "../../../../components/Button";
import InputField from "../../../../components/EmailInput";
import PaymentModal from "../paymentModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ToggleSwitch from "../toggleSwitch";
import TagIcon from "../../../../assets/Tag.png";
import TagIcon15 from "../../../../assets/Tag15.png";

import { HiArrowLeft } from "react-icons/hi";
import { SlArrowRight } from "react-icons/sl";

const stripePromise = loadStripe("your-public-key");

const PricingSection = () => {
  const [billingCategory, setBillingCategory] = useState("individual");
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [isChecked, setIsChecked] = useState({});
  const [emails, setEmails] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const navigate = useNavigate();

  const plans = {
    individual: [
      {
        title: "Standard Plan",
        monthlyPrice: "$39.99",
        yearlyPrice: "$383.90",
        extraText: "Save $96",
        features: [
          { text: "LinkedIn Automation", available: true, color: "white" },
          { text: "Indeed Automation", available: true, color: "white" },
          { text: "Monster Automation", available: true, color: "white" },
          { text: "ZipRecruiter Automation", available: true, color: "white" },
          { text: "Dice Automation", available: true, color: "white" },
          { text: "SimplyHired Automation", available: true, color: "white" },
          {
            text: "Daily Limit",
            available: true,
            color: "white",
            second_text: "500 Job applications",
            second_text_color: "grey",
          },
          {
            text: "Addvanced Resume Builder",
            available: true,
            color: "white",
            second_text: "With personalized options",
            second_text_color: "grey",
          },
          {
            text: "Resume Scoring",
            available: true,
            color: "white",
            second_text: "For up to 5 Resumes/CVs",
            second_text_color: "grey",
          },
          {
            text: "Personalized AI Cover Letter Generator Tool",
            available: true,
            color: "white",
          },
          {
            text: "Advanced Analytics",
            available: true,
            color: "white",
            second_text: "With Deeper Insights",
            second_text_color: "grey",
          },
          { text: "CV Improvement Tips", available: true, color: "white" },
          {
            text: "Priority Customer Support",
            available: true,
            color: "white",
          },
          { text: "Single User Access", available: true, color: "white" },
          { text: "All Basic Features ", available: true, color: "white" },
          {
            text: "Unlimited Cover Letter Generation",
            available: true,
            color: "white",
          },
          {
            text: "Advance Interview Preparation Tools",
            available: true,
            color: "white",
          },
          {
            text: "Access To Job Matching Algorithms",
            available: true,
            color: "white",
          },

          {
            text: "Restrictions",
            available: true,
            color: "white",
            second_text:
              "Limited to 5 Resumes/CVs for scoring and optimization.No access to exclusive updates and features reserved for Unlimited Plan.Limited advanced analytics compared to Unlimited Plan.",
            second_text_color: "grey",
          },
          // { text: 'Secure, encrypted resume storage', available: true, color: 'white' },
          // { text: 'Integration with AI resume scanning tools', available: true, color: 'white' },
          // { text: '24/7 customer support', available: true, color: 'white' },
          // { text: 'AI-powered job matching for teams', available: false, color: '#5C5863' },
          // { text: 'Dedicated enterprise support services', available: false, color: '#5C5863' },
        ],
      },
      {
        title: "Basic Plan",
        monthlyPrice: "$19.99",
        yearlyPrice: "$191.90",
        extraText: "Save $48",

        features: [
          { text: "LinkedIn Automation", available: true, color: "white" },
          { text: "Indeed Automation", available: false, color: "white" },
          { text: "Monster Automation", available: false, color: "white" },
          { text: "ZipRecruiter Automation", available: false, color: "white" },
          { text: "Dice Automation", available: false, color: "white" },
          { text: "SimplyHired Automation", available: false, color: "white" },
          {
            text: "Daily Limit",
            available: true,
            color: "white",
            second_text: "150 Job applications",
            second_text_color: "grey",
          },
          {
            text: "Resume Builder",
            available: true,
            color: "white",
            second_text: "With access to basic templates",
            second_text_color: "grey",
          },
          {
            text: "Resume Scoring",
            available: true,
            color: "white",
            second_text: "For 1 Resume/CV",
            second_text_color: "grey",
          },
          {
            text: "CV Improvement Tips",
            available: true,
            color: "white",
          },
          {
            text: "Standard Customer Support",
            available: true,
            color: "white",
          },

          { text: "Single User Access", available: true, color: "white" },
          {
            text: "Job Application Automation",
            available: true,
            color: "white",
          },

          {
            text: "ATS Friendly Resume Optimization",
            available: true,
            color: "white",
          },
          {
            text: "Unlimited Cover Letter Generation",
            available: true,
            color: "white",
          },
          {
            text: "Basic Interview Preparation Tools",
            available: true,
            color: "white",
          },

          {
            text: "Restrictions",
            available: true,
            color: "white",
            second_text: [
              "Limited to 1 Resume/CV for scoring and optimization",
              // "No access to personalized cover letter creation tools",
              "Basic day-wise analytics without advanced insights",
              "No priority support",
              "Limited templates for resume builder",
              "No exclusive access to future updates and features",
            ],
            second_text_color: "grey",
          },

          // { text: 'Secure, encrypted resume storage', available: true, color: 'white' },
          // { text: 'Integration with AI resume scanning tools', available: true, color: 'white' },
          // { text: '24/7 customer support', available: true, color: 'white' },
          // { text: 'AI-powered job matching for teams', available: false, color: '#5C5863' },
          // { text: 'Dedicated enterprise support services', available: false, color: '#5C5863' },
        ],
      },
      {
        title: "Premium Plan",
        monthlyPrice: "$59.99",
        yearlyPrice: "$575.90",
        extraText: "Save $144",

        features: [
          { text: "LinkedIn Automation", available: true, color: "white" },
          { text: "Indeed Automation", available: true, color: "white" },
          { text: "Monster Automation", available: true, color: "white" },
          { text: "ZipRecruiter Automation", available: true, color: "white" },
          { text: "Dice Automation", available: true, color: "white" },
          { text: "SimplyHired Automation", available: true, color: "white" },
          {
            text: "Daily Limit",
            available: true,
            color: "white",
            second_text: "Unlimited Job applications",
            second_text_color: "grey",
          },
          {
            text: "Advanced Resume Builder",
            available: true,
            color: "white",
            second_text: "With personalized options",
            second_text_color: "grey",
          },
          {
            text: "Resume Scoring",
            available: true,
            color: "white",
            second_text: "For up to 5 Resumes/CVs",
            second_text_color: "grey",
          },
          {
            text: "Personalized AI Cover Letter Generator Tool",
            available: true,
            color: "white",
          },
          {
            text: "Advanced Analyics",
            available: true,
            color: "white",
            second_text: "With deeper insights",
            second_text_color: "grey",
          },
          {
            text: "CV Improvement Tips",
            available: true,
            color: "white",
          },
          {
            text: "Priority Customer Support",
            available: true,
            color: "white",
          },

          { text: "Single User Access", available: true, color: "white" },
          {
            text: "Unlimited Cover Letter Generation",
            available: true,
            color: "white",
          },
          { text: "All Basic Features", available: true, color: "white" },
          {
            text: "Advance Interview Preparation Tools",
            available: true,
            color: "white",
          },
          {
            text: "Access To Job Matching Algorithms",
            available: true,
            color: "white",
          },

          // {
          //   text: "Exclusive Access to future updates and features",
          //   available: true,
          //   color: "white",
          // },
          // { text: "All Standard Features", available: true, color: "white" },
          // {
          //   text: "Personalized Career Coaching",
          //   available: true,
          //   color: "white",
          // },
          // { text: "Priority Support", available: true, color: "white" },
          // {
          //   text: "Analytics On Application Success Rates",
          //   available: true,
          //   color: "white",
          // },

          {
            text: "No Restrictions",
            available: true,
            color: "white",
            second_text: "None on features",
            second_text_color: "grey",
          },
          // { text: 'Secure, encrypted resume storage', available: true, color: 'white' },
          // { text: 'Integration with AI resume scanning tools', available: true, color: 'white' },
          // { text: '24/7 customer support', available: true, color: 'white' },
          // { text: 'AI-powered job matching for teams', available: false, color: '#5C5863' },
          // { text: 'Dedicated enterprise support services', available: false, color: '#5C5863' },
        ],
      },
    ],
    enterprise: [
      {
        title: "Medium University Plan",
        monthlyPrice: "$499",
        yearlyPrice: "$5090",
        extraText: "Up to 500 Students",
        extraText2: "Save $898",

        features: [
          { text: "LinkedIn Automation", available: true, color: "white" },
          { text: "Indeed Automation", available: true, color: "white" },
          { text: "Monster Automation", available: true, color: "white" },
          { text: "ZipRecruiter Automation", available: true, color: "white" },
          { text: "Dice Automation", available: true, color: "white" },
          { text: "SimplyHired Automation", available: true, color: "white" },
          {
            text: "Daily Limit",
            available: true,
            color: "white",
            second_text: "500 Job applications",
            second_text_color: "grey",
          },
          {
            text: "Addvanced Resume Builder",
            available: true,
            color: "white",
            second_text: "With personalized options",
            second_text_color: "grey",
          },
          {
            text: "Resume Scoring",
            available: true,
            color: "white",
            second_text: "For up to 5 Resumes/CVs",
            second_text_color: "grey",
          },
          {
            text: "Personalized AI Cover Letter Generator Tool",
            available: true,
            color: "white",
          },
          {
            text: "Advanced Analytics",
            available: true,
            color: "white",
            second_text: "With Deeper Insights",
            second_text_color: "grey",
          },

          { text: "CV Improvement Tips", available: true, color: "white" },
          {
            text: "Priority Customer Support",
            available: true,
            color: "white",
          },
          { text: "Multiple User Access", available: true, color: "white" },
          { text: "All Basic Features", available: true, color: "white" },
          {
            text: "Unlimited Cover Letter Generation",
            available: true,
            color: "white",
          },
          {
            text: "Advance Interview Preparation Tools",
            available: true,
            color: "white",
          },
          {
            text: "Access To Job Matching Algorithms",
            available: true,
            color: "white",
          },

          {
            text: "Restrictions",
            available: true,
            color: "white",
            second_text:
              "Limited to 5 Resumes/CVs for scoring and optimization.No access to exclusive updates and features reserved for Unlimited Plan.Limited advanced analytics compared to Unlimited Plan.",
            second_text_color: "grey",
          },
        ],
      },
      {
        title: "Small University Plan",
        monthlyPrice: "$299",
        yearlyPrice: "$3050",
        extraText: "Up to 250 Students",
        extraText2: "Save $538",

        features: [
          { text: "LinkedIn Automation", available: true, color: "white" },
          { text: "Indeed Automation", available: true, color: "white" },
          { text: "Monster Automation", available: false, color: "white" },
          { text: "ZipRecruiter Automation", available: false, color: "white" },
          { text: "Dice Automation", available: false, color: "white" },
          { text: "SimplyHired Automation", available: false, color: "white" },
          {
            text: "Daily Limit",
            available: true,
            color: "white",
            second_text: "150 Job applications",
            second_text_color: "grey",
          },
          {
            text: "Resume Builder",
            available: true,
            color: "white",
            second_text: "With access to basic templates",
            second_text_color: "grey",
          },
          {
            text: "Resume Scoring",
            available: true,
            color: "white",
            second_text: "For 1 Resumes/CV",
            second_text_color: "grey",
          },
          {
            text: "CV Improvement Tips",
            available: true,
            color: "white",
          },
          {
            text: "Standard Customer Support",
            available: true,
            color: "white",
          },

          { text: "Multiple User Access", available: true, color: "white" },

          {
            text: "Job Application Automation",
            available: true,
            color: "white",
          },
          {
            text: "ATS Friendly Resume Optomization",
            available: true,
            color: "white",
          },
          {
            text: "Unlimited Cover Letter Generation",
            available: true,
            color: "white",
          },
          {
            text: "Basic Interview Preparation Tools",
            available: true,
            color: "white",
          },

          {
            text: "Restrictions",
            available: true,
            color: "white",
            second_text: [
              "Limited to 1 Resume/CV for scoring and optimization",
              // "No access to personalized cover letter creation tools",
              "Basic day-wise analytics without advanced insights",
              "No priority support",
              "Limited templates for resume builder",
              "No exclusive access to future updates and features",
            ],
            second_text_color: "grey",
          },
        ],
      },
      {
        title: "Large University Plan", // New Plan added here
        monthlyPrice: "$999",
        yearlyPrice: "$10190",
        extraText: "Unlimited Students",
        extraText2: "Save $1798",
        features: [
          { text: "LinkedIn Automation", available: true, color: "white" },
          { text: "Indeed Automation", available: true, color: "white" },
          { text: "Monster Automation", available: true, color: "white" },
          { text: "ZipRecruiter Automation", available: true, color: "white" },
          { text: "Dice Automation", available: true, color: "white" },
          { text: "SimplyHired Automation", available: true, color: "white" },
          {
            text: "Daily Limit",
            available: true,
            color: "white",
            second_text: "Unlimited Job applications",
            second_text_color: "grey",
          },
          {
            text: "Advanced Resume Builder",
            available: true,
            color: "white",
            second_text: "With personalized options",
            second_text_color: "grey",
          },
          {
            text: "Resume Scoring",
            available: true,
            color: "white",
            second_text: "For up to 5 Resumes/CVs",
            second_text_color: "grey",
          },
          {
            text: "Personalized AI Cover Letter Generator Tool",
            available: true,
            color: "white",
          },
          {
            text: "Advanced Analytics",
            available: true,
            color: "white",
            second_text: "FWith deeper insights",
            second_text_color: "grey",
          },
          {
            text: "CV Improvement Tips",
            available: true,
            color: "white",
          },
          {
            text: "Priority Customer Support",
            available: true,
            color: "white",
          },

          { text: "Multiple User Access", available: true, color: "white" },
          { text: "All Basic Features", available: true, color: "white" },

          {
            text: "Unlimited Cover Letter Generation",
            available: true,
            color: "white",
          },
          {
            text: "Advance Interview Preparation Tools",
            available: true,
            color: "white",
          },
          {
            text: "Access To Job Matching Algorithms",
            available: true,
            color: "white",
          },

          {
            text: "No Restrictions",
            available: true,
            color: "white",
            second_text: "None on features",
            second_text_color: "grey",
          },
        ],
      },
    ],
  };

  const handleBillingCategoryChange = (value) => {
    setBillingCategory(value);
    setBillingPeriod("monthly"); // Reset billing period for enterprise
  };

  const handleBillingPeriodChange = (value) => {
    setBillingPeriod(value);
  };

  const handleCheckboxChange = (planTitle) => {
    setIsChecked((prev) => ({
      ...prev,
      [planTitle]: !prev[planTitle],
    }));
  };

  const handleEmailChange = (planTitle, value) => {
    setEmails((prev) => ({ ...prev, [planTitle]: value }));
  };

  const handlePlanSelection = (plan) => {
    // if (!emails[plan.title]) {
    //   alert(`Please enter an email address for ${plan.title}`);
    //   return;
    // }

    setSelectedPlan({
      ...plan,
      price:
        billingCategory === "enterprise"
          ? isYearly
            ? plan.yearlyPrice
            : plan.monthlyPrice
          : isYearly
          ? plan.yearlyPrice
          : plan.monthlyPrice,
      billingCategory,
      billingPeriod,
      email: emails[plan.title],
      includeGPT4: isChecked[plan.title] || false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <>
      <div className="bg-almostBlack w-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
        <div className="w-full">
          <div className="w-full p-3 md:p-10">
            <div className="flex items-center justify-between md:px-7"></div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="p-3 px-3 flex items-center space-x-2 max-w-40 min-w-max text-navbar font-bold rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
            >
              <HiArrowLeft className="mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
      <Elements stripe={stripePromise}>
        <div className="pb-16 px-[17%] text-center">
          <p className="text-4xl font-semibold text-primary mb-14">
            Choose Your Ideal Plan with AI Jobs Pricing Options
          </p>

          {/* Individual/Enterprise Toggle */}
          <div className="flex justify-center space-x-4 mb-10">
            <div className="relative p-2 bg-lightGreyBackground rounded-full flex items-center">
              <div
                className={`absolute top-0 bottom-0 left-1 w-[47%] border-4 border-[#DFA325] m-[4px] rounded-full transition-transform duration-300 ease-in-out ${
                  billingCategory === "individual"
                    ? "translate-x-0"
                    : "translate-x-full"
                }`}
              />
              <button
                onClick={() => handleBillingCategoryChange("individual")}
                className={`relative z-10 px-8 py-2 rounded-full text-xl font-bold transition-colors duration-300 ${
                  billingCategory === "individual"
                    ? "text-[#DFA325]"
                    : "text-lightGrey"
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => handleBillingCategoryChange("enterprise")}
                className={`relative z-10 px-8 py-2 rounded-full text-xl font-bold transition-colors duration-300 ${
                  billingCategory === "enterprise"
                    ? "text-[#DFA325]"
                    : "text-lightGrey"
                }`}
              >
                Enterprise
              </button>
            </div>
          </div>

          {/* Monthly/Yearly Toggle for Enterprise */}
          {billingCategory === "individual" && (
            <div className="flex justify-center space-x-4 mb-10">
              <ToggleSwitch isYearly={isYearly} setIsYearly={setIsYearly} />
            </div>
          )}
          {billingCategory === "enterprise" && (
            <div className="flex justify-center space-x-4 mb-10">
              <ToggleSwitch isYearly={isYearly} setIsYearly={setIsYearly} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {plans[billingCategory].map((plan) => (
              <>
                {/* Plan details */}
                <div
                  key={plan.title}
                  className="bg-transparent rounded-lg shadow-lg p-6 flex flex-col transition-transform transform hover:translate-y-[-10px] hover:shadow-2xl relative border border-[#8C20F8]"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#FFC107"; // Yellow color on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#7546C0"; // Reset back to purple
                  }}
                  style={{ position: "relative" }} // Ensure the pseudo-elements position correctly
                >
                  {/* Gradient Borders */}
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[rgba(223,163,37,1)] to-[rgba(142,84,233,0.8)]"></div>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[rgba(223,163,37,1)] to-[rgba(142,84,233,0.8)]"></div>
                  {/* Conditionally render the Standard Plan button */}
                  <div className="flex justify-center w-full">
                    {plan.title === "Standard Plan" ||
                    plan.title === "Medium University Plan" ? (
                      <div className="flex my-4 p-3 px-6 items-center space-x-2 max-w-40 min-w-max h-10 text-navbar bg-[#FFC107] text-black font-semibold rounded-full">
                        <div className="flex justify-between items-center gap-4">
                          <p>Most Popular!!!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="my-4 h-10"></div>
                    )}
                  </div>

                  {(plan?.title === "Basic Plan" ||
                    plan.title === "Platinum Plan") && (
                    <img
                      src={TagIcon}
                      alt={"tag"}
                      className="w-20 h-auto object-contain absolute right-[30px] top-[-18px]"
                      loading="lazy"
                    />
                  )}
                  {(plan?.title === "Small University Plan" ||
                    plan.title === "Platinum Plan") && (
                    <img
                      src={TagIcon15}
                      alt={"tag"}
                      className="w-20 h-auto object-contain absolute right-[30px] top-[-18px]"
                      loading="lazy"
                    />
                  )}

                  <div className="flex flex-col flex-grow">
                    <p className="text-lg font-semibold mb-4">{plan.title}</p>
                    <p className="text-4xl font-semibold mb-4">
                      {billingCategory === "enterprise"
                        ? isYearly
                          ? plan.yearlyPrice
                          : plan.monthlyPrice
                        : isYearly
                        ? plan.yearlyPrice
                        : plan.monthlyPrice}

                      <span className="text-base font-medium">
                        /
                        {billingCategory === "enterprise"
                          ? isYearly
                            ? "year"
                            : "month"
                          : isYearly
                          ? "year"
                          : "month"}
                      </span>
                    </p>
                    {/* Conditional rendering of extra text or empty div */}
                    <div className="flex justify-center w-full min-h-[40px]">
                      {
                        billingCategory === "enterprise" ? (
                          isYearly ? (
                            <p className="text-yellowColor text-2xl font-semibold mb-4">
                              {plan.extraText2}
                            </p>
                          ) : (
                            <p className="text-yellowColor text-2xl font-semibold mb-4">
                              {plan.extraText}
                            </p>
                          )
                        ) : isYearly ? (
                          <p className="text-yellowColor text-2xl font-semibold mb-4">
                            {plan.extraText}
                          </p>
                        ) : (
                          <div className="h-[50px]"></div>
                        ) // Empty div with same height
                      }
                    </div>

                    <ul className="mb-7 space-y-7">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2  text-left"
                        >
                          <span>
                            {feature.available ? (
                              <FaCheck
                                className="text-white-500 "
                                color="#158240"
                                // style={{ minWidth: "fit-content" }}
                              />
                            ) : (
                              <RxCross2
                                className="text-white-500"
                                color="red"
                              />
                            )}
                          </span>
                          <span style={{ color: feature.color }}>
                            {feature.text}
                            {/* Conditionally render the second text as a list if it's an array */}
                            {feature.second_text &&
                            Array.isArray(feature.second_text) ? (
                              <ul
                                style={{
                                  color: feature.second_text_color,
                                  listStyleType: "disc",
                                  paddingLeft: "20px",
                                  marginTop: "1rem",
                                }}
                              >
                                {feature.second_text.map((subItem, idx) => (
                                  <li key={idx}>{subItem}</li>
                                ))}
                              </ul>
                            ) : (
                              feature.second_text && (
                                <span
                                  style={{ color: feature.second_text_color }}
                                >
                                  {` - ${feature.second_text}`}
                                </span>
                              )
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* {(plan.title === "Platinum Plan" ||
                    plan.title === "Basic Plan") && (
                    <div className="p-4 border border-gray-500 rounded-md mt-5 flex justify-between">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked[plan.title] || false}
                          onChange={() => handleCheckboxChange(plan.title)}
                        />
                        <div
                          className={`w-5 h-5 border border-gray-500 rounded-md flex items-center justify-center cursor-pointer ${
                            isChecked[plan.title]
                              ? "bg-gradient-to-b from-[#AF63FB] to-[#8C20F8]"
                              : "bg-transparent"
                          }`}
                        >
                          {isChecked[plan.title] && (
                            <span className="text-white text-lg">&#10003;</span>
                          )}
                        </div>
                        <span>Include GPT-4</span>
                      </label>
                      <span className="text-gray-500">+ $8 / month</span>
                    </div>
                  )} */}

                  <div className="flex flex-col gap-2">
                    <p className="mt-4 text-left ml-8 mr-8">
                      Enter the email to which the RoboApply plan has to be
                      added (Must be a Gmail account)
                    </p>
                    <InputField
                      type="text"
                      placeholder="Email Address"
                      className="mt-4"
                      value={emails[plan.title] || ""}
                      onChange={(e) =>
                        handleEmailChange(plan.title, e.target.value)
                      }
                    />
                    <Button
                      className="mt-4 p-3 px-8 w-full  text-center bg-transparent text-lg font-medium border-2 border-yellow text-primary hover:bg-yellow hover:text-black hover:font-bold rounded-full"
                      onClick={() => handlePlanSelection(plan)}
                    >
                      Choose plan
                    </Button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>

        <PaymentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          data={selectedPlan}
        />
      </Elements>
    </>
  );
};

export default PricingSection;
