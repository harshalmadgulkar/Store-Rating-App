import { useState } from "react";
import { useNavigate, Link } from "react-router";
import FloatingInput from "@components/FloatingInput";
import { apiPool } from "@utils/apiPool";
import useApiCall from "@hooks/useApiCall";
import loginCover from '@assets/coverPage.jpg';
import DotsLoader from "@components/DotsLoader";
import { toast } from "sonner";
import { UserPlusIcon } from "lucide-react"; // Updated Icon

const Signup = () => {
  const navigate = useNavigate();
  const { apiCall } = useApiCall();
  const { userApi } = apiPool;

  // Expanded state to match backend: name, email, password, address
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: ""
  });
  const [loader, setLoader] = useState<boolean>(false);

  // Helper to update state object
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateSignup = (data: any) => {
    const { name, email, password, address } = data;

    if (!name || name.length < 20 || name.length > 60) {
      return "Name must be between 20 and 60 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (!password || password.length < 8) {
      return "Password should be at least 8 characters long.";
    }

    if (address && address.length > 400) {
      return "Address cannot exceed 400 characters.";
    }

    return null; // No errors
  };

  const handleSignup = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const errorMessage = validateSignup(formData);
    if (errorMessage) {
      return toast.error(errorMessage);
    }

    setLoader(true);
    try {
      const response = await apiCall({
        endpoint: userApi.signup.path,
        method: userApi.signup.method,
        payload: formData
      });

      if (response.data) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong.');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="flex w-full md:max-w-6xl h-[85vh] bg-white shadow-2xl rounded-2xl overflow-hidden">

        {/* Left Side: Illustration */}
        <div className="hidden md:flex md:w-1/2 relative">
          <img
            src={loginCover}
            alt="Signup Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent flex items-end p-12 text-white">
            <div>
              <h2 className="text-4xl italic font-extrabold mb-4">Join Us Today</h2>
              <p className="text-lg opacity-90 text-blue-50">
                Create an account to start managing and rating your favorite stores.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-sm">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-500">Sign up to get started</p>
            </header>

            <form onSubmit={handleSignup} className="space-y-5">
              <FloatingInput
                label="Full Name"
                type="text"
                labelBg="bg-white"
                value={formData.name}
                onChange={(val) => handleChange("name", val)}
                required
              />

              <FloatingInput
                label="Email Address"
                type="email"
                labelBg="bg-white"
                value={formData.email}
                onChange={(val) => handleChange("email", val)}
                required
              />

              <FloatingInput
                label="Address"
                type="text"
                labelBg="bg-white"
                value={formData.address}
                onChange={(val) => handleChange("address", val)}
                required
              />

              <FloatingInput
                label="Password"
                type="password"
                labelBg="bg-white"
                value={formData.password}
                onChange={(val) => handleChange("password", val)}
                required
              />

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                disabled={loader}
              >
                {loader ? <DotsLoader size="sm" /> : (
                  <>
                    <UserPlusIcon size={18} />
                    <span>Sign Up</span>
                  </>
                )}
              </button>
            </form>

            <footer className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 font-semibold hover:underline">
                Sign In
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;