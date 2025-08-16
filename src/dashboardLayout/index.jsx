// import React from "react";
// import DashboardNavbar from "../dashboardNavbar";
// import DashboardSidebar from "../dashboardSidebar";

// const DashBoardLayout = ({ children }) => {
//   return (
//     <div className="flex flex-col h-screen">
//       <header className="">
//         <DashboardNavbar />
//       </header>

//       <div className="flex flex-grow">
//         <aside className="hidden lg:block bg-almostBlack text-white">
//           <DashboardSidebar />
//         </aside>

//         <main className="flex-grow bg-almostBlack">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default DashBoardLayout;

import React from "react"
import DashboardNavbar from "../dashboardNavbar"
import DashboardSidebar from "../dashboardSidebar"

const DashBoardLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex-shrink-0 z-10">
        <DashboardNavbar />
      </header>

      <div className="flex h-full flex-grow overflow-hidden">
        <aside className="hidden lg:block bg-almostBlack text-white max-w-64 flex-shrink-0 overflow-y-auto hide-scrollbar">
          <DashboardSidebar />
        </aside>

        <main className="flex-grow h-full bg-almostBlack overflow-hidden  relative border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0">
          <div className="w-full h-full overflow-y-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashBoardLayout
