// Skills.js
import React, { useState } from "react";
import SimpleInputField from "../../../../components/SimpleInputFields";
import Button from "../../../../components/Button";

const Skills = ({ skillsList = [], addSkill, deleteSkill }) => {
  // Default skillsList to an empty array
  const [skill, setSkill] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [defaultExperience, setDefaultExperience] = useState("");
  const [errors, setErrors] = useState({ skill: false, years: false });

  const handleAddSkill = () => {
    const experience = yearsOfExperience || defaultExperience;
    if (!skill || !experience) {
      setErrors({
        skill: !skill,
        years: !experience,
      });
      return;
    }

    addSkill({ skill, yearsOfExperience: experience });

    setSkill("");
    setYearsOfExperience("");
    setErrors({ skill: false, years: false });
  };

  return (
    <>
      <div className="items-center justify-start w-full flex">
        <p className="text-xl text-primary font-normal border-b-2 border-purple pb-1">
          Skills
        </p>
      </div>
      <div className="w-[100%] md:w-[80%]">
        <div className="flex space-x-4 mb-4">
          <SimpleInputField
            placeholder="Enter a Skill"
            value={skill}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                setSkill(inputValue);
              }
            }}
            className="w-full"
            error={errors.skill}
          />
          <SimpleInputField
            placeholder="Years of Experience"
            value={yearsOfExperience}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value))
                setYearsOfExperience(e.target.value);
            }}
            className="w-full"
            error={errors.years}
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-primary text-xs md:text-base">
            Default Experience (used if specific years not provided)
          </p>
          <Button
            onClick={handleAddSkill}
            className="p-2 px-5 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
          >
            Add
          </Button>
        </div>

        <SimpleInputField
          placeholder="Default Experience (e.g., 0)"
          value={defaultExperience}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value))
              setDefaultExperience(e.target.value);
          }}
          className="w-full mb-4"
        />

        <div className="flex flex-wrap mt-4">
          {skillsList.map((item, index) => (
            <div
              key={index}
              className="text-primary border border-customGray rounded-md bg-inputBackGround px-3 py-2 mb-2 mr-3 flex items-center space-x-1"
            >
              <span className="text-base font-normal">{item.skill}</span>
              {item.skill && item.yearsOfExperience && (
                <span className="text-base font-normal"> - </span>
              )}
              <span className="text-base font-normal">
                {item.yearsOfExperience}
              </span>
              <button
                onClick={() => deleteSkill(index)}
                className="text-primary font-medium pl-2"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Skills;
