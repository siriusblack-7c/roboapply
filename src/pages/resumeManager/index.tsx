import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashBoardLayout from "../../dashboardLayout"
import Button from "../../components/Button"
import ResumeCard from "./ui/ResumeCard"
import uploadResumeHere from "../../assets/resumeManagerIcons/uploadResumeIcon.svg"
import { HiArrowLeft } from "react-icons/hi"
import ResumeUploadModal from "../../components/Modals/ResumeUploadModal"
import EditResumeNameModal from "../../components/Modals/EditResumeNameModal"
import DeleteResumeModal from "../../components/Modals/DeleteResumeModal"
import { successToast, errorToast } from "@/src/components/Toast"
import CircularIndeterminate from "../../components/loader/circular"
import API_ENDPOINTS from "../../api/endpoints"
import {
  deleteResume,
  getAllResumes,
  getResumeDetails
} from "@/src/api/functions"
import { ResumeList } from "@types"
import { BASE_URL } from "@/src/api"

const UploadAndShowResume = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [currentEditingResume, setCurrentEditingResume] =
    useState<ResumeList | null>(null)
  const [currentDeletingResume, setCurrentDeletingResume] =
    useState<ResumeList | null>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const [resumes, setResumes] = useState<ResumeList[]>([])

  const generateDropdownOptions = (resume) => [
    {
      label: "Edit Resume Name",
      action: () => handleEditResumeName(resume)
    },
    {
      label: "Delete Resume",
      action: () => handleDeleteResume(resume)
    }
  ]

  const handleEditResumeName = (resume) => {
    setCurrentEditingResume(resume)
    setEditModalOpen(true)
  }

  const handleDeleteResume = (resume) => {
    setCurrentDeletingResume(resume)
    setDeleteModalOpen(true)
  }

  const handleResumeSubmit = (resumeName, file) => {
    if (resumes.some((resume) => resume.name === resumeName)) {
      errorToast("A resume with this name already exists.")
      return
    }

    setResumes((prevResumes) => [
      ...prevResumes,
      { name: resumeName, status: "Not Completed", _id: "" }
    ])
    successToast("Resume uploaded successfully!")

    navigate("/resume-manager/editResume", { state: { resumeName, file } })
  }

  const handleSaveEditedName = async (newName: string) => {
    if (!newName.trim()) {
      errorToast("Resume name cannot be empty.")

      return
    }

    // Check for duplicate resume names
    if (resumes.some((resume) => resume.name === newName)) {
      errorToast("A resume with this name already exists.")

      return
    }
    setEditModalOpen(false)

    setLoading(true)

    const token = localStorage.getItem("access_token")
    if (!token) {
      errorToast("Authorization token is missing.")
      setLoading(false)

      return
    }

    const fullUrl = `${BASE_URL}${API_ENDPOINTS.UpdateResume(
      currentEditingResume?._id
    )}`

    try {
      const response = await fetch(fullUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ resumeName: newName })
      })

      if (!response.ok) {
        throw new Error("Failed to update resume name")
        setLoading(false)
      }

      console.log("Updated Name:", newName)
      console.log("Resume ID:", currentEditingResume?._id)

      setResumes((prevResumes) =>
        prevResumes.map((resume) =>
          resume._id === currentEditingResume?._id
            ? { ...resume, name: newName }
            : resume
        )
      )
      setLoading(false)

      successToast("Resume name updated successfully!")
      setCurrentEditingResume(null)
    } catch (error) {
      setLoading(false)

      console.error("Error updating resume name:", error)
      errorToast("Failed to update resume name.")
    }
  }

  const handleConfirmDelete = async () => {
    if (!currentDeletingResume || !currentDeletingResume._id) {
      console.error("No resume ID found to delete.")
      errorToast("Resume ID missing. Cannot delete.")
      return
    }

    const resumeId = currentDeletingResume._id

    setDeleteModalOpen(false)
    setLoading(true)

    try {
      const res = await deleteResume(resumeId)
      if (res.success == false) {
        errorToast(res.message)
        setLoading(false)
        return
      }
      if (res.success) {
        successToast(res.message)
        // Remove from local state
        setResumes((prevResumes) =>
          prevResumes.filter((resume) => resume._id !== resumeId)
        )
      }
    } catch (error) {
      errorToast("Failed to delete resume.")
    } finally {
      setLoading(false)
      setCurrentDeletingResume(null)
    }
  }

  const handleEditClick = async (resume: ResumeList) => {
    setLoading(true)

    try {
      const res = await getResumeDetails(resume._id)
      if (res.error) {
        console.log(res.error)
        errorToast(res.error)
        return
      }
      //
      if (res.resume) {
        localStorage.setItem("resumeResponse", JSON.stringify(res.resume))
        localStorage.setItem("resumeName", res.resume.resumeName)
        localStorage.setItem("resumeUrlPath", res.resume.resumeUrl)
        localStorage.setItem("edited", "true")
        console.log("Saved resume data to localStorage:", res.resume)
        // Optional navigation after saving
        setLoading(false)

        navigate("/resume-manager/editResume", {
          state: {
            resumeName: resume.name,
            _id: resume._id
          }
        })
      }
    } catch (error) {
      console.error("Error fetching resume details:", error)
      errorToast("Failed to fetch resume details.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    getAllResumes()
      .then((res) => {
        if (res.error) {
          console.log("Error fetching resumes:", res.error)
          errorToast(res.error)
        }
        if (res.resumes) {
          setResumes(res.resumes)
        }
      })
      .finally(() => {
        setLoading(false)
      })
    localStorage.removeItem("edited")
    localStorage.removeItem("resumeUrlPath")
    localStorage.removeItem("resumeName")
    localStorage.removeItem("resumeResponse")
  }, [])

  return (
    <DashBoardLayout>
      <div className="bg-almostBlack w-full h-full  border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
        <div className="w-full lg:px-10">
          <div className="justify-end flex pr-3 md:pr-0 w-full py-7 ">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setUploadModalOpen(true)}
                className="p-3 px-5 flex items-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd">
                <img
                  src={uploadResumeHere}
                  className="mr-2"
                  alt="Upload Icon"
                  loading="lazy"
                />
                Upload Resume
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                className="p-3 px-3 flex items-center space-x-2 max-w-40 text-primary min-w-max text-navbar font-bold rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd">
                <HiArrowLeft className="mr-2" />
                Go Back
              </Button>
            </div>
          </div>

          <div className="px-5">
            <p className="text-xl md:text-2xl justify-start font-normal text-primary">
              Edit your resumes/CV's
            </p>
          </div>
          {/* Conditionally render based on whether resumes exist */}
          {loading ? (
            <div className="w-full flex justify-center items-center py-20">
              <CircularIndeterminate />
            </div>
          ) : resumes.length === 0 ? (
            <div className="w-full h-80 bg-lightPurple justify-center items-center flex rounded-lg">
              <Button
                onClick={() => setUploadModalOpen(true)}
                className="py-5 px-8 flex items-center space-x-2  max-w-40 min-w-max text-primary text-navbar font-bold rounded-lg border-2 border-purpleBorder hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd">
                UPLOAD YOUR RESUME FIRST
              </Button>
            </div>
          ) : (
            <div className=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-5 md:p-0 mt-5">
              {resumes.map((resume, index) => (
                <ResumeCard
                  key={resume._id}
                  resumeName={`${index + 1}. ${resume.name}`}
                  status={resume.status}
                  options={generateDropdownOptions(resume)}
                  onEditClick={() => handleEditClick(resume)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for uploading resume */}
      <ResumeUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleResumeSubmit}
      />

      {/* Modal for editing resume name */}
      {currentEditingResume && (
        <EditResumeNameModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setCurrentEditingResume(null)
          }}
          currentName={currentEditingResume.name}
          onSave={handleSaveEditedName}
        />
      )}

      {/* Modal for deleting resume */}
      {currentDeletingResume && (
        <DeleteResumeModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setCurrentDeletingResume(null)
          }}
          resumeName={currentDeletingResume.name}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashBoardLayout>
  )
}

export default UploadAndShowResume
