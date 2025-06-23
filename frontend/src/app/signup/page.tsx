// app/signup/page.tsx
"use client";

import { useState } from "react";

export default function SignUpPage() {
  // Add name, username, and password for registration
  const [form, setForm] = useState({ name: "", username: "", password: "" });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(form);
    // API call here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#4b6cb7] to-black p-4">
      <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-3xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white py-3 rounded-xl font-semibold"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-300 mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-purple-300 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
