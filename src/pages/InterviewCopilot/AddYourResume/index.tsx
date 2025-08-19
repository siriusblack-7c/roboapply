import React, { useState, useRef } from "react"
import DashBoardLayout from "../../../dashboardLayout"
import Button from "@/src/components/Button/index"
import Setting from "@/src/assets/Setting.svg"
import Upload from "@/src/assets/upload.svg"
import Delete from "@/src/assets/delete.svg"
import ViewEye from "@/src/assets/view_eye.svg"
import { PlusOutlined, FilePdfOutlined } from "@ant-design/icons"
import CircularIndeterminate from "../../../components/loader/circular"
import { errorToast } from "@/src/components/Toast"

const AddYourResume = () => {
  const [loadingLoader, setLoadingLoader] = useState(false)
  const [isFirstTabActive, setFirstTabActive] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])

  const fileInputRef = useRef(null)

  const handleResumeUpload = (e) => {
    const selectedFiles = Array.from(e.target.files)
    selectedFiles.forEach((file) => {
      if (file.type === "application/pdf") {
        const newFile = {
          name: file.name,
          date: new Date().toLocaleDateString(),
          file: file
        }
        setFiles((prev) => [...prev, newFile])
      } else {
        errorToast("Only PDF files are allowed!")
      }
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    droppedFiles.forEach((file) => {
      if (file.type === "application/pdf") {
        const newFile = {
          name: file.name,
          date: new Date().toLocaleDateString(),
          file: file
        }
        setFiles((prev) => [...prev, newFile])
      } else {
        errorToast("Only PDF files are allowed!")
      }
    })
  }

  const handleAddResume = async () => {
    if (files.length === 0) return alert("No files selected")
    setLoadingLoader(true)
    const formData = new FormData()
    files.forEach((f) => formData.append("resume", f.file))
    try {
      const res = await fetch(`${process.env.VITE_APP_BASE_URL}/upload-resume`, {
        method: "POST",
        body: formData
      })
      if (res.ok) alert("Resume uploaded successfully!")
    } catch (err) {
      console.error(err)
      alert("Upload failed")
    }
    setLoadingLoader(false)
  }

  return (
    <>
      {loadingLoader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <CircularIndeterminate />
        </div>
      )}
      <DashBoardLayout>
        <div className="bg-almostBlack w-full h-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
          <div className="w-full px-5 md:px-10">
            <div className="pb-10 pt-10 flex flex-col gap-8">
              <p className="font-bold text-3xl mb-3">Resumes & Others</p>

              {/* Info + Setting */}
              <div className="flex justify-between w-full">
                <div className="text-[#CCCCCC] text-xl flex-1">
                  Upload your resume and cover letters, and AI will extract key content and remind <br /> you during the interview.
                </div>
                <Button className="py-4 flex items-center space-x-2 w-fit justify-center text-xs md:text-xl font-semibold rounded-lg bg-none text-primary border border-primary px-4">
                  <img src={Setting} />
                  <span>Setting</span>
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex w-fit bg-[#454545] p-2 rounded-lg">
                <Button
                  className={`p-3 px-5 flex items-center whitespace-nowrap font-bold rounded-lg ${
                    isFirstTabActive ? "bg-gradient-to-b from-gradientStart to-gradientEnd" : "text-primary"
                  }`}
                  onClick={() => setFirstTabActive(true)}
                >
                  Resumes
                </Button>
                <Button
                  className={`p-3 px-5 flex items-center whitespace-nowrap font-bold rounded-lg ${
                    !isFirstTabActive ? "bg-gradient-to-b from-gradientStart to-gradientEnd" : "text-primary"
                  }`}
                  onClick={() => setFirstTabActive(false)}
                >
                  Others
                </Button>
              </div>

              {/* Upload area */}
              <div className="flex items-center justify-between gap-4">
                <div
                  className={`flex w-fit gap-4 p-2 rounded-lg border ${
                    isDragging ? "border-white" : "border-[#454545]"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {!files.length ? (
                    <Button
                      onClick={() => fileInputRef.current.click()}
                      className="py-1 flex items-center space-x-2 w-fit justify-center text-xs md:text-xl font-semibold rounded-lg bg-none text-primary px-2"
                    >
                      <img src={Upload} />
                      <span>Drag to Upload</span>
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2 bg-[#2c2c2c] px-4 py-2 rounded">
                      <FilePdfOutlined/>
                      <span className="text-white">{files[files.length - 1].name}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                </div>

                <Button
                  onClick={handleAddResume}
                  className="p-3 px-5 flex items-center space-x-2 rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd font-bold"
                >
                  <PlusOutlined />
                  <span>Add Your Resume</span>
                </Button>
              </div>

              {/* Table */}
              <div className="mt-5">
                <div className="grid grid-cols-3 text-white font-semibold text-base bg-[#454545] rounded-tl-md rounded-tr-md">
                  <div className="py-3 px-4">File Name</div>
                  <div className="py-3 px-4">Upload Date</div>
                  <div className="py-3 px-4">Actions</div>
                </div>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 text-white font-normal text-base border-b border-[#454545] items-center"
                  >
                    <div className="py-3 px-4">{file.name}</div>
                    <div className="py-3 px-4">{file.date}</div>
                    <div className="py-3 px-4 flex gap-2">
                      <Button className="px-2 py-1 flex items-center justify-center rounded bg-[#121358] text-[#0E40E4]">
                        <img src={ViewEye} />
                        <span>View</span>
                      </Button>
                      <Button
                        onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                        className="px-2 py-1 flex items-center justify-center rounded bg-[#4d1414] text-[#D70303]"
                      >
                        <img src={Delete} />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </DashBoardLayout>
    </>
  )
}

export default AddYourResume
