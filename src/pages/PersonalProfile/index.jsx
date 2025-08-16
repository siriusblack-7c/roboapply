import React, { useState, useEffect } from "react";
import DashBoardLayout from "../../dashboardLayout";
import { FaCamera } from "react-icons/fa";
import profilePic from "../../assets/profilePic.svg";
import SimpleInputField from "../../components/SimpleInputFields";
import Button from "../../components/Button";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteAccountModal from "../../components/Modals/DeleteAccountModal";
import { useNavigate } from "react-router-dom";

const PersonalProfile = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Track the selected image file
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const Navigate = useNavigate();

  // Function to handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const newImageUrl = URL.createObjectURL(file);
      setImageSrc(newImageUrl);
      setImageFile(file); // Save the file to state
      console.log("Selected file:", file.name); // Debug: Log file name upon selection
    } else {
      alert("Please select a valid JPG or PNG image.");
    }
  };

  // Function to trigger the file input when the camera icon is clicked
  const triggerFileSelect = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = () => {
    console.log("Name:", name);
    console.log("Email:", email);
    console.log(
      "Profile Picture:",
      imageFile ? imageFile.name : "No file selected"
    );
  };

  const handleDelete = () => {
    // setIsDeleteModalOpen(true);
    Navigate("/accountcancelation");
  };

  const handleConfirmDelete = () => {
    console.log("Deleting account permanently...");
    setIsDeleteModalOpen(false); // Close the modal after confirming
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("user_data");

    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
        setName(user.fullName || "");
        setEmail(user.email || "");
        setImageSrc(user.imageUrl || ""); // fallback handled in img tag
      } catch (error) {
        console.error("Error parsing user_data from localStorage:", error);
      }
    }
  }, []);

  return (
    <DashBoardLayout>
      <div className="bg-almostBlack w-full h-screen md:h-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
        <div className="w-full p-5 md:px-20 py-10">
          <div className="w-full border border-customGray bg-inputBackGround p-5 md:p-16 flex flex-col items-center">
            {/* Circular Image Container */}
            <div className="relative mb-4">
              {/* Circular Image */}
              <div className="w-20 h-20 md:w-36 md:h-36  rounded-full bg-gray-300 flex justify-center items-center overflow-hidden">
                <img
                  src={imageSrc ? imageSrc : profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Camera Icon Overlay */}
              <div
                className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md cursor-pointer"
                onClick={triggerFileSelect} // Opens file input on click
              >
                <FaCamera className="w-3 h-3 md:w-5 md:h-5 text-gray-600" />
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                id="fileInput"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                style={{ display: "none" }} // Hide the input
              />
            </div>

            {/* Text Under Image */}
            <div className="w-full">
              <p className="text-primary text-lg md:text-2xl font-semibold text-center">
                Edit Profile Picture
              </p>
            </div>
          </div>
          <div className="items-center justify-start w-full flex py-7">
            <p className="text-xl font-normal border-b-2 border-purple pb-1">
              Personal Information
            </p>
          </div>

          {/* Name and Email Inputs */}
          <div className="flex flex-col space-y-4 w-full">
            <SimpleInputField
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
            <SimpleInputField
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              readOnly
            />
          </div>

          {/* Buttons Row */}
          <div className="md:flex w-full  justify-center md:justify-between items-center mt-10 md:mt-20">
            {/* Left Button: Delete Account */}
            <div className="justify-center md:justify-start w-full flex">
              <Button
                onClick={handleDelete}
                className="p-3 px-5 text-primary font-bold bg-transparent border flex gap-2 items-center border-purpleBorder rounded-full hover:border-dangerBorder hover:text-danger  transition"
              >
                Delete Account
                <RiDeleteBin6Line />
              </Button>
            </div>

            {/* Right Buttons: Cancel and Save */}
            <div className="flex space-x-4 mt-10 md:mt-0 justify-center">
              <Button
                onClick={() => console.log("Cancelled")}
                className="p-3 px-8 bg-none border border-purpleBorder text-primary rounded-full hover:bg-purpleBackground transition"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="p-3 px-10 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded-full hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </DashBoardLayout>
  );
};

export default PersonalProfile;
