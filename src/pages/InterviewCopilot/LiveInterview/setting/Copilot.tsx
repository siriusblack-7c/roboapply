import Button from "@/src/components/Button/index"
import { useState } from "react"
import { Select, Dropdown, DatePicker } from "antd"
import ArrowDown from "@/src/assets/dashboardIcons/arrowDown.svg"

const Copilot = () => {
  const [selectedVerbosity, setSeletedVerbosity] = useState("Consise")
  const [selectedTranscriptionDelay, setSelectedTranscriptionDelay] = useState("High")
  const [selectedPerformancePreference, setSelectedPerformancePreference] = useState("Quality")
  const [copilotTemperature, setCopilotTemperature] = useState("Default")
  const [seletedLanguage, setSelectedLanguage] = useState("English (Gloabal)")

  const verbosityOptions = ["Consise", "Default", "Length"]
  const transcriptionDelayOptions = ["Low", "Default", "High"]
  const performancePreferenceOptions = ["Speed", "Quality"]
  const copilotTemperatureOptions = ["Low", "Default", "High"]

  const items = [
    {
      key: "1",
      label: (
        <div
          className="flex items-center space-x-2"
          onClick={() => setSelectedLanguage("English (Global)")}>
          <span>English (Global)</span>
        </div>
      )
    },
    {
      key: "3",
      label: (
        <div
          className="flex items-center space-x-2"
          onClick={() => setSelectedLanguage("German")}>
          <span>German</span>
        </div>
      )
    }
  ]

  const handleConfirm = () => {

  }

  const handleCancel = () => {
    setSeletedVerbosity("Consise");
    setSelectedTranscriptionDelay("High");
    setCopilotTemperature("Default");
    setSelectedLanguage("English (Gloabal)");
    setSelectedPerformancePreference("Quality")
  }

  return (
    <div className="flex flex-col gap-6 px-8 py-6 bg-[#313131] rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-lg">Verbosity</p>
        <p className="text-[#CCCCCC]">
          Lorem ipsum dolor sit amet consectetur. Blandit ut male.
        </p>
        <div className="flex justify-around bg-[#454545] p-2 rounded-lg gap-4">
          {verbosityOptions.map((option) => (
            <Button
              onClick={() => setSeletedVerbosity(option)}
              className={`w-1/3 p-3 px-5 flex items-center justify-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar text-center font-bold rounded-lg ${
                selectedVerbosity === option &&
                "bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
              }`}>
              <p>{option}</p>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-lg">Language for Copilot responses</p>
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <Button className="p-3 px-5 flex items-center justify-between whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg bg-gradient-to-b bg-[#454545] ">
            <span>{seletedLanguage}</span>
            <img src={ArrowDown} alt="" />
          </Button>
        </Dropdown>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-lg">Transcription Delay</p>
        <div className="flex justify-around bg-[#454545] p-2 rounded-lg gap-4">
          {transcriptionDelayOptions.map((option) => (
            <Button
              onClick={() => setSelectedTranscriptionDelay(option)}
              className={`w-1/3 p-3 px-5 flex items-center justify-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar text-center font-bold rounded-lg ${
                selectedTranscriptionDelay === option &&
                "bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
              }`}>
              <p>{option}</p>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-lg">Copilot Temperature</p>
        <div className="flex justify-around bg-[#454545] p-2 rounded-lg gap-4">
          {copilotTemperatureOptions.map((option) => (
            <Button
              onClick={() => setCopilotTemperature(option)}
              className={`w-1/3 p-3 px-5 flex items-center justify-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar text-center font-bold rounded-lg ${
                copilotTemperature === option &&
                "bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
              }`}>
              <p>{option}</p>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-lg">Performance Preference</p>
        <div className="flex justify-around bg-[#454545] p-2 rounded-lg gap-4">
          {performancePreferenceOptions.map((option) => (
            <Button
              onClick={() => setSelectedPerformancePreference(option)}
              className={`w-1/3 p-3 px-5 flex items-center justify-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar text-center font-bold rounded-lg ${
                selectedPerformancePreference === option &&
                "bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
              }`}>
              <p>{option}</p>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          onClick={() => handleConfirm()}
          className="w-fit p-3 px-5 flex items-center justify-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar text-center font-bold rounded-lg 
                bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd
              ">
          <p>Confirm</p>
        </Button>
        <Button
          onClick={() => handleCancel()}
          className="w-fit p-3 px-5 flex items-center justify-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar text-center font-bold rounded-lg 
                bg-[#404040]
              ">
          <p>Cancel</p>
        </Button>
      </div>
    </div>
  )
}

export default Copilot
