import React, { useState } from "react";
import Logo from "../../../assets/logo.png"; // adjust path if needed
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import CustomAlert from "../../../components/CommonAlert/CommonAlert";
import axios from "axios";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [alertTopic, setAlertTopic] = useState("");
  const [buttonCount, setButtonCount] = useState(1);
  const [positiveButton, setPositiveButton] = useState(false);
  const [negartiveButton, setNegartiveButton] = useState(false);

  const handleSignUp = async () => {
    // Handle sign-up logic here
    console.log("Sign-up button clicked");
    if (
      FirstName === "" ||
      LastName === "" ||
      Email === "" ||
      username === "" ||
      Password === "" ||
      ConfirmPassword === ""
    ) {
      console.log("Please fill in all required fields");

      setAlertTopic("Error");
      setAlertDescription("Please fill in all required fields");
      setShowAlert(true);
      setButtonCount(1);
      setNegartiveButton(true);
      setPositiveButton(false);

      return;
    }

    if (Password !== ConfirmPassword) {
      console.log("Passwords do not match");

      setAlertTopic("Error");
      setAlertDescription("Passwords do not match");
      setShowAlert(true);
      setButtonCount(1);
      setNegartiveButton(true);
      setPositiveButton(false);

      return;
    }

    setIsLoading(true);

    const userData = {
      firstName: FirstName,
      lastName: LastName,
      address: Address,
      phoneNumber: phoneNumber,
      email: Email,
      headline: `${FirstName} ${LastName}`,
      about: ""
    };

    const payload = {
      username: username.trim(),
      password: Password.trim(),
      userData: JSON.stringify(userData),
    };

    try {
      const response = await axios.post("http://localhost:8080/users", payload);
      console.log("User created successfully:", response.status);
      setIsLoading(false);

      if (response.status === 200) {
        setAlertTopic("Success");
        setAlertDescription("Sign up successful! Redirecting to login page...");
        setButtonCount(1);
        setShowAlert(true);
        setPositiveButton(true);
        setNegartiveButton(false);

        setTimeout(() => {
          navigate("/");
          setShowAlert(false);
        }, 2000);
      } else {
        setAlertTopic("Error");
        setAlertDescription("Something went wrong, please try again");
        setButtonCount(1);
        setShowAlert(true);
        setPositiveButton(false);
        setNegartiveButton(true);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setIsLoading(false);

      setAlertTopic("Error");
      setAlertDescription("Server error. Please try again later.");
      setButtonCount(1);
      setShowAlert(true);
      setNegartiveButton(true);
      setPositiveButton(false);
    }
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
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/">
                <img src={Logo} alt="Pronexus Logo" className="h-10 w-auto" />
              </Link>
              <h1 className="ml-4 text-2xl font-semibold text-blue-700 hidden sm:block">Pronexus</h1>
            </div>
            <div>
              <Link 
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Make the most of your professional life
              </h2>
              <p className="mt-2 text-sm text-gray-500 text-center mb-6">
                Join Pronexus to connect with professionals, build your network, and grow your career.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* First Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        value={LastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address *
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="sm:col-span-6">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username *
                    </label>
                    <div className="mt-1">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="sm:col-span-3">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm password *
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        value={ConfirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Location (optional)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        autoComplete="street-address"
                        value={Address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. New York, NY"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="sm:col-span-6">
                    <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                      Phone number (optional)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone-number"
                        id="phone-number"
                        autoComplete="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={10}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-gray-500">
                    By clicking "Join now", you agree to the Pronexus User Agreement, Privacy Policy, and Cookie Policy.
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      'Join now'
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already on Pronexus?{' '}
                  <Link to="/" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <img src={Logo} alt="Pronexus Logo" className="h-8 w-auto" />
              <span className="ml-2 text-sm text-gray-500">© 2024 Pronexus</span>
            </div>
            <div className="flex flex-wrap justify-center space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">About</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Accessibility</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">User Agreement</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Cookie Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 mb-2 sm:mb-0">Copyright Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SignUpPage;
