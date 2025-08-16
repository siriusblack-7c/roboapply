import React from "react";

const LoaderBar = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-primary text-2xl md:text-4xl font-medium text-center">
        Uploading Resume
      </p>
      <p className="text-lightGrey text-2xl text-center pt-7 pb-5">
        Fetching information ....
      </p>
      {/* Loader Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div className="h-full bg-gradient-to-r from-gradientStart to-gradientEnd animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

export default LoaderBar;
