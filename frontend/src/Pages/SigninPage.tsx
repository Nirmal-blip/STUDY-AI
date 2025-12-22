import React, { useState, FormEvent, ChangeEvent } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaChalkboardTeacher,
  FaArrowRight,
  FaArrowLeft,
  FaGoogle,
  FaBrain
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import GrpImg from "../assets/AuthImg.png";
import { useAuth } from "../contexts/AuthContext";

const SigninPage: React.FC = () => {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, userType as any);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000
      });

      navigate("/student-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50">
      <div className="flex min-h-screen flex-row">

        {/* Left Image */}
        <div className="hidden lg:flex lg:w-[65%] bg-white relative overflow-hidden h-screen rounded-r-[6rem]">
          <div className="flex w-full h-full items-center justify-center">
            <img
              src={GrpImg}
              alt="AI Study Tool"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-[35%] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-indigo-50">
          <div className="max-w-md mx-auto w-full relative">
            
            {/* Back */}
            <div className="absolute top-[-80px] right-0">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex ">
                <FaArrowLeft className="mr-2 mt-1" />
                Back</div>
              </button>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-4">
                <FaBrain className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to continue your AI-powered learning journey
              </p>
            </div>

            {/* User Type */}
            <div className="flex gap-3 mb-8 justify-center">
              <button
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
                  userType === "student"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
                onClick={() => setUserType("student")}
              >
                <FaUser className="mr-2" />
                Student
              </button>

            </div>

            {/* Google Auth
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition mb-6"
            >
              <FaGoogle className="mr-3 text-red-500" />
              Continue with Google
            </button> */}

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-indigo-50 text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Start Learning
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
