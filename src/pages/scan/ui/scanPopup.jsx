import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { successToast } from "../../../components/Toast";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../../../components/Toast";

const UploadResumeScanDialog = ({ open, onClose, onSubmit }) => {
  const [resume, setResume] = useState(null); // For uploaded resume file
  const [description, setDescription] = useState("");
  const [fileError, setFileError] = useState(""); // For file validation errors
  const navigate = useNavigate();

  // Function to validate file type
  const validateFileType = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    // Check by MIME type first
    if (allowedTypes.includes(file.type)) {
      return true;
    }

    // Fallback: check by file extension
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    return allowedExtensions.includes(fileExtension);
  };

  const onDrop = (acceptedFiles, rejectedFiles) => {
    // Clear previous errors
    setFileError("");

    // Handle rejected files (by react-dropzone)
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (
        rejection.errors.some((error) => error.code === "file-invalid-type")
      ) {
        setFileError("Please upload only PDF, DOC, or DOCX files.");
      } else if (
        rejection.errors.some((error) => error.code === "too-many-files")
      ) {
        setFileError("Please upload only one file at a time.");
      } else {
        setFileError("File upload failed. Please try again.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Additional validation
      if (!validateFileType(file)) {
        setFileError("Please upload only PDF, DOC, or DOCX files.");
        return;
      }

      // Check file size (optional - limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setFileError("File size must be less than 10MB.");
        return;
      }

      setResume(file);
      setFileError("");
      successToast("Resume uploaded successfully!");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    multiple: false,
  });

  // const handleSubmit = () => {
  //   if (!resume || !description) {
  //     errorToast("Please input all required data!");
  //     return; // Prevent further execution if fields are empty
  //   }

  //   if (fileError) {
  //     errorToast("Please fix the file upload error before submitting.");
  //     return;
  //   }

  //   successToast("Data submitted successfully!");
  //   onSubmit({ resume, description });
  //   onClose(); // Close dialog after submitting
  // };

  const handleSubmit = () => {
    if (!resume || !description) {
      alert("Please input all required data!");
      return;
    }

    if (fileError) {
      alert("Please fix the file upload error before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", resume);
    formData.append("Jobdescription", description);

    onSubmit(formData); // Call the parent's API handler
  };

  const handleClose = () => {
    setResume(null);
    setDescription("");
    setFileError("");
    onClose();
  };

  // Reset the fields every time the dialog is opened
  useEffect(() => {
    if (open) {
      setResume(null);
      setDescription("");
      setFileError("");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        style: {
          backgroundColor: "#1E1E1E", // Dark background color
          borderRadius: "8px",
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.1)", // Light overlay
          backdropFilter: "blur(5px)", // Blurred background
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" style={{ color: "white" }}>
          Create New Scan
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box className="flex flex-col md:flex-row gap-4 md:items-center">
          {/* Resume Upload */}
          <Box className="flex-1 flex flex-col gap-2">
            <Typography
              variant="subtitle1"
              className="text-[#B0B0B0] text-sm font-bold"
            >
              Resume
            </Typography>
            <Box
              {...getRootProps()}
              className={`border border-dashed border-[#5E5E5E] p-4 flex items-center justify-center rounded-lg ${
                isDragActive ? "text-[#9A3CF9] bg-[#2E2E2E]" : "text-[#B0B0B0]"
              } ${fileError ? "border-red-500" : ""} cursor-pointer h-[200px]`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography className="text-[#9A3CF9]">
                  Drop your resume here...
                </Typography>
              ) : resume ? (
                <Typography className="text-white">
                  Uploaded: {resume.name}
                </Typography>
              ) : (
                <Typography className="w-full text-center">
                  Drag-n-drop or click to upload your resume
                  <br />
                  <span className="text-xs text-[#8A8A8A]">
                    Supported formats: PDF, DOC, DOCX (Max 10MB)
                  </span>
                </Typography>
              )}
            </Box>

            {/* Error Message */}
            {fileError && (
              <Alert
                severity="error"
                style={{
                  backgroundColor: "#2E1618",
                  color: "#F87171",
                  border: "1px solid #991B1B",
                }}
              >
                {fileError}
              </Alert>
            )}
          </Box>

          {/* Job Description */}
          <Box className="flex-1 flex flex-col gap-2">
            <Typography
              variant="subtitle1"
              className="text-[#B0B0B0] text-sm font-bold"
            >
              Job Description
            </Typography>
            <textarea
              placeholder="Job description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-[200px] bg-[#2E2E2E] text-white rounded-lg border border-[#424242] outline-none resize-none p-3"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        style={{
          padding: "16px",
          justifyContent: "end",
          gap: "1rem",
        }}
      >
        <Button
          onClick={handleClose}
          style={{
            color: "#B0B0B0",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!!fileError} // Disable submit button if there's a file error
          style={{
            backgroundColor: fileError ? "#6B7280" : "#9A3CF9",
            color: "white",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Scan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadResumeScanDialog;
