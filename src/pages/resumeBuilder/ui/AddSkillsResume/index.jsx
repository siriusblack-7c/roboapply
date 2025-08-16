import React, { useState } from "react";
import SimpleInputField from "../../../../components/SimpleInputFields";
import Button from "../../../../components/Button";

const AddSkillsResume = ({ skillsList = [], addSkill, deleteSkill }) => {
  const [skill, setSkill] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [errors, setErrors] = useState({ skill: false, years: false });

  const handleAddSkill = () => {
    if (!skill || !yearsOfExperience) {
      setErrors({
        skill: !skill,
        years: !yearsOfExperience,
      });
      return;
    }

    addSkill({ skill, yearsOfExperience });

    setSkill("");
    setYearsOfExperience("");
    setErrors({ skill: false, years: false });
  };

  return (
    <div className="w-full">
      <p className="text-lg md:text-xl text-primary font-normal mb-1 inline-block border-b-2 border-purple">
        Skills
      </p>

      <div className="md:flex md:space-x-4 mb-4">
        <SimpleInputField
          placeholder="Enter a Skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
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

      <Button
        onClick={handleAddSkill}
        className="p-2 px-4 md:px-5 mb-2 md:mb-4 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-lg hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
      >
        Add
      </Button>

      <div className="flex flex-wrap mt-2 md:mt-4">
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex items-center text-primary border border-customGray rounded-md bg-inputBackGround px-2 md:px-3 py-2 mb-2 mr-2 md:mr-3"
          >
            <span className="text-sm md:text-base font-normal mr-2">
              {item.skill}
            </span>
            {item.yearsOfExperience && (
              <span className="text-sm md:text-base font-normal mr-2">
                - {item.yearsOfExperience}
              </span>
            )}
            <button
              onClick={() => deleteSkill(index)}
              className="text-primary font-medium"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddSkillsResume;
