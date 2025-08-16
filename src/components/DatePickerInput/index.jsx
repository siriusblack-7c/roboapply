import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SlCalender } from "react-icons/sl";
import { getYear, getMonth } from "date-fns";

const DatePickerInput = ({
  label,
  placeholder,
  selectedDate,
  onChange,
  className,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDatePicker = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleDateChange = (date) => {
    onChange(date);
    setIsOpen(false); // Close the date picker after selecting a date
  };

  // Generate year range from 1990 to the current year using plain JS
  const currentYear = getYear(new Date());
  const years = [];
  for (let year = 1900; year <= currentYear; year++) {
    years.push(year);
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className={`w-full mb-2 ${className}`}>
      <label className="block text-primary text-base font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={selectedDate ? selectedDate.toLocaleDateString() : ""}
          readOnly
          onClick={() => setIsOpen(!isOpen)} // Toggle date picker on click
          className={`appearance-none block w-full bg-dropdownBackground text-primary rounded py-3 px-4 pr-10 
             focus:outline-none focus:ring-1 placeholder:text-primary
             ${
               error
                 ? "border border-dangerBorder focus:ring-red-500" // Red border for error
                 : "border border-formBorders focus:ring-purple-500 focus:border-purple-500" // Default border
             }`}
        />

        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)} // Open the date picker on icon click
        >
          <SlCalender className="text-primary" size={20} />
        </div>
        {isOpen && (
          <div className="absolute z-10 " style={{ bottom: "90%", right: "0" }}>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              onClickOutside={() => setIsOpen(false)} // Close the date picker on click outside
              inline
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div
                  style={{
                    margin: 10,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                  >
                    {"<"}
                  </button>
                  <select
                    value={getYear(date)}
                    onChange={({ target: { value } }) => changeYear(value)}
                    style={{
                      border: "none",
                      marginRight: "10px",
                      background: "none",
                    }}
                  >
                    {years.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <select
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) =>
                      changeMonth(months.indexOf(value))
                    }
                    style={{ border: "none", background: "none" }}
                  >
                    {months.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                  >
                    {">"}
                  </button>
                </div>
              )}
              className="z-10"
              popperPlacement="bottom" // Ensure the popper appears below the input
              popperModifiers={{
                preventOverflow: {
                  enabled: true,
                  boundariesElement: "viewport", // Prevents overflow from viewport
                },
              }}
            />
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">This field is required</p> // Error message below the input
      )}
    </div>
  );
};

export default DatePickerInput;
