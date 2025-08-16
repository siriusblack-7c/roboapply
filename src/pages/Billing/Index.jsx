import React, { useState } from "react";
import DashBoardLayout from "../../dashboardLayout";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import BillingModal from "./ui/BillingModal";
import CancelSubscriptionModal from "./ui/CancelSubscriptionModal";

const Billing = () => {
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [billingInfo, setBillingInfo] = useState({});

  const handleBillingUpdate = (info) => {
    setBillingInfo(info);
    console.log("Updated Billing Info:", info); // Handle as needed
  };

  const handleCancelConfirm = () => {
    // Add cancel logic here (e.g., API call)
    console.log("Account cancellation confirmed");
    setIsCancelModalOpen(false);
  };
  return (
    <DashBoardLayout>
      <div className="w-full px-6 md:px-16 py-10 border-t-dashboardborderColor border-l-dashboardborderColor border border-r-0 border-b-0 text-white min-h-screen">
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-semibold">
            Account & Billing
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            Manage your subscription, payment methods, invoices, and transaction
            history with ease.
          </p>
          <div className="w-full max-w-[70%] md:max-w-[60%] border-b-2 border-purple mx-auto mt-3" />
        </div>

        <div className="mt-14">
          <h2 className="text-lg md:font-semibold uppercase">Account</h2>
          <p className="mt-4 text-base">
            <span className="md:font-semibold">User Account :</span>{" "}
            techoneoutsourcingng@gmail.com
          </p>
        </div>

        <div className="hidden md:flex justify-start gap-[42%] items-center mt-8 border-b border-gray-700 pb-3">
          <h3 className="uppercase font-semibold text-xl">Your Current Plan</h3>
          <h3 className="uppercase font-semibold text-xl">Billing</h3>
        </div>
        <div className="flex flex-col md:flex-row lg:px-10 w-full justify-between mt-6 gap-6">
          <h3 className="flex md:hidden uppercase font-semibold text-sm border-b">
            Your Current Plan
          </h3>
        </div>
        <div className=" lg:flex lg:gap-5 py-5">
          {/* left side */}
          <div className="flex flex-col w-full items-center justify-center p-10 border rounded-xl border-ProgressBarColor text-center whitespace-nowrap">
            <h1 className="text-xl md:text-3xl font-semibold">Premium Plan</h1>
            <h1 className="text-xl md:text-2xl font-bold mt-2">
              $59.99
              <span className="p-2 text-xs text-gray-400 font-light">
                / Monthly
              </span>
            </h1>

            <Link
              to="/pricingPlan"
              className="w-full max-w-[80%] mt-2 bg-gradient-to-b from-gradientStart to-gradientEnd rounded-lg p-3 text-primary hover:ring-2 hover:ring-gradientEnd"
            >
              Upgrade Plan
            </Link>
          </div>

          <div className="flex md:hidden flex-col md:flex-row lg:px-10 w-full justify-between py-5 gap-6">
            <h3 className="flex md:hidden uppercase font-semibold text-sm border-b">
              Billing
            </h3>
          </div>
          {/* Right Side */}
          <div className="w-full flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-2 w-full items-start justify-start p-5 md:p-10 border rounded-xl bg-analyticsBoxBackground border-primary text-left whitespace-nowrap">
              <p className="text-sm md:text-xl font-semibold mb-1">
                Payment Method
              </p>
              <p className="text-sm md:text-xl font-medium ">
                Paypal
                <span className="text-extraLightGrey px-2">|</span>
                <Link to="#" className="text-danger cursor-pointer">
                  Update
                </Link>
              </p>
              <p className="text-sm md:text-xl font-semibold mb-1">
                Last Payment
              </p>
              <p className="text-sm md:text-xl font-medium ">
                March 04, 2025 - US$29.00
                <span className="text-extraLightGrey px-2">|</span>
                <span className="">Active</span>
              </p>
            </div>

            <div className="flex flex-col gap-y-2 w-full items-start justify-start p-5 md:p-10 border rounded-xl bg-analyticsBoxBackground border-primary text-left whitespace-nowrap">
              <p className="text-sm md:text-xl font-semibold mb-1">
                Billing Period
              </p>
              <p className="text-sm md:text-xl font-medium ">
                Plan Billed Monthly
                <span className="text-extraLightGrey px-2">|</span>
                <Link to="#" className="text-danger cursor-pointer">
                  Update
                </Link>
              </p>
              <p className="text-sm md:text-xl font-semibold mb-1">
                Last Payment
              </p>
              <p className="text-sm md:text-xl font-medium ">
                April 04, 2025 - US$29.00
                <span className="text-extraLightGrey px-2">|</span>
              </p>
            </div>

            <div className="flex flex-col gap-y-2 w-full items-start justify-start p-5 md:p-10 border rounded-xl bg-analyticsBoxBackground border-primary text-left whitespace-nowrap">
              <p className="text-sm md:text-xl font-semibold mb-1">
                Billing Information
              </p>

              <Button
                onClick={() => setIsBillingModalOpen(true)}
                className="text-danger text-sm md:text-xl font-medium  cursor-pointer"
              >
                Update
              </Button>

              <p className="text-sm md:text-xl font-semibold mb-1">
                Cancel Subscription
              </p>

              <Button
                onClick={() => setIsCancelModalOpen(true)}
                className="text-danger text-sm md:text-xl font-medium  cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
      />
      <BillingModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        onSave={handleBillingUpdate}
      />
    </DashBoardLayout>
  );
};

export default Billing;
