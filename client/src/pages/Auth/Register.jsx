import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import FormInput from "../../components/common/FormInput";
import FormCard from "../../components/common/FormCard";
import toast from "react-hot-toast";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (userData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
      toast.success("🎉 Welcome to Donghua Tracker! Registration successful!");
      navigate("/");
    } catch (err) {
      const errorMessage = err.message || "Registration failed. Please try again.";
      toast.error(`❌ ${errorMessage}`);
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard 
      title="Join Donghua Tracker" 
      subtitle="Create your account to start tracking your favorite donghua"
    >
      {errors.general && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.general}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label="Username"
          name="username"
          type="text"
          value={userData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          required
          error={errors.username}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
          error={errors.email}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={userData.password}
          onChange={handleChange}
          placeholder="Create a strong password"
          required
          error={errors.password}
        />

        <FormInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={userData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 text-lg font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Sign in
        </Link>
      </div>
    </FormCard>
  );
};

export default Register;
