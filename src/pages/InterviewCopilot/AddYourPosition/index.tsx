import React, { useState, useEffect, useRef } from "react";
import DashBoardLayout from "../../../dashboardLayout";
import Button from "@/src/components/Button/index";
import Setting from "@/src/assets/Setting.svg";
import {
  PlusOutlined,
  DownOutlined,
  CalendarOutlined,
  CodeOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Delete from "@/src/assets/delete.svg"
import { Select, Dropdown } from "antd";
import CircularIndeterminate from "../../../components/loader/circular";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "https://staging.robo-apply.com";

const AddYourPosition = () => {
  const [loadingLoader, setLoadingLoader] = useState(false);
  const [isFirstTabActive, setFirstTabActive] = useState(true);
  const [isLVModalVisible, setLVModalVisible] = useState(false);
  const [isAddPositionModalVisible, setAddPositionModalVisible] = useState(false);
  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    position: "",
    company: "",
    companyDetails: "",
    jobDescription: "",
  });

  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center space-x-2">
          <CalendarOutlined />
          <span>General</span>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      type: "group",
      label: "Specialized Skills",
    },
    {
      key: "3",
      label: (
        <div className="flex items-center space-x-2">
          <CodeOutlined />
          <span>Coding Copilot</span>
        </div>
      ),
    },
  ];

  const fileInputRef = useRef(null);

  const handleUpcoming = () => {
    setFirstTabActive(true);
  };

  const handleCompleted = () => {
    setFirstTabActive(false);
  };

  const handleMockupInterview = () => {};

  const handleLiveInterview = () => {
    setLVModalVisible((prev) => !prev);
  };

  const handleAddPosition = () => {
    setAddPositionModalVisible(true);
  };

  const handleCloseModal = () => {
    setAddPositionModalVisible(false);
    setFormData({ position: "", company: "", companyDetails: "", jobDescription: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setPositions((prev) => [
      ...prev,
      { ...formData, id: Date.now() }, // Unique ID for each entry
    ]);
    handleCloseModal();
  };

  const handleEdit = (id) => {
    const positionToEdit = positions.find((p) => p.id === id);
    if (positionToEdit) {
      setFormData(positionToEdit);
      setAddPositionModalVisible(true);
      setPositions(positions.filter((p) => p.id !== id));
    }
  };

  const handleDelete = (id) => {
    setPositions(positions.filter((p) => p.id !== id));
  };

  return (
    <>
      {loadingLoader && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <CircularIndeterminate />
        </div>
      )}
      <DashBoardLayout>
        <div className="bg-almostBlack w-full h-full border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
          <div className="w-full px-5 md:px-10">
            <div className="pb-10 pt-10 flex justify-between items-center gap-5">
              <div className="flex flex-col w-full gap-8">
                <p className="font-bold text-3xl mb-3">Role</p>
                <div className="flex justify-between w-full">
                  <div className="text-[#CCCCCC] text-xl flex-1">
                    Helps you clarify your expectations and allows AI to
                    accurately match your needs, <br /> enhancing your
                    professional performance in interviews.
                  </div>
                  <div className="flex-3">
                    <Button
                      className="py-4 flex items-center space-x-2 w-full justify-center text-xs md:text-xl whitespace-nowrap font-semibold rounded-lg bg-none text-primary border border-primary px-4"
                    >
                      <img src={Setting} />
                      <span> Setting </span>
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleMockupInterview}
                  className="p-3 px-5 flex w-fit items-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                >
                  <PlusOutlined /> <span> Create </span>
                </Button>
                <div className="flex items-center justify-end">
                  <div className="flex w-fit gap-4 p-2 rounded-lg">
                    <Button
                      onClick={handleAddPosition}
                      className="p-3 px-5 flex items-center whitespace-nowrap space-x-2 max-w-full text-primary min-w-max text-navbar font-bold rounded-lg bg-gradient-to-b from-gradientStart to-gradientEnd hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                    >
                      <PlusOutlined /> <span> Add Your Position </span>
                    </Button>
                  </div>
                </div>

                <div className="w-full  rounded-lg">
                  <div className="grid grid-cols-6 text-white font-semibold text-base bg-[#454545] rounded-tl-md rounded-tr-md">
                    <div className="py-3 px-4">Position</div>
                    <div className="py-3 px-4">Company</div>
                    <div className="py-3 px-4">Company Details</div>
                    <div className="py-3 px-4">Job Description</div>
                    <div className="py-3 px-4">Action</div>
                  </div>
                  {positions.map((position) => (
                    <div
                      key={position.id}
                      className="grid grid-cols-6 text-white text-sm border-b border-gray-700"
                    >
                      <div className="py-2 px-4">{position.position}</div>
                      <div className="py-2 px-4">{position.company}</div>
                      <div className="py-2 px-4">
                        {position.companyDetails || "Fill this in"}
                      </div>
                      <div className="py-2 px-4">
                        {position.jobDescription || "Fill this in"}
                      </div>
                      <div className="py-2 px-4 flex space-x-2">
                        <button
                          onClick={() => handleEdit(position.id)}
                          className="text-[#05AB15] hover:text-green-700 bg-[#172819] px-2 py-1 flex justify-around items-center gap-2"
                        >
                          <EditOutlined /> <span> Edit </span> 
                        </button>
                        <button className="text-[#0E40E4] hover:text-blue-700 bg-[#201d70] px-2 py-1 flex justify-around items-center gap-2">
                          <EyeOutlined /> <span> View </span> 
                        </button>
                        <button
                          onClick={() => handleDelete(position.id)}
                          className="text-red-500 hover:text-red-700 bg-[#2C1717] px-4 py-1 flex justify-around items-center gap-2"
                        >
                          <DeleteOutlined /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashBoardLayout>

      {isAddPositionModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#333333] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#454545] pb-2">
              <h2 className="text-white text-xl font-bold">Company Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-white text-2xl px-2 rounded-md bg-[#454545]"
              >
                &times;
              </button>
            </div>
            <p className="text-[#CCCCCC] text-sm mb-4">
              Share your job position and company details with the AI to create, intelligent, interview plans.
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div>
                  <label className="text-white block mb-1 font-bold">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Position Example"
                    className="w-full p-2 bg-[#454545] border-none text-white rounded"
                  />
                </div>
                <div>
                  <label className="text-white block mb-1 font-bold">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company Example"
                    className="w-full p-2 bg-[#454545] border-none text-white rounded"
                  />
              </div>
              </div>
              <div>
                <label className="text-white block mb-1 font-bold">Company Details</label>
                <textarea
                  name="companyDetails"
                  value={formData.companyDetails}
                  onChange={handleInputChange}
                  placeholder="Copy and paste the company description here"
                  className="w-full p-2 bg-[#454545] text-white rounded h-24 border-none"
                  maxLength={3000}
                ></textarea>
                <p className="text-[#CCCCCC] text-sm text-left">
                  3000 characters left
                </p>
              </div>
              <div>
                <label className="text-white block mb-1 font-bold">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  placeholder="Copy and paste the job description here"
                  className="w-full p-2 bg-[#454545] text-white border-none rounded h-24"
                  maxLength={3000}
                ></textarea>
                <p className="text-[#CCCCCC] text-sm text-left">
                  3000 characters left
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-4 space-x-4">
              <Button
                onClick={handleSubmit}
                className="p-2 px-4 bg-gradient-to-b from-gradientStart to-gradientEnd text-white rounded"
              >
                <PlusOutlined/> <span> Create</span>
                
              </Button>
              <Button
                onClick={handleCloseModal}
                className="p-2 px-4 text-white rounded bg-[#454545]"
              >
                <span> Cancel </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddYourPosition;