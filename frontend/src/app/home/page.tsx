"use client";

import { useEffect, useState } from "react";
import {
  Video,
  Link as Rocket,
  ArrowRight,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [meetingCode, setMeetingCode] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
    if(!token){
      router.push('/login');
    }
  },[])

  const handleJoinMeeting = () => {
    if (meetingCode.trim()) {
      // Handle joining meeting
      console.log("Joining meeting:", meetingCode);
    }
  };

  return (
    <div className="min-h-screen  lg:h-screen w-full flex items-center justify-center">
      <div className="w-full lg:max-w-7xl flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-0 px-4 py-10 mt-10 ">
        {/* Left Content */}
        <motion.div
          className="relative flex flex-col justify-center items-center lg:items-start w-full lg:w-[48%] space-y-10 text-center lg:text-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Hero Text */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl  font-extrabold text-white leading-tight drop-shadow-2xl">
              Seamless Video
              <span className="block bg-gradient-to-r from-[#C27AFF] via-[#6C63FF] to-[#3A8DFF] bg-clip-text text-transparent animate-gradient-x">
                Collaboration
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-lg text-gray-200 leading-relaxed font-medium mt-2">
              Meet, collaborate, and create — all from one link.
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-lg text-gray-300 leading-relaxed mt-1">
              Effortlessly connect with your team, clients, or friends from anywhere.
            </p>
          </div>

          {/* Join Meeting Card */}
          <div
            className="relative border border-blue-300/40 shadow-2xl bg-white/90 backdrop-blur-2xl rounded-3xl overflow-hidden group hover:shadow-3xl transition-all duration-400 max-w-lg pt-5 lg:mx-0 mx-auto px-2 lg:px-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative pb-8 pt-2 px-4 sm:px-8">
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="text-xl sm:text-2xl md:text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                  Got a link?
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  Paste your meeting code or link below to jump right in.
                </p>
              </div>
              {/* Input Section */}
              <form
                className="flex flex-col sm:flex-row gap-3 items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleJoinMeeting();
                }}
              >
                {/* Mobile-only input section improvements */}
                <div className="w-full flex flex-col gap-2 sm:hidden">
                  <input
                    type="text"
                    placeholder="🔲 Code or link"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                    className="h-14 text-base px-5 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-2xl bg-white/95 placeholder:text-gray-400 font-semibold transition-all duration-200 shadow-lg w-full text-center tracking-wide outline-none"
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <button
                    type="submit"
                    className={`h-14 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 text-lg ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  >
                    <span>Join Meeting</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
                {/* Desktop/tablet input section (unchanged) */}
                <div className="hidden sm:flex flex-1 flex-row gap-3 w-full">
                  <input
                    type="text"
                    placeholder="🔲 Code or link"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                    className="flex-1 h-12 text-base px-4 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white/95 backdrop-blur placeholder:text-gray-400 font-medium transition-all duration-200 shadow-md w-full"
                  />
                  <button
                    type="submit"
                    className={`h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  >
                    <span>Join</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
              {/* Bottom Text */}
              <div className="text-center mt-5">
                <p className="text-gray-500 text-sm font-medium">
                  No installs. No fuss. Just instant connection.
                </p>
                <div className="flex items-center justify-center space-x-2 text-blue-500 hover:text-blue-700 transition-colors cursor-pointer mt-3 group/link text-sm">
                  <Sparkles className="w-5 h-5 group-hover/link:animate-spin" />
                  <span className="font-medium">
                    Discover how MeshMeet keeps your conversations flowing.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Modern Illustration */}
        <motion.div
          className="hidden lg:flex relative w-full lg:w-[51%] justify-center items-center mt-8 lg:mt-0"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="relative z-10 w-full max-w-md sm:max-w-lg">
            {/* Main Illustration Container */}
            <div className="relative bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-3xl p-4 md:p-8 shadow-2xl border border-white/30">
              {/* Video Call Interface Mockup */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Bar */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                      Team Meeting
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                </div>
                {/* Video Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      {
                        name: "Alex",
                        color: "from-blue-500 to-blue-600",
                        avatar: "A",
                      },
                      {
                        name: "Sarah",
                        color: "from-green-500 to-green-600",
                        avatar: "S",
                      },
                      {
                        name: "Mike",
                        color: "from-purple-500 to-purple-600",
                        avatar: "M",
                      },
                      {
                        name: "Emma",
                        color: "from-orange-500 to-orange-600",
                        avatar: "E",
                      },
                    ].map((person, i) => (
                      <div
                        key={i}
                        className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                      >
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-r ${person.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                        >
                          {person.avatar}
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {person.name}
                        </div>
                        {i === 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            Speaking
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Control Bar */}
                  <div className="flex items-center justify-center space-x-4 bg-gray-900 rounded-xl py-4">
                    <button
                      className="text-white hover:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                    <button
                      className="text-white hover:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <Users className="w-5 h-5" />
                    </button>
                    <button
                      className="text-white hover:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      type="button"
                    >
                      <Rocket className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
