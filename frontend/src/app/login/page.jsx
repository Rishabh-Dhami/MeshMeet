"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  // Only username and password for login
  const [form, setForm] = useState({ username: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRememberChange = (e) => {
    setRemember(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await api.post("/api/v1/users/login", form);
      console.log(response)
      if (response?.data?.info?.accessToken) {
        localStorage.setItem("accessToken", response.data.info.accessToken);
        setSuccessMsg("Login successful! Redirecting...");
        setTimeout(() => router.push("/home"), 1200);
      }
    } catch (error) {
      let msg = "Login failed. Please try again.";
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400 pr-12"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white focus:outline-none"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{marginTop: 0}}
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
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
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-300 underline">
            Sign up
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
