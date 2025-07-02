"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showHero, setShowHero] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const router = useRouter();

  // Ensure animations only run on client to avoid hydration mismatch
  useEffect(() => {
    setShowHero(true);
    setShowImage(true);
  }, []);

  // Simulate authentication check (replace with your real logic)
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="w-full h-[100dvh] min-h-0 max-h-[100dvh] overflow-hidden  text-white flex flex-col">
      <div className="flex-1 w-full flex flex-col-reverse lg:flex-row lg:justify-between items-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-0 gap-8 lg:gap-0 justify-center">
        {/* Hero Text with animation from left */}
        <div className={`w-full lg:w-[55%] mb-6 lg:mb-0 flex flex-col items-center md:items-start text-center md:text-left ${showHero ? "animate-slideInLeft" : "opacity-0"}`}>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl">
            Connect with your loved ones—
            <span className="text-purple-400">like never before</span>
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-gray-300 mb-8 ">
            Experience crystal-clear calls and immersive conversations with
            MeshMeet. Enjoy seamless connectivity, privacy, and a beautiful
            interface.
          </p>
          <div className="flex  gap-4 w-full  justify-center lg:justify-start">
            <button
              className="px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 transition text-white font-bold shadow-lg text-base md:text-lg"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        </div>
        {/* Image with animation from right */}
        <div className={`w-full lg:w-[45%] flex justify-center items-center ${showImage ? "animate-slideInRight" : "opacity-0"}`}>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-400 bg-black/40   w-full max-w-xs sm:max-w-md md:max-w-lg">
            <Image
              src="/landing.jpg"
              alt="Video Call Illustration"
              width={400}
              height={400}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
      {/* Animations for hero and image */}
      <style jsx global>{`
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-slideInRight {
          animation: slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </main>
  );
}
