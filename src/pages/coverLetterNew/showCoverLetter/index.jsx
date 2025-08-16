import React from "react"
import DashBoardLayout from "../../../dashboardLayout"
import TemplateCarousel from "../ui/TemplateCarousel"

// Single cover letter data
const defaultCoverLetter = `[Your Name]
[Your Address]
[City, State, ZIP Code]
[Your Email Address]
[Your Phone Number]
[Date]

Hiring Manager
[Company Name]
[Company Address]
[City, State, ZIP Code]

Dear Hiring Manager,

I am writing to express my interest in the [Job Title] position at [Company Name], as advertised on [where you found the job posting]. With my strong background in [mention relevant field or experience], coupled with a passion for [relevant industry or skill], I am excited about the opportunity to contribute to your team and help drive [Company Name]'s success.

In my previous role at [Previous Company Name], I was responsible for [specific responsibility or project], where I [describe a key achievement or contribution that demonstrates relevant skills]. Through this experience, I honed my skills in [mention specific skills like project management, data analysis, etc.] and developed a strong ability to [highlight a relevant strength, like problem-solving, communication, or leadership].

What excites me most about this opportunity is [mention something specific about the company or the role that you find appealing, such as innovation in a particular field, the company's mission, or growth opportunities]. I am confident that my expertise in [key skills] and my dedication to [mention company values or goals] would make me a valuable asset to your team.

I would welcome the chance to discuss how my background and skills align with the goals of [Company Name] in more detail. Thank you for considering my application. I look forward to the possibility of contributing to your continued success.

Sincerely,
[Your Name]`

const ShowCoverLetter = () => {
  return (
    <>
      <DashBoardLayout>
        <div className="bg-almostBlack w-full h-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
          <div className="w-full">
            <div className="text-center space-y-3 pt-5 md:pt-10 md:pb-5">
              <p className="text-xl md:text-3xl font-normal text-primary">
                Choose Your Cover Letter Style
              </p>
            </div>
            <hr className="border-t-2 border-simplePurple mb-5 w-[60%] md:w-[40%] mx-auto" />

            {/* Template Carousel Component */}
            <TemplateCarousel content={defaultCoverLetter} />
          </div>
        </div>
      </DashBoardLayout>
    </>
  )
}

export default ShowCoverLetter
