// // PlatFormDiv.js

// import React, { useState } from "react";
// import linkedinPic from "../../../assets/dashboardIcons/linkedinImage.svg";
// import IndeedPic from "../../../assets/dashboardIcons/indeedImage.svg";
// import zipPic from "../../../assets/dashboardIcons/ziprecruiterImage.svg";
// import monsterPic from "../../../assets/dashboardIcons/monsterImage.svg";
// import SimplyPic from "../../../assets/dashboardIcons/simplyHiredImage.svg";
// import glassPic from "../../../assets/dashboardIcons/glassdoorImage.svg";
// import LinkIcon from "../../../assets/analytics/linkIcon.svg";
// import PlatformCard from "../ui/PlatformCard";
// import PlatformTable from "../ui/PlatformTable";

// const dummyPlatforms = [
//   {
//     id: 1,
//     platformName: "LinkedIn",
//     icon: linkedinPic,
//     totalJobs: 4162,
//     linkIcon: LinkIcon,
//   },
//   {
//     id: 2,
//     platformName: "Indeed",
//     icon: IndeedPic,
//     totalJobs: 3120,
//     linkIcon: LinkIcon,
//   },
//   {
//     id: 3,
//     platformName: "Dice",
//     icon: glassPic,
//     totalJobs: 2045,
//     linkIcon: LinkIcon,
//   },
//   {
//     id: 4,
//     platformName: "ZipRecruiter",
//     icon: zipPic,
//     totalJobs: 2045,
//     linkIcon: LinkIcon,
//   },
//   {
//     id: 5,
//     platformName: "Monster",
//     icon: monsterPic,
//     totalJobs: 2045,
//     linkIcon: LinkIcon,
//   },
//   {
//     id: 6,
//     platformName: "SimplyHired",
//     icon: SimplyPic,
//     totalJobs: 2045,
//     linkIcon: LinkIcon,
//   },
//   // Add more dummy platforms as needed
// ];

// const dummyJobData = [
//   {
//     companyName: "TechOne",
//     jobTitle: "Frontend Developer",
//     byResume: "Philip Maya",
//     jobDate: "2024-11-01",
//     jobLink: "https://techone.com/jobs/frontend-developer",
//   },
//   {
//     companyName: "Innovatech",
//     jobTitle: "Backend Developer",
//     byResume: "Philip Maya",
//     jobDate: "2024-10-21",
//     jobLink: "https://innovatech.com/jobs/backend-developer",
//   },
//   {
//     companyName: "Innovatech",
//     jobTitle: "Devops Developer",
//     byResume: "Alex Smith",
//     jobDate: "2024-10-21",
//     jobLink: "https://innovatech.com/jobs/backend-developer",
//   },
//   {
//     companyName: "Innovatech",
//     jobTitle: "Backend Developer",
//     byResume: "Philip Maya",
//     jobDate: "2024-10-21",
//     jobLink: "https://innovatech.com/jobs/backend-developer",
//   },
//   // Add more dummy job data as needed
// ];

// const uniqueCompanies = [
//   ...new Set(dummyJobData.map((job) => job.companyName)),
// ];
// const uniqueJobTitles = [...new Set(dummyJobData.map((job) => job.jobTitle))];
// const uniqueResumes = [...new Set(dummyJobData.map((job) => job.byResume))];

// const PlatFormDiv = () => {
//   const [showTable, setShowTable] = useState(false);
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedJobTitle, setSelectedJobTitle] = useState("");
//   const [selectedResume, setSelectedResume] = useState("");
//   const [selectedPlatform, setSelectedPlatform] = useState([]);

//   const handleShowTable = (platform) => {
//     setShowTable(true);
//     setSelectedPlatform(platform);
//   };

//   const handleGoBack = () => {
//     setShowTable(false);
//   };

//   return (
//     <div>
//       {showTable ? (
//         <div className="w-full  grid grid-cols-1 ">
//           <PlatformTable
//             jobData={dummyJobData}
//             // uniqueCompanies={["TechOne", "Innovatech"]}
//             uniqueCompanies={uniqueCompanies}
//             uniqueJobTitles={uniqueJobTitles}
//             uniqueResumes={uniqueResumes}
//             selectedCompany={selectedCompany}
//             setSelectedCompany={setSelectedCompany}
//             selectedJobTitle={selectedJobTitle}
//             setSelectedJobTitle={setSelectedJobTitle}
//             selectedResume={selectedResume}
//             setSelectedResume={setSelectedResume}
//             onGoBack={handleGoBack}
//             selectedPlatform={selectedPlatform}
//           />
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//           {dummyPlatforms.map((platform) => (
//             <PlatformCard
//               key={platform.id}
//               icon={platform.icon}
//               platformName={platform.platformName}
//               totalJobs={platform.totalJobs}
//               linkIcon={platform.linkIcon}
//               onShowTable={() => handleShowTable(platform)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlatFormDiv;

import React, { useState, useEffect } from "react";
import linkedinPic from "../../../assets/dashboardIcons/linkedinImage.svg";
import IndeedPic from "../../../assets/dashboardIcons/indeedImage.svg";
import zipPic from "../../../assets/dashboardIcons/ziprecruiterImage.svg";
import monsterPic from "../../../assets/dashboardIcons/monsterImage.svg";
import SimplyPic from "../../../assets/dashboardIcons/simplyHiredImage.svg";
import glassPic from "../../../assets/dashboardIcons/glassdoorImage.svg";
import LinkIcon from "../../../assets/analytics/linkIcon.svg";
import PlatformCard from "../ui/PlatformCard";
import PlatformTable from "../ui/PlatformTable";
import API_ENDPOINTS from "../../../api/endpoints";
import { errorToast } from "../../../components/Toast";
import CircularIndeterminate from "../../../components/loader/circular";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

const PlatFormDiv = () => {
  const [showTable, setShowTable] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch platform data from API
  const fetchPlatformData = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      errorToast("You are not authorized.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.GetAnalyticsByPlatform}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch platform data");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setPlatformData(result.data);
      }
    } catch (error) {
      console.error("Error fetching platform data:", error);
      errorToast("Failed to load platform data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const handleShowTable = (platform) => {
    setShowTable(true);
    setSelectedPlatform(platform);
  };

  const handleGoBack = () => {
    setShowTable(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <CircularIndeterminate />
      </div>
    );
  }

  return (
    <div>
      {showTable ? (
        <div className="w-full  grid grid-cols-1 ">
          <PlatformTable
            platformData={platformData}
            selectedPlatform={selectedPlatform}
            onGoBack={handleGoBack}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {platformData.map((platform, index) => (
            <PlatformCard
              key={index}
              platformName={platform.platformName}
              icon={
                platform.platformName === "LinkedIn"
                  ? linkedinPic
                  : platform.platformName === "Indeed"
                  ? IndeedPic
                  : platform.platformName === "glassPic"
                  ? glassPic
                  : platform.platformName === "ZipRecruiter"
                  ? zipPic
                  : platform.platformName === "Monster"
                  ? monsterPic
                  : SimplyPic
              } // Handle different platform icons dynamically
              totalJobs={platform.totalNoOfAppliedJobs}
              linkIcon={LinkIcon}
              onShowTable={() => handleShowTable(platform)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlatFormDiv;
