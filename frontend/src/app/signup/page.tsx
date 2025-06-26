// app/signup/page.tsx
"use client";

import api from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SignUpPage() {
  // Add name, username, and password for registration
  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const response = await api.post(`/users/register`, form);
      if(response?.data?.info?.accessToken){
        localStorage.setItem('accessToken', response.data.info.accessToken);
      }
      setSuccessMsg("Registration successful! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (error: any) {
      let msg = "Registration failed. Please try again.";
      if (error?.response?.data?.message) {
        msg = error.response.data.message;
      }
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#4b6cb7] to-black p-4">
      {/* Animated alert for success or error, right side */}
      {(successMsg || errorMsg) && (
        <div className={`fixed top-8 right-8 z-[100] px-6 py-3 rounded-2xl shadow-2xl text-white font-semibold text-lg flex items-center gap-2 animate-slideInRight ${successMsg ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}
          style={{ minWidth: '220px', maxWidth: '90vw', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
          {successMsg ? (
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          {successMsg || errorMsg}
        </div>
      )}
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
      <style jsx global>{`
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(60px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
}
