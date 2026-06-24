import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setloged }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Login failed");
      } else {
        setloged(true);
        localStorage.setItem("loggedIn", "true");

        // alert("Login successful!");

        setErrorMessage("");
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-purple-100 px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-8 text-center">
          Welcome Back!
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full space-y-6">

          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-700 font-semibold">
            Sign Up here
          </a>
        </p>
      </main>
    </div>
  );
};

export default Login;
