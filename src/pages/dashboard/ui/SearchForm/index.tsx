import { BiCurrentLocation } from "react-icons/bi"
import { AiOutlineOrderedList } from "react-icons/ai"
import { AiOutlineSearch } from "react-icons/ai"
import { useForm } from "antd/es/form/Form"
import { DashboardForm, ResumeList, ResumeState } from "../../../../../@types"
import { Button, Flex, Form, Input, Select } from "antd"
import GradientButton from "../../../../components/GradientButton"
import buttonIcon from "../../../../assets/dashboardIcons/startApplyingBtn.svg"
interface SearchFormProps {
  onFinish: (values: DashboardForm) => void
  resumes: ResumeList[]
  disabled: boolean
  loading: boolean
  loadingResume: boolean
}
export default function SearchForm({
  onFinish,
  resumes,
  disabled,
  loading,
  loadingResume
}: SearchFormProps) {
  const [form] = useForm<DashboardForm>()

  return (
    <div className="w-full flex flex-col gap-4 ">
      <div className="flex items-center justify-between">
        <p className="text-primary text-2xl font-semibold">
          Start Applying Jobs
        </p>
        <GradientButton
          className="flex items-center gap-3 py-3"
          style={{ borderRadius: "60px" }}
          disabled={disabled}
          onClick={form.submit}>
          <img src={buttonIcon} alt="Start Applying Icon" loading="lazy" />
          Start Applying
        </GradientButton>
      </div>

      <Form
        onFinish={onFinish}
        form={form}
        className="flex w-full flex-col gap-2  rounded-lg border-2 border-gradientStart p-4 pt-6">
        <Flex className="w-full items-center justify-center gap-4 rounded-lg  ">
          <Form.Item
            initialValue={""}
            rules={[{ required: true, message: "Please enter search query" }]}
            className="flex-1 max-w-80"
            name={"q"}>
            <Input
              prefix={<AiOutlineSearch className="text-2xl" />}
              size="large"
              className="flex-1  "
              placeholder="Search For Software Developer, Analyst etc."
            />
          </Form.Item>
          <Form.Item
            className="flex-1 max-w-72"
            initialValue={""}
            name={"location"}>
            <Input
              prefix={<BiCurrentLocation className="text-2xl" />}
              size="large"
              placeholder="Location (e.g. USA, Karachi)"
            />
          </Form.Item>

          <Form.Item initialValue={"20"} className="w-52" name={"target"}>
            <Select
              prefix={<AiOutlineOrderedList className="text-2xl" />}
              size="large"
              className="w-48   "
              placeholder="Target Jobs"
              options={[
                { label: "Target 20 Jobs", value: "20" },
                { label: "Target 50 Jobs", value: "50" },
                { label: "Target 100 Jobs", value: "100" },
                { label: "Target 150 Jobs", value: "150" },
                { label: "Target 200 Jobs", value: "200" },
                { label: "Target 300 Jobs", value: "300" }
              ]}
            />
          </Form.Item>
        </Flex>

        <Flex className="w-full justify-center flex-wrap items-center gap-4">
          <Form.Item
            rules={[{ required: true, message: "Please select plateform" }]}
            className="w-48 rounded"
            initialValue={"linkedin"}
            name={"plateform"}>
            <Select
              size="large"
              placeholder="Select Platform"
              options={[
                { label: "Job Platform", value: "plateform", disabled: true },
                {
                  label: "LinkedIn",
                  value: "linkedin"
                }
              ]}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Please select profile" }]}
            className="w-48 rounded"
            name={"profile_id"}>
            <Select
              size="large"
              loading={loadingResume}
              placeholder="Select Profile"
              options={[
                {
                  label: "Profile",
                  value: "",
                  disabled: true
                },
                ...resumes.map((resume) => ({
                  label: resume.name,
                  value: resume._id,
                  disabled: false
                }))
              ]}
            />
          </Form.Item>
          <Form.Item className="w-48 rounded" name={"jobType"}>
            <Select
              size="large"
              placeholder="Job Type"
              options={[
                { label: "Job Type", disabled: true, value: "jobType" },
                { label: "Full Time", value: "F" },
                { label: "Part Time", value: "O" },
                { label: "contract", value: "C" },
                { label: "Internship", value: "I" }
              ]}
            />
          </Form.Item>
          <Form.Item className="w-48 rounded" name={"workType"}>
            <Select
              size="large"
              placeholder="Work Type"
              options={[
                { label: "Work Type", value: "workType", disabled: true },
                { label: "On-site", value: "1" },
                { label: "Remote", value: "2" },
                { label: "Hybrid", value: "3" }
              ]}
            />
          </Form.Item>
          <Form.Item className="w-48 rounded" name={"experience"}>
            <Select
              size="large"
              placeholder="Experience Level"
              options={[
                {
                  label: "Experience Level",
                  value: "experience",
                  disabled: true
                },
                { label: "Entry Level", value: "2" },
                { label: "Associate", value: "3" },
                { label: "Executive", value: "6" }
              ]}
            />
          </Form.Item>
        </Flex>
      </Form>
    </div>
  )
}
