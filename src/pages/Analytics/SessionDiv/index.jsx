import React, { useState, useEffect } from "react";

import linkedinPic from "../../../assets/dashboardIcons/linkedinImage.svg";
import IndeedPic from "../../../assets/dashboardIcons/indeedImage.svg";
import glassPic from "../../../assets/dashboardIcons/glassdoorImage.svg";
import zipPic from "../../../assets/dashboardIcons/ziprecruiterImage.svg";
import monsterPic from "../../../assets/dashboardIcons/monsterImage.svg";
import SimplyPic from "../../../assets/dashboardIcons/simplyHiredImage.svg";
import UserAccountIcon from "../../../assets/analytics/userAccountIcon.svg";
import ResumeChoosenIcon from "../../../assets/analytics/resumeChoosenIcon.svg";
import SkillSearchIcon from "../../../assets/analytics/skillSearchIcon.svg";
import LinkIcon from "../../../assets/analytics/linkIcon.svg";
import SessionCard from "../ui/SessionCard";
import DatePickerInput from "../../../components/DatePickerInput";
import SessionTable from "../ui/SessionTable";
import API_ENDPOINTS from "../../../api/endpoints";
import { errorToast } from "../../../components/Toast";
import CircularIndeterminate from "../../../components/loader/circular";
const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

// Platform icon mapping
const platformIcons = {
  LinkedIn: linkedinPic,
  Indeed: IndeedPic,
  Glassdoor: glassPic,
  Dice: glassPic, // Using glassPic as fallback
  ZipRecruiter: zipPic,
  Monster: monsterPic,
  SimplyHired: SimplyPic,
};

const SessionDiv = () => {
  const [isTableVisible, setTableVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobData, setJobData] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [uniqueJobTitles, setUniqueJobTitles] = useState([]);
  const [uniqueResumes, setUniqueResumes] = useState([]);
  const [selectedSessionData, setSelectedSessionData] = useState(null);
  const [skillSearchKeyword, setSkillSearchKeyword] = useState(""); // Add state for skillSearchKeyword

  // Fetch analytics data from API
  const fetchAnalyticsBySession = async (date = null) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      errorToast("You are not authorized.");
      return;
    }

    let fullUrl = `${BASE_URL}${API_ENDPOINTS.GetAnalyticsBySession}`;
    if (date) {
      const formattedDate = formatDateLocal(date);
      fullUrl += `?date=${formattedDate}`;
    }

    setLoading(true);

    try {
      const response = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const result = await response.json();
      if (result.success && result.data) {
        const mappedData = result.data.map((item) => ({
          icon: platformIcons[item.platformName] || linkedinPic,
          title: item.platformName,
          userEmail: {
            icon: UserAccountIcon,
            email: item.userAccount,
          },
          resume: {
            icon: ResumeChoosenIcon,
            name: item.resumeChosen,
          },
          applyJobsCount: item.totalNoOfAppliedJobs,
          skill: {
            icon: SkillSearchIcon,
            name: item.skillSearch,
            linkIcon: LinkIcon,
          },

          resumeId: item.resumeId,
          jobDate: item.jobDate, // Store jobDate from API response
          skillSearch: item.skillSearch, // Store skillSearch from API response
        }));

        setSessionData(mappedData);
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      errorToast("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchAnalyticsBySession();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("Selected Date:", date);
    fetchAnalyticsBySession(date);
  };

  const handleGoBack = () => {
    setTableVisible(false);
  };

  const toggleTableVisibility = (session) => {
    setTableVisible((prevVisible) => !prevVisible);
    setSelectedPlatform({ platformName: session.title, icon: session.icon });

    // Store the selected resume ID and session data when a card is clicked
    setSelectedResumeId(session.resumeId);
    setSelectedSessionData(session);

    // Set the skillSearchKeyword from the session data
    setSkillSearchKeyword(session.skillSearch || "");

    // Set the jobDate from the session as selectedDate for SessionTable
    if (session.jobDate) {
      // Convert jobDate string to Date object if needed
      const jobDateObj = new Date(session.jobDate);
      setSelectedDate(jobDateObj);
    }

    console.log("Selected Resume ID:", session.resumeId);
    console.log("Selected Job Date:", session.jobDate);
    console.log("Selected Skill Search Keyword:", session.skillSearch);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <CircularIndeterminate />
      </div>
    );
  }

  return (
    <>
      {!isTableVisible ? (
        <>
          <p className="text-xl font-medium text-primary">
            Check Session By Day ....
          </p>
          <div className="mt-4 mb-5">
            <DatePickerInput
              placeholder="Choose a date"
              selectedDate={selectedDate}
              onChange={handleDateChange}
              className="w-full"
            />
          </div>
          <div className="w-full py-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {sessionData.length > 0 ? (
              sessionData.map((session, index) => (
                <SessionCard
                  key={`${session.resumeId}-${index}`}
                  {...session}
                  onToggleTableVisibility={() => toggleTableVisibility(session)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-primary text-lg">
                  No analytics data available
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full py-0 md:py-5 grid grid-cols-1">
          <SessionTable
            jobData={jobData}
            uniqueCompanies={uniqueCompanies}
            uniqueJobTitles={uniqueJobTitles}
            uniqueResumes={uniqueResumes}
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            selectedJobTitle={selectedJobTitle}
            setSelectedJobTitle={setSelectedJobTitle}
            selectedResume={selectedResume}
            setSelectedResume={setSelectedResume}
            onGoBack={handleGoBack}
            selectedPlatform={selectedPlatform}
            selectedResumeId={selectedResumeId}
            selectedDate={selectedDate} // This will now contain jobDate from API
            selectedSessionData={selectedSessionData}
            skillSearchKeyword={skillSearchKeyword} // Pass skillSearchKeyword to SessionTable
          />
        </div>
      )}
    </>
  );
};

export default SessionDiv;
