import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../../components/EmailInput";
import PasswordInput from "../../../components/PasswordInput";
import Button from "../../../components/Button";
import googleIcon from "../../../assets/socialMedia/google_logo.svg";
import signInImage from "../../../assets/auth/signInImage.webp";
import { successToast, errorToast } from "../../../components/Toast";
import authService from "../../../api/auth";
import logo from "../../../assets/logo.svg";
import CircularIndeterminate from "../../../components/loader/circular";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();

    const isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    setShowGoogleLogin(isIPhone);

    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id:
          "637508697495-nvbnuf0rsqt9ver41b2rgh40ft07q6ra.apps.googleusercontent.com",
        callback: handleGoogleSuccess,
      });
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      errorToast("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      successToast("Login successfully!");
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      errorToast("Wrong email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    if (!credential) return errorToast("No credential received");

    setLoading(true);
    try {
      await authService.googleSignIn({ idToken: credential });
      successToast("Google sign-in successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      errorToast("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = () => {
    errorToast("Google sign-in was unsuccessful. Try again.");
  };

  const handleCustomGoogleLogin = () => {
    const isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIPhone) {
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        window.google.accounts.id.prompt();
      } else {
        errorToast("Google login failed to initialize.");
      }
    } else {
      const googleLoginButton = document.querySelector(
        '[aria-labelledby="button-label"]'
      );
      if (googleLoginButton) {
        googleLoginButton.click();
      } else {
        errorToast("Google login failed to initialize.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-screen lg:h-screen md:p-10">
      <div className="block lg:flex bg-almostBlack p-5 lg:gap-14 rounded-2xl w-full h-full lg:max-w-[1050px] lg:max-h-[680px]">
        <img
          src={logo}
          className="cursor-pointer lg:hidden pb-5 lg:pl-5 w-[150px]"
          onClick={() =>
            (window.location.href = "https://beta.robo-apply.com/")
          }
        />

        <p className="block lg:hidden text-primary font-semibold text-2xl pb-5">
          Log In
        </p>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-2">
          <img
            src={signInImage}
            alt="Sign In"
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex order-2 lg:order-1">
          <div className="w-full">
            <div className="w-full flex lg:justify-between">
              <div className="flex gap-3 pt-5 md:pl-5">
                <img
                  src={logo}
                  className="cursor-pointer hidden lg:block"
                  onClick={() =>
                    (window.location.href = "https://beta.robo-apply.com/")
                  }
                />
              </div>
              <div className="flex lg:hidden gap-2 pt-5 md:pl-5 items-center whitespace-nowrap">
                <p className="text-right text-greyColor text-xs md:text-base">
                  Don’t have an account?
                </p>
                <Link
                  to="/signUp"
                  className="text-purpleColor hover:text-primary"
                >
                  Sign up
                </Link>
              </div>
            </div>

            <div className="w-full items-center lg:pt-14 md:pl-5">
              <p className="hidden lg:block text-primary font-semibold text-3xl">
                Log In
              </p>
              <p className="text-primary font-medium text-base md:text-xl pt-5">
                Welcome back! to AI powered jobs
              </p>

              <InputField
                type="text"
                placeholder="Email Address"
                className="mt-8"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                placeholder="Password"
                className="mt-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="justify-end flex mt-3 hover:underline">
                <Link className="text-primary" to="/forgetPassword">
                  Forgot password?
                </Link>
              </div>

              <div className="mt-5">
                <Button
                  onClick={handleSignIn}
                  className="flex items-center justify-center font-semibold p-3 px-8 w-full min-w-max h-12 text-navbar bg-gradient-to-b from-gradientStart to-gradientEnd rounded-lg hover:ring-2 hover:ring-gradientEnd focus:ring-2 focus:ring-gradientEnd"
                >
                  Sign in
                </Button>
              </div>

              {/* Custom Google Button */}
              <div
                className="mt-2 w-full flex justify-center"
                style={{ display: showGoogleLogin ? "none" : "flex" }}
              >
                <Button
                  onClick={handleCustomGoogleLogin}
                  className="flex items-center justify-center text-navbar rounded-lg py-3 mb-5 md:mb-0 font-semibold px-4 w-full bg-blue text-white hover:ring-2 hover:ring-[#4285F4] focus:ring-2 focus:ring-[#4285F4]"
                >
                  <img
                    src={googleIcon}
                    alt="Google Icon"
                    className="h-6 mr-3"
                    loading="lazy"
                  />
                  Sign in with Google
                </Button>
              </div>

              {/* Google Login rendered always but hidden unless iPhone */}
              <div
                className="mt-2 w-full flex justify-center"
                style={{ display: showGoogleLogin ? "flex" : "none" }}
              >
                <div className="w-[480px]">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                    useOneTap
                    text="signin_with"
                    shape="rectangular"
                    theme="filled_blue"
                  />
                </div>
              </div>

              <div className="hidden lg:flex gap-2 pt-5 items-center whitespace-nowrap">
                <p className="text-right text-primary text-xs md:text-base">
                  Don’t have an account?
                </p>
                <Link
                  to="/signUp"
                  className="text-purpleColor hover:text-primary"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 flex justify-center items-center text-white">
          <CircularIndeterminate />
        </div>
      )}
    </div>
  );
};

export default SignIn;
