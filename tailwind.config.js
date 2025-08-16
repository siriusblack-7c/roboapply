/** @type {import('tailwindcss').Config} */

const { purple } = require("@mui/material/colors");
const { dark } = require("@mui/material/styles/createPalette");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        normal: "16px",
        navbar: "16px",
        large: "48px",
      },
      colors: {
        primary: "rgba(255, 255, 255, 1)",
        secondary: "rgba(233, 226, 255, 1)",
        primaryBackground: "rgba(16, 9, 25, 1)",
        gradientStart: "#AF63FB",
        gradientEnd: "#8C20F8",
        greenColor: "rgba(38, 171, 95, 1)",
        purple: "rgba(166, 82, 250, 1)",
        ProgressBarText: "rgba(171, 136, 251, 1)",
        ProgressBarColor: "rgba(255, 193, 7, 1)",
      },
      fontWeight: {
        normal: "400",
        bold: "700",
      },
      screens: {
        xs: "480px",
        sm: "640px", // Small devices (landscape phones, 576px and up)
        md: "768px", // Medium devices (tablets, 768px and up)
        lg: "1024px", // Large devices (desktops, 1024px and up)
        xl: "1280px", // Extra large devices (large desktops, 1280px and up)
      },
      borderRadius: {
        full: "100px",
        feedbackCardRadius: "24px, 24px, 24px, 4px",
      },
      textColor: {
        primary: "rgba(255, 255, 255, 1)",
        black: "rgba(0, 0, 0, 1)",
        secondary: "rgba(233, 226, 255, 1)",
        lightGrey: "rgba(255, 255, 255, 0.48)",
        greyColor: "rgba(255, 255, 255, 0.8)",
        extraLightGrey: "rgba(188, 188, 188, 1)",
        lightestGrey: "rgba(212, 212, 212, 1)",
        faqAnsColor: "rgba(254, 254, 254, 0.8)",
        purpleColor: "rgba(166, 82, 250, 1)",
        blackColor: "rgba(42, 42, 42, 1)",
        profileNameColor: "rgba(224, 224, 224, 1)",
        profileEmailColor: "rgba(94, 110, 120, 1)",
        ProgressBarText: "rgba(171, 136, 251, 1)",
        ProgressBarColor: "rgba(255, 193, 7, 1)",
        placeHolderColor: "rgba(255, 255, 255, 0.5)",
        jobSeekersColor: "rgba(255, 255, 255, 0.64)",
        lightPurple: "rgba(44, 33, 54, 1)",
        prupleText: "rgba(140, 32, 248, 1)",
        // danger: "rgba(240, 160, 160, 1)",
        danger: "rgba(255, 115, 115, 1)",
        tickPurle: "rgba(175, 99, 251, 1)",
        redColor: "rgb(255, 0, 0)",
        yellowColor: "rgba(255, 193, 7, 1)",
        lightGrey: "rgba(193, 193, 193, 1)",
      },
      backgroundColor: {
        purpleBackground: "rgba(166, 82, 250, 1)",
        modalPurple: "rgba(54, 37, 71, 1)",
        lightestGrey: "rgba(212, 212, 212, 1)",
        purple: "rgba(130, 29, 182, 1)",
        tablePurple: "rgba(159, 95, 227, 1)",
        darkPurple: "rgba(61, 40, 82, 0.5)",
        glass: "rgb(255, 255, 255, 0.04)",
        lightBackground: "rgba(255, 255, 255, 0.1)",
        lightGreyBackground: "rgba(255, 255, 255, 0.1)",
        darkestPurple: "rgba(77, 39, 115, 1)",
        almostBlack: "rgba(26, 26, 26, 1)",
        totalBlack: "rgba(19, 19, 19, 1)",
        faqBackground: "rgba(254, 254, 254, 0.07)",
        inputBackGround: "rgba(69, 69, 69, 1)",
        whiteBackground: "rgba(255, 255, 255, 1)",
        dropdownBackground: "rgba(251, 251, 251, 0.08)",
        multipleDropdownBackground: "rgba(45, 45, 45)",
        cardBgColor: "rgba(27, 21, 37, 1)",
        lightPurple: "rgba(44, 33, 54, 1)",
        green: "rgba(0, 127, 0, 1)",
        yellow: "rgba(255, 193, 7, 1)",
        blue: "rgba(0, 123, 255, 1)",
        red: "rgb(255, 0, 0)",
        dangerColor: "rgba(240, 160, 160, 1)",
        resumeTemplateBackground: "rgba(155, 61, 249, 0.5)",
        stepperBackground: "rgba(158, 66, 249, 1)",
        analyticsBoxBackground: "rgba(44, 44, 44, 1);",
      },
      borderColor: {
        customGray: "rgba(114, 114, 114, 1)",
        customPurple: "rgba(130, 29, 182, 1)",
        dashboardborderColor: "rgba(161, 161, 161, 0.2)",
        formBorders: "rgba(69, 69, 69, 1)",
        simplePurple: "rgba(166, 82, 250, 1)",
        purpleBorder: "rgba(140, 32, 248, 1)",
        almostBlackBorder: "rgba(26, 26, 26, 1)",
        dangerBorder: "rgba(240, 160, 160, 1)",
        stepperBackground: "rgba(158, 66, 249, 1)",
        yellow: "rgba(255, 193, 7, 1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addUtilities }) {
      addUtilities({
        ".hide-scrollbar": {
          /* Hide the scrollbar */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "&": {
            "-ms-overflow-style": "none" /* IE and Edge */,
            "scrollbar-width": "none" /* Firefox */,
          },
        },
      });
    },
  ],
};
