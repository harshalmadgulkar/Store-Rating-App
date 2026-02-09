import { useState } from "react";
import { useNavigate, Link } from "react-router"; // Added for navigation
import FloatingInput from "@components/FloatingInput";
import { apiPool } from "@utils/apiPool";
import useApiCall from "@hooks/useApiCall";
import loginCover from '@assets/coverPage.jpg';
import roxiller_logo from '@assets/roxiller_logo.webp';
import DotsLoader from "@components/DotsLoader";
import { toast } from "sonner";
import { LogInIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { apiCall } = useApiCall();
  const { userApi } = apiPool;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    setLoader(true);
    try {
      const response = await apiCall({
        endpoint: userApi.login.path,
        method: userApi.login.method,
        payload: { email, password }
      });

      if (response.data.token) {
        toast.success("Welcome back!");
        dispatch(loginSuccess({ user: response.data, token: response.data.token }));
        if (response.data.user.role === 'USER') {
          navigate("/dashboard/stores");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(response.message || 'Invalid login credentials');
      }
    } catch (error) {
      toast.error(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="flex w-full md:max-w-6xl h-[85vh] bg-white shadow-2xl rounded-2xl overflow-hidden">

        <div className="hidden md:flex md:w-1/2 relative">
          <img
            src={loginCover}
            alt="Login Illustration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent flex items-end p-12 text-white">
            <div>
              <h2 className="text-4xl italic font-extrabold mb-4">Store Rating App</h2>
              <p className="text-lg opacity-90 text-blue-50">
                The most reliable way to manage and track your store's performance.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
          <div className="w-full max-w-sm">
            <img src={roxiller_logo} width={150} height={150} className="mx-auto" />
            <header className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-500">Please enter your details to sign in</p>
            </header>

            <form onSubmit={handleLogin} className="space-y-6">
              <FloatingInput
                label="Email Address"
                type="email"
                labelBg="bg-white"
                value={email}
                onChange={(val) => setEmail(val)}
                required
              />

              {/* <div className="space-y-2"> */}
              <FloatingInput
                label="Password"
                type="password"
                labelBg="bg-white"
                value={password}
                onChange={(val) => setPassword(val)}
                required
              />
              {/* <div className="text-right">
                  <button type="button" className="text-sm font-medium text-blue-600 hover:underline">
                    Forgot password?
                  </button>
                </div> */}
              {/* </div> */}

              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                disabled={loader}
              >
                {loader ? <DotsLoader size="sm" /> : (
                  <>
                    <LogInIcon size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <footer className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                Create an account
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;