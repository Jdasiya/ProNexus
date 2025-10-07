import React, { useEffect, useState } from "react";
import Logo from "../../../assets/logo.png"; // adjust path if needed
import { Link, useNavigate } from "react-router-dom";
import CustomAlert from "../../../components/CommonAlert/CommonAlert";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

const LoginPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [alertTopic, setAlertTopic] = useState("");
  const [buttonCount, setButtonCount] = useState(1);
  const [positiveButton, setPositiveButton] = useState(false);
  const [negartiveButton, setNegartiveButton] = useState(false);

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect( () => {
    fetchData();
  },[])
  
  useEffect(() => {},[username, password]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users");
      console.log("users ---->>>>>: ", response.data);
      setUsers(response.data);
    } catch (error) {
      console.log("Error: ", error);
      setAlertTopic("Error");
      setAlertDescription("Something went wrong, please try again");
      setShowAlert(true);
      setButtonCount(1);
      setNegartiveButton(true);
      setPositiveButton(false);
    }
  };

  const onclick_Login = () => {
    if (username === "" || password === "") {
      console.log("login button clicked");
      setAlertTopic("Error");
      setAlertDescription("Please fill in all the fields");
      setShowAlert(true);
      setButtonCount(1);
      setNegartiveButton(true);
      setPositiveButton(false);

      return;
    }

    setIsLoading(true);

    let user_name_trimed = username.trim();
    let password_trimed = password.trim();

    let check_user = users
      ? users.filter(
          (user) =>
            user.username === user_name_trimed &&
            user.password === password_trimed
        )
      : [];

    console.log("login button clicked", check_user);

    if (check_user.length > 0) {
      console.log("user login");
      localStorage.setItem("username", username);
      localStorage.setItem("userDetails", JSON.stringify(check_user));
      setIsLoading(false);
      navigate("/home");
    } else {
      console.log("user invalid");
      setIsLoading(false);
      setAlertTopic("Error");
      setAlertDescription("Invalid username or password");
      setButtonCount(1);
      setShowAlert(true);
      setNegartiveButton(true);
      setPositiveButton(false);

      setUsername("");
      setPassword("");
    }
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log('Google login success:', credentialResponse);
    try {
      if (!credentialResponse || !credentialResponse.credential) {
        console.error("No credential received from Google");
        setAlertTopic("Error");
        setAlertDescription("Failed to receive credentials from Google. Please try again.");
        setShowAlert(true);
        setButtonCount(1);
        setNegartiveButton(true);
        setPositiveButton(false);
        return;
      }

      // Log the token length for debugging
      console.log("Received token length:", credentialResponse.credential.length);

      setIsLoading(true);
      // Verify the Google token on your backend
      const response = await axios.post('http://localhost:8080/auth/google', {
        token: credentialResponse.credential
      });
      
      // If successful, store user data and redirect
      if (response.data) {
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userDetails", JSON.stringify([response.data]));
        setIsLoading(false);
        navigate("/home");
      }
    } catch (error) {
      console.log("Google auth error:", error);
      setIsLoading(false);
      let errorMessage = "Google authentication failed. Please try again.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      setAlertTopic("Error");
      setAlertDescription(errorMessage);
      setShowAlert(true);
      setButtonCount(1);
      setNegartiveButton(true);
      setPositiveButton(false);
    }
  };

  // Handle Google login failure
  const handleGoogleLoginError = () => {
    console.log('Google login failed');
    setAlertTopic("Error");
    setAlertDescription("Google login failed. Please try again.");
    setShowAlert(true);
    setButtonCount(1);
    setNegartiveButton(true);
    setPositiveButton(false);
  };

  return (
    <>
      {showAlert && (
        <CustomAlert
          alertvisible={showAlert}
          onPositiveAction={() => setShowAlert(false)}
          onNegativeAction={() => setShowAlert(false)}
          alertDescription={alertDescription}
          alertTitle={alertTopic}
          buttonCount={buttonCount}
          positiveButton={positiveButton}
          negartiveButton={negartiveButton}
        />
      )}
      
      {/* Modern LinkedIn-style UI */}
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <img src={Logo} alt="Pronexus Logo" className="h-10 w-auto" />
              <h1 className="ml-4 text-2xl font-semibold text-blue-700 hidden sm:block">Pronexus</h1>
            </div>
            <div>
              <Link 
                to="/signup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
              >
                Join now
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left column - Welcome text */}
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Welcome to your professional community
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Connect with professionals, stay informed with industry updates, and build your career.
              </p>
              <div className="hidden md:block">
                <img 
                  src="https://static.licdn.com/aero-v1/sc/h/dxf91zhqd2z6b0bwg85ktdygm" 
                  alt="Professionals" 
                  className="max-w-md rounded-lg shadow-md" 
                />
              </div>
            </div>

            {/* Right column - Login form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Sign in</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username or Email
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email or username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <button
                    onClick={onclick_Login}
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    Sign in
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign in with</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleLoginSuccess}
                      onError={handleGoogleLoginError}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-gray-600">
                New to Pronexus?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Join now
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <img src={Logo} alt="Pronexus Logo" className="h-8 w-auto" />
              <span className="ml-2 text-sm text-gray-500">© 2024 Pronexus</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">About</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Accessibility</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">User Agreement</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Cookie Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Copyright Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LoginPage;
