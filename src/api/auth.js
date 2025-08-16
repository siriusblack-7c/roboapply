import API_ENDPOINTS from "./endpoints";
import { postRequest } from "./httpRequests";

// Login
const login = async (credentials) => {
  const response = await postRequest(API_ENDPOINTS.LOGIN, credentials);
  console.log("+++++++++", response.result.access_token.accessToken);
  localStorage.setItem(
    "access_token",
    response.result.access_token.accessToken
  );
  localStorage.setItem("user_data", JSON.stringify(response.result.user));

  return response;
};

// Register
const register = async (userData) => {
  const response = await postRequest(API_ENDPOINTS.SignUP, userData);
  return response;
};

// Forget Password
const forgetPassword = async (email) => {
  const response = await postRequest(API_ENDPOINTS.ForgetPassword, { email });
  return response;
};

// verify otp
const verifyOTP = async (otp) => {
  const response = await postRequest(API_ENDPOINTS.VerifyOTP, {
    resetPasswordOtp: otp,
  });
  return response;
};

// Reset Password
const resetPassword = async (data) => {
  const response = await postRequest(API_ENDPOINTS.ResetNewPassword, data);
  return response;
};

// google Sign In
const googleSignIn = async (token) => {
  const response = await postRequest(API_ENDPOINTS.GOOGLE_SIGN_IN, token);
  localStorage.setItem("access_token", response.result.accessToken);
  localStorage.setItem("user_data", JSON.stringify(response.result.user));

  return response;
};

const authService = {
  login,
  register,
  googleSignIn,
  forgetPassword,
  verifyOTP,
  resetPassword,
};

export default authService;
