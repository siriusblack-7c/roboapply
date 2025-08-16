import GradientButton from "@/src/components/GradientButton"
import Heading from "@/src/components/Heading"
import { dashboardContext } from "../store"
import { useContext, useRef, useState } from "react"
import buttonIcon from "../../../assets/dashboardIcons/startApplyingBtn.svg"
import { Card, Checkbox, Flex, List } from "antd"
import { Job, JobHistory } from "@types"

import dayjs from "dayjs"

import { activateTab, getResponseFromExtension } from "@/src/extension"

function JobsFound() {
  const dispatch = useContext(dashboardContext).dispatch
  let jobsFound = useContext(dashboardContext).jobsFound
  let selectedResume = useContext(dashboardContext).selectedResume

  const [loading, setLoading] = useState(false)

  const applyResults = useRef<JobHistory[]>([])

  async function continueApplying() {
    try {
      setLoading(true)
      applyResults.current = []
      const jobsToApply = jobsFound.filter((job) => job.selected)
      if (jobsToApply.length === 0) {
        return alert("Please select at least one job to apply.")
      }

      if (!selectedResume?._id) {
        return alert("Please select a resume to apply.")
      }

      let error = false

      for await (const job of jobsToApply) {
        const jobIndex = jobsToApply.findIndex(
          (j) => j.id == job.id && j.company == job.company
        )

        const response = await getResponseFromExtension({
          type: "applyJob",
          job: job,
          resume: selectedResume,
          currentIndex: jobIndex,
          totalJobsApply: jobsToApply.length
        })

        console.log("Apply Res", { response, jobIndex })

        if (response?.error && response.message == "error") {
          console.error("Error Applying Jobs:", response.error)
          alert("Error Applying Jobs: " + response.error)
          error = true
          break
        }

        if (response.message == "stop") {
          break
        }

        const result: JobHistory = {
          job: job,
          dateApplied: dayjs().format(),
          resumeId: selectedResume._id,
          resumeTitle: selectedResume.resumeName,
          status: response.message == "applied" ? "applied" : "skipped"
        }
        applyResults.current.push(result)

        await updateJobHistory(result)

        if (response?.message === "skipped") {
          continue
        }

        console.log("Jop applied", {
          jobsToApply,
          response,
          job
        })

        const isLast = jobsToApply[jobsToApply.length - 1].id == job.id
        if (isLast) break
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      if (error) return

      dispatch({ type: "showComponent", payload: "ResultReport" })
      dispatch({ type: "applyResults", payload: applyResults.current })
    } catch (error) {
      console.error("Error applying jobs:", error)
      alert("Something went wrong, while applying jobs!")
    } finally {
      await activateTab()
      setLoading(false)
    }
  }

  async function updateJobHistory(item: JobHistory) {
    //? send item to backend
  }

  function toggleAllJobs() {
    if (jobsFound.every((job) => job.selected)) {
      setJobsFound(
        jobsFound.map((job) => {
          return { ...job, selected: false }
        })
      )
    } else {
      setJobsFound(
        jobsFound.map((job) => {
          return { ...job, selected: true }
        })
      )
    }
  }

  function setJobsFound(newValues: Job[]) {
    dispatch({ type: "jobsFound", payload: newValues })
  }

  function onstartNewSearch() {
    dispatch({ type: "showComponent", payload: "home" })
    dispatch({ type: "applyResults", payload: [] })
    dispatch({ type: "jobsFound", payload: [] })
  }

  return (
    <>
      <div className="flex justify-between   items-stretch w-full rounded-xl   ">
        <Heading className="" type="h1">
          Job Found
        </Heading>
        <div className="flex items-center gap-4">
          <GradientButton onClick={onstartNewSearch}>
            Start New Search
          </GradientButton>
          <GradientButton
            disabled={
              jobsFound?.length === 0 || jobsFound.every((job) => !job.selected)
            }
            className="flex items-center gap-2 disabled:cursor-not-allowed"
            onClick={continueApplying}>
            <img src={buttonIcon} alt="Start Applying Icon" loading="lazy" />
            Continue Applying
          </GradientButton>
        </div>
      </div>

      {(!jobsFound || jobsFound.length === 0) && (
        <div className="flex items-center justify-center h-1/2">
          <Heading type="h2">No Jobs Found</Heading>
        </div>
      )}

      {jobsFound.length > 0 && (
        <List
          dataSource={jobsFound}
          bordered
          header={
            <Flex className="items-center justify-between">
              <div className="flex items-center gap-4 text-base">
                <Checkbox
                  onChange={toggleAllJobs}
                  checked={jobsFound.every((job) => job.selected)}
                />
                <span
                  className="cursor-pointer text-lg font-semibold"
                  id="select-all"
                  onClick={toggleAllJobs}>
                  {jobsFound.every((job) => job.selected)
                    ? "Deselect All"
                    : "Select All"}{" "}
                  ({jobsFound.length})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">
                  Selected: {jobsFound.filter((job) => job.selected).length}
                </span>
              </div>
            </Flex>
          }
          className="w-full">
          <List.Item className="flex w-full flex-wrap !justify-start  gap-">
            {jobsFound?.map((job) => (
              <div
                key={job.id}
                className="w-full sm:w-1/2 md:w-1/2  lg:w-1/3   p-3 ">
                <Card className="  relative    bg-inputBackGround">
                  <Checkbox
                    onChange={() => {
                      setJobsFound(
                        jobsFound.map((j) => {
                          if (j.id === job.id) {
                            return { ...j, selected: !j.selected }
                          }
                          return j
                        })
                      )
                    }}
                    checked={job.selected}
                    className="absolute right-4 top-2"
                  />
                  <Flex className="flex-col gap-4 w-full">
                    <Heading
                      type="h2"
                      className="w-full text-ellipsis  whitespace-nowrap overflow-hidden">
                      <span
                        onClick={() => window.open(job.url, "_blank")}
                        className="cursor-pointer w-full "
                        title="Open in new tab">
                        {job.title}
                      </span>
                    </Heading>

                    <Heading type="h3" className="text-gray-400 flex gap-1">
                      Company:
                      <span className="text-base text-white text-ellipsis  whitespace-nowrap overflow-hidden">
                        {job.company}
                      </span>
                    </Heading>
                    <Heading
                      type="h3"
                      className="-mt-3 flex gap-1 text-gray-400  whitespace-nowrap ">
                      Job ID:{" "}
                      <span className="text-base text-white text-ellipsis whitespace-nowrap overflow-hidden">
                        {job.id}
                      </span>
                    </Heading>
                  </Flex>
                </Card>
              </div>
            ))}
          </List.Item>
        </List>
      )}
    </>
  )
}
export default JobsFound

export let dummyJobs = [
  {
    company: "Macrosoft",
    id: "4259469636",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259469636/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=aU3%2FHSevkAjQZbr03fnuJg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Maven Workforce Inc.",
    id: "4259464942",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259464942/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=1BLBaAxlBe2ogKUoNj4B%2FA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Rivago Infotech Inc",
    id: "4258318794",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Technical Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258318794/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=Mp5KphOT6Zjgvzwk7sIAYA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Beacon Hill",
    id: "4259478393",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Senior Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259478393/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=EEnneeiiO84u3DacbQi1TA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Stealth Startup",
    id: "4257979477",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "AI Technical Project Manager [32274]",
    url: "https://www.linkedin.com/jobs/view/4257979477/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=%2BG2%2F2yJYhJo6vEYWwFbobw%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "FastTek Global",
    id: "4259488176",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Technical Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259488176/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=HAh1YGdJyPWH%2F4Ds7vGRTA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "CALLISTOFUSION",
    id: "4258305054",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Technical Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258305054/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=v2JWV0FJdQeoGLMYBnVPFA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Elite Management Concierge",
    id: "4258305811",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Assistant Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258305811/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=F7cN8QWLe9AfVTXC1Lmblg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Revolution Technologies",
    id: "4259470610",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259470610/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=G%2FlMGAtgUzZt6C1coRvPJA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "EPITEC",
    id: "4258307125",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258307125/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=vYDftSgiFwKSZUHHFo2I0A%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "RELQ TECHNOLOGIES",
    id: "4259410315",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "IT Agile Project Manager (US Remote)",
    url: "https://www.linkedin.com/jobs/view/4259410315/?eBP=BUDGET_EXHAUSTED_JOB&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=MeFxcHdafBTomWylNkF3ug%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Vista Applied Solutions Group Inc",
    id: "4255868344",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Technical Project Manager",
    url: "https://www.linkedin.com/jobs/view/4255868344/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=3T2AI%2BPpgzalxShbpcjuUg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Optomi",
    id: "4258317021",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258317021/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=O7QYJvl9w%2FciFGb7E5rvsQ%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Brooksource",
    id: "4258312254",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Senior Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258312254/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=jMhz1afrOEhoV61kp0WFfA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "FUSTIS LLC",
    id: "4259485374",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Scrum Master",
    url: "https://www.linkedin.com/jobs/view/4259485374/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=ATLEbvfQZ7ik09hSVItkKA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Akkodis",
    id: "4258307841",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Junior Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258307841/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=NHUEtLvLKHJeE9FBId8n1w%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Atlas Search",
    id: "4256490244",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Information Technology Project Manager (AWS)",
    url: "https://www.linkedin.com/jobs/view/4256490244/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=qaJKO9rzAf8DZR1pCsIVng%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "American Constructors, Inc.",
    id: "4259476635",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Assistant Project Manager/Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259476635/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=%2FlNbtWdJqufCYNmUq5P%2FKQ%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Insight Global",
    id: "4257975705",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Ecommerce Project Manager",
    url: "https://www.linkedin.com/jobs/view/4257975705/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=BB%2B%2BdyAkmobcVgK4eBL10A%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "EVONA",
    id: "4256454673",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Technical Project Manager",
    url: "https://www.linkedin.com/jobs/view/4256454673/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=rxyMu27cqm3lGR8qhDnPBw%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Torque Consulting",
    id: "4259466352",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259466352/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=Te9lkFaEVckuW%2BH2Y0Ov6A%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Cozen Technology Solutions Inc",
    id: "4258313064",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Oracle Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258313064/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=9sabGkoJWZmwc6YtkHfqPg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Diversified Services Network, Inc.",
    id: "4259475085",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Sr. IT Project Program Manger",
    url: "https://www.linkedin.com/jobs/view/4259475085/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=uX02by5KDI5C%2BOkE6Qm0lg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Hays",
    id: "4259473071",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259473071/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=0iaSqrMxynbVc2EzbyuPCQ%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Renova One",
    id: "4258307030",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259469636&f_AL=true&keywords=Project%20Manager",
    title: "Assistant Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258307030/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=Y8lwR7vgcsZxXHp5b%2FyqYw%3D%3D&trackingId=C5GxSTRNv4fclxd6JKyYcg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "RELQ TECHNOLOGIES",
    id: "4259410131",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "IT Agile Project Manager (Remote - US)",
    url: "https://www.linkedin.com/jobs/view/4259410131/?eBP=BUDGET_EXHAUSTED_JOB&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=Y%2F7fdgusZJIS0gEc5KMTYw%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "EPITEC",
    id: "4257996007",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Coordinator",
    url: "https://www.linkedin.com/jobs/view/4257996007/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=cElHHHUc2h%2Ff3aLA2CDBSA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Optomi",
    id: "4258305336",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258305336/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=EYXL6ZyRJX7y%2BM4yutbQMw%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Zobility",
    id: "4258322252",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258322252/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=3G7HUdZO2LVs6xU%2FHOrfRw%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Volt",
    id: "4256488393",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Assistant Project Manager- Nuclear",
    url: "https://www.linkedin.com/jobs/view/4256488393/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=WQitgPxd7pS8jS3Fn838yQ%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Prospect Infosystem Inc.",
    id: "4253963251",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4253963251/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=Q8aNP%2FL%2FqUs2VQBDuAe9YA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Stealth Startup",
    id: "4257980217",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "AI Technical Project Manager [32274]",
    url: "https://www.linkedin.com/jobs/view/4257980217/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=z1USXIdzfcPQ8ems%2B3ppwA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "BioTalent",
    id: "4258304896",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258304896/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=KkwtfJD%2BPGV6Dhij45juDg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "IDR, Inc.",
    id: "4258300190",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Coordinator (442024)",
    url: "https://www.linkedin.com/jobs/view/4258300190/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=PXSUaTk%2FjiTMuSdJEUi%2Btw%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Comrise",
    id: "4258307312",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Associate",
    url: "https://www.linkedin.com/jobs/view/4258307312/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=1Kq3iHCnMv6dcRbBifDWdQ%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "The TJX Companies, Inc.",
    id: "4256470588",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Engineering Project Manager",
    url: "https://www.linkedin.com/jobs/view/4256470588/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=R6GWaCmgm7WDyhJtBKrLXw%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Tranzeal Incorporated",
    id: "4258314937",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Information Technology Infrastructure Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258314937/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=jhmRxL3z1c41XwGC7lSK4Q%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Engenium Inc",
    id: "4259480630",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259480630/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=VJNuPk6Pso0ocXrSZUElRA%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Torque Consulting",
    id: "4259470062",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259470062/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=egvmK2ANvRoMRbpVFT27gg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Insight Global",
    id: "4258308657",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258308657/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=z4iAjv9F%2BH2Nik7I9Ph0Lg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Akkodis",
    id: "4258307204",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258307204/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=ULyeOdl0alqItXaBnW2Mag%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Software Technology Inc.",
    id: "4258061636",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4258061636/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=pkCPQob3PeFXX1GYOkmBIg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Sira Consulting, an Inc 5000 company",
    id: "4259479745",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Coordinator",
    url: "https://www.linkedin.com/jobs/view/4259479745/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=AbN2SgTKE9mb%2BDOiLduDUg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Navigate Search",
    id: "4259473677",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager - Public Works",
    url: "https://www.linkedin.com/jobs/view/4259473677/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=Mbl9T5x%2FjsZWia5uILQU0g%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Metric Geo",
    id: "4259405988",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Senior Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259405988/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=3Z9rTf1KE5u94HyJ3gAZDw%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Matlen Silver",
    id: "4259461482",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Executive Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259461482/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=oY8ENYikel0G1DgRmK7c7Q%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Flowtec Group",
    id: "4259446559",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259446559/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=UM0nPsQtIKDeNc9dLsvfgg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Dunhill Professional Search & Government Solutions",
    id: "4259469236",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Project Coordinator",
    url: "https://www.linkedin.com/jobs/view/4259469236/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=fgAqPawgvtolVmEQb55h9w%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Planet Home Lending, LLC",
    id: "4258314139",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Senior IT Project Manager - Mortgage",
    url: "https://www.linkedin.com/jobs/view/4258314139/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=VeKQZ6p0UO0XAnIl03wnvg%3D%3D&trk=flagship3_search_srp_jobs"
  },
  {
    company: "Infojini Inc",
    id: "4259461907",
    selected: true,
    tabURL:
      "https://www.linkedin.com/jobs/search/?currentJobId=4259410131&f_AL=true&keywords=Project%20Manager&start=25",
    title: "Technical Project Manager",
    url: "https://www.linkedin.com/jobs/view/4259461907/?eBP=NOT_ELIGIBLE_FOR_CHARGING&refId=L7f6SCF2wbQdo8HRS7kgRg%3D%3D&trackingId=%2FSXVuVFEAfFLpvTWJd06%2Bg%3D%3D&trk=flagship3_search_srp_jobs"
  }
]
