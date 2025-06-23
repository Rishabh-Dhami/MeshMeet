"use client";

import { useState } from "react";

export default function LoginPage() {
  // Only username and password for login
  const [form, setForm] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRememberChange = (e) => {
    setRemember(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // TODO: Handle login (API call, JWT, etc.)
    // Send { username, password } to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#4b6cb7] to-black p-4">
      <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-3xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <div className="flex items-center justify-between text-sm text-gray-300">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={remember}
                onChange={handleRememberChange}
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-purple-300 hover:underline">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white py-3 rounded-xl font-semibold"
          >
            Login
          </button>
        </form>
        <p className="text-gray-300 mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-purple-300 underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
