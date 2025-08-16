import React from "react";
import Button from "../../../../components/Button";
import { IoMdClose } from "react-icons/io";

const CancelSubscriptionModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      id="cancel-subscription-modal"
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => e.target.id === "cancel-subscription-modal" && onClose()}
    >
      <div className="bg-modalPurple rounded-lg p-4 md:p-8 w-full max-w-[90%] md:max-w-[40%] mt-10 relative border">
        {/* Close Button */}
        <Button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gradient-to-b rounded-full p-0.5 text-primary hover:ring-2 hover:ring-gradientEnd from-gradientStart to-gradientEnd"
        >
          <IoMdClose size={24} />
        </Button>

        {/* Modal Heading */}
        <h2 className="text-lg md:text-2xl font-semibold text-primary mb-6 text-center">
          Do You Really Want to Cancel Your Subscription?
        </h2>
        <div className="flex flex-col md:space-y-2 border border-x-0 border-customGray py-5">
          {/* Info Text */}
          <p className="text-sm md:text-base text-gray-300 mb-6 text-left">
            Canceling your account will permanently delete your profile,
            transaction history, and any saved preferences. This action cannot
            be undone.
          </p>

          {/* Checkboxes */}
          <div className="space-y-4 text-sm md:text-base text-left">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purpleColor bg-transparent border-2 border-gray-400 rounded focus:ring-purpleColor focus:outline-none checked:bg-transparent checked:text-purpleColor hover:border-purpleColor"
              />
              understand that canceling my account will permanently delete all
              associated data, including any digital assets and saved settings
              linked to my profile.
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purpleColor bg-transparent border-2 border-gray-400 rounded focus:ring-purpleColor focus:outline-none checked:bg-transparent checked:text-purpleColor hover:border-purpleColor"
              />
              understand that my account will be canceled as of [Insert
              Cancellation Date]. After this date, my subscription will not
              renew, but any pending payments for previous billing cycles will
              still be collected.
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-purpleColor bg-transparent border-2 border-gray-400 rounded focus:ring-purpleColor focus:outline-none checked:bg-transparent checked:text-purpleColor hover:border-purpleColor"
              />
              understand that if I choose to rejoin in the future, I may not
              have access to the current pricing or promotional rates as they
              are subject to change with feature updates.
            </label>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end mt-8 space-x-4">
          <Button
            onClick={onClose}
            className="px-4 py-2 font-semibold bg-gradient-to-b from-gradientStart to-gradientEnd text-primary rounded-lg hover:ring-2 hover:ring-gradientEnd"
          >
            Don’t Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 font-semibold bg-gradient-to-b from-gradientStart to-gradientEnd text-primary rounded-lg hover:ring-2 hover:ring-gradientEnd"
          >
            Cancel Subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
