import React, { useState, useEffect } from "react"
import DashBoardLayout from "../../dashboardLayout"
import Button from "../../components/Button"
import { FaPlus } from "react-icons/fa"
import CircularIndeterminate from "../../components/loader/circular"
import CoverLetterCard from "./ui/CoverLetterCard"
import { useNavigate } from "react-router-dom"

// ✅ Dummy cover letter data
const dummyCoverLetters = [
  { name: "Software Engineer Cover Letter", status: "Reviewed" },
  { name: "Product Manager Cover Letter", status: "Pending" },
  { name: "Marketing Role Cover Letter", status: "Rejected" }
]

const MainCoverLetter = () => {
  const [loading, setLoading] = useState(true)
  const [coverLetters, setCoverLetters] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoverLetters(dummyCoverLetters) // Always try to set dummy data
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleEditClick = (coverLetter) => {
    console.log("Editing:", coverLetter)
  }

  const handleDeleteClick = (coverLetter) => {
    console.log("Deleting:", coverLetter)
    setCoverLetters((prev) => prev.filter((cl) => cl.name !== coverLetter.name))
  }

  return (
    <DashBoardLayout>
      <div className="bg-almostBlack w-full h-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
        <div className="w-full lg:px-10">
          <div className="justify-between flex pr-3 md:pr-0 w-full py-7">
            <div className="px-5">
              <p className="text-xl md:text-3xl justify-start font-bold text-primary">
                My Cover Letters
              </p>
              <p>View, Edit and Share your cover letters here.</p>
            </div>
            <div className="flex items-center gap-3">
              {/* ✅ Always visible */}
              <Button
                onClick={() => navigate("/coverletter")}
                className="p-3 px-5 flex items-center whitespace-nowrap gap-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd">
                <FaPlus />
                New Cover Letter
              </Button>
            </div>
          </div>

          {/* ✅ Loading state */}
          {loading ? (
            <div className="w-full flex justify-center items-center py-20">
              <CircularIndeterminate />
            </div>
          ) : coverLetters.length === 0 ? (
            // ✅ Shown only when no cover letters
            <div className="w-full h-80 bg-lightPurple justify-center items-center flex rounded-lg">
              <Button
                onClick={() => navigate("/coverletter")}
                className="py-5 px-8 flex items-center space-x-2 max-w-40 min-w-max text-primary text-navbar font-bold rounded-lg border-2 border-purpleBorder hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd">
                CREATE YOUR COVER LETTER FIRST
              </Button>
            </div>
          ) : (
            // ✅ Cover letter cards if data exists
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-5 md:p-0 mt-5">
              {coverLetters.map((coverLetter, index) => (
                <CoverLetterCard
                  key={index}
                  coverLetterName={coverLetter.name}
                  onEditClick={() => handleEditClick(coverLetter)}
                  onDeleteClick={() => handleDeleteClick(coverLetter)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashBoardLayout>
  )
}

export default MainCoverLetter
