import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaChalkboardTeacher,
  FaBook,
  FaLayerGroup,
  FaArrowRight,
  FaArrowLeft,
  FaGoogle,
  FaBrain,
  FaIdCard
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import GrpImg from "../assets/AuthImg.png";
import { useAuth } from "../contexts/AuthContext";

interface FormData {
  fullname: string;
  email: string;
  password: string;
  learningLevel: string;
  preferredSubject: string;
  educatorId: string;
  expertise: string;
}

const inputClass = `
  peer w-full pl-12 pr-4 py-3 rounded-xl
  bg-white/70 backdrop-blur
  border border-gray-200 shadow-sm
  text-gray-900 placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-indigo-500/30
  focus:border-indigo-500 transition-all duration-300
`;

const iconClass =
  "absolute left-4 top-1/2 -translate-y-1/2 text-gray group-focus-within:text-indigo-600 transition-colors";

const SignupPage: React.FC = () => {
  const [userType, setUserType] = useState<"student" | "educator">("student");
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    password: "",
    learningLevel: "",
    preferredSubject: "",
    educatorId: "",
    expertise: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    if (
      userType === "educator" &&
      (!formData.educatorId || !formData.expertise)
    ) {
      toast.error("Educator ID and expertise are required");
      return;
    }

    setIsLoading(true);
    try {
      await register({ ...formData, userType });
      toast.success("Welcome to AI Study Tool 🚀");
      navigate("/student-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex">
      {/* LEFT IMAGE */}
      <div className="hidden lg:flex w-[60%] bg-white rounded-r-[6rem] items-center justify-center">
        <img src={GrpImg} alt="AI Study" className="max-h-[80vh]" />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-[40%] flex items-center justify-center px-6">
        <div className="max-w-md w-full relative">
          {/* BACK */}
          <div className="absolute top-[-10px] right-0">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
              >
                <div className="flex ">
                <FaArrowLeft className="mr-2 mt-1" />
                Back</div>
              </button>
              </div>

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-4">
              <FaBrain className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create AI Study Account
            </h1>
            <p className="text-gray-600">
              Learn smarter with AI-powered explanations
            </p>
          </div>

          {/* ROLE */}
          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={() => setUserType("student")}
              className={`px-6 py-3 rounded-xl font-semibold ${
                userType === "student"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              <FaUser className="inline mr-2" />
              Student
            </button>

           
          </div>

          {/* CARD */}
          <div className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/10">
            {/* GOOGLE
            <button className="w-full flex items-center justify-center py-3 mb-6 bg-white border rounded-xl">
              <FaGoogle className="mr-3 text-red-500" />
              Continue with Google
            </button> */}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* NAME */}
              <div className="relative group">
                <FaUser className={iconClass} />
                <input
                  name="fullname"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* EMAIL */}
              <div className="relative group">
                <FaEnvelope className={iconClass} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* PASSWORD */}
              <div className="relative group">
                <FaLock className={iconClass} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* STUDENT FIELDS */}
              {userType === "student" && (
                <>
                  <div className="relative group">
                    <FaLayerGroup className={iconClass} />
                    <input
                      name="learningLevel"
                      placeholder="Class / Year (e.g. 12th, UG)"
                      value={formData.learningLevel}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="relative group">
                    <FaBook className={iconClass} />
                    <input
                      name="preferredSubject"
                      placeholder="Preferred Subject"
                      value={formData.preferredSubject}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {/* EDUCATOR FIELDS */}
              {userType === "educator" && (
                <>
                  <div className="relative group">
                    <FaIdCard className={iconClass} />
                    <input
                      name="educatorId"
                      placeholder="Educator ID / Institute"
                      value={formData.educatorId}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="relative group">
                    <FaBook className={iconClass} />
                    <input
                      name="expertise"
                      placeholder="Subject Expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {/* SUBMIT */}
              <button
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                {isLoading ? "Creating Account..." : "Get Started"}
                <FaArrowRight className="ml-2" />
              </button>

              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link to="/signin" className="text-indigo-600 font-semibold">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
