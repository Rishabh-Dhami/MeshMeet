"use client";

import React, { useRef, useEffect, useState } from "react";
import { useParams , useRouter} from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Clock,
  Monitor,
  Phone,
  Share2,
  Edit3,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import io from "socket.io-client";

// Modern Badge component for status display
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}
  >
    {children}
  </span>
);

export default function VideoMeeting() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
    if(!token){
      router.push("/login");
    }
  },[])

  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const socketRef = useRef<null | ReturnType<typeof io>>(null);
  const socketIdRef = useRef<string | null>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [video, setvideo] = useState<MediaStream | undefined>();
  const [audio, setAudio] = useState<MediaStream | undefined>();
  const [screen, setScreen] = useState<MediaStream | undefined>();
  const [showModel, setShowModel] = useState<boolean | undefined>();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [newMessages, setNewMessages] = useState<number>(3);
  const [askForUsername, setAskForUsername] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [videos, setVideos] = useState<MediaStream[]>([]);
  // dsf
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("Guest User");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [muteNotification, setMuteNotification] = useState<string>("");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  // Modern animated alert for screen sharing errors
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'info' | 'success' } | null>(null);

  useEffect(() => {
    // Request camera/mic permissions based on toggles
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: isAudioEnabled,
        });
        if (mediaRef.current) {
          mediaRef.current.srcObject = stream;
        }
      } catch (err: any) {
        setShowPermissionDialog(true);
        if (err.name === "NotAllowedError") {
          setPermissionError("Access to camera/microphone was denied. Please click the lock icon in your browser's address bar and allow permissions, then try again.");
        } else if (err.name === "NotFoundError") {
          setPermissionError("No camera or microphone was found. Please connect a device and try again.");
        } else {
          setPermissionError("Permission denied. Please allow camera and microphone access in your browser settings to join the meeting.");
        }
      }
    };
    if (isVideoEnabled || isAudioEnabled) {
      startMedia();
    }
    return () => {
      if (mediaRef.current?.srcObject) {
        const stream = mediaRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoEnabled, isAudioEnabled]);

  useEffect(() => {
    setMeetingLink(window?.location?.href || "");
    // Example: connect to socket server
    const socket = io("https://your-socket-server.com");
    socket.emit("join-room", slug, userName);
    socket.on("participants", (users: string[]) => setParticipants(users));
    // ...add more socket event listeners as needed...
    return () => {
      socket.disconnect();
    };
  }, [slug, userName]);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsConnecting(false);

    // Here you would implement actual connection logic
    console.log("Joining meeting as:", userName);
  };

  const handleAllowPermissions = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (mediaRef.current) {
        mediaRef.current.srcObject = stream;
      }
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
      setShowPermissionDialog(false);
    } catch (err: any) {
      setShowPermissionDialog(true);
      let msg = "Permission denied. Please allow camera and microphone access in your browser settings to join the meeting.";
      if (err && err.name === "NotAllowedError") {
        msg = "Access to camera/microphone was denied. Please click the lock icon in your browser's address bar and allow permissions, then try again.";
      } else if (err && err.name === "NotFoundError") {
        msg = "No camera or microphone was found. Please connect a device and try again.";
      }
      setPermissionError(msg);
    }
  };

  const handleCopyLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1200);
    }
  };

  const handleScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (mediaRef.current) {
        mediaRef.current.srcObject = displayStream;
      }
      setIsScreenSharing(true);
      displayStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
      };
    } catch (err) {
      setAlert({ message: "Screen sharing was cancelled or denied.", type: "error" });
      setTimeout(() => setAlert(null), 2500);
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled((prev) => {
      const newState = !prev;
      if (mediaRef.current?.srcObject) {
        const stream = mediaRef.current.srcObject as MediaStream;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) videoTrack.enabled = newState;
      }
      return newState;
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => {
      const newState = !prev;
      if (mediaRef.current?.srcObject) {
        const stream = mediaRef.current.srcObject as MediaStream;
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = newState;
      }
      setMuteNotification(newState ? "Unmuted" : "Muted");
      setTimeout(() => setMuteNotification(""), 1200);
      return newState;
    });
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingName(false);
  };

  // Utility for user initials
  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="mt-5 md:mt-0 flex flex-col lg:flex-row overflow-hidden justify-center items-center min-h-screen px-4 md:px-8  gap-2  lg:gap-10">
      {/* Left Side - Video Preview */}
      <motion.div
        className="w-full lg:w-[64%] flex items-center justify-center mt-6 md:mt-15"
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="relative w-full  lg:max-w-3xl">
          {/* Video Container */}
          <div
            className={`w-full relative aspect-video bg-gray-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl transition-all duration-300 h-[320px] md:h-[400px] lg:h-[440px]`}
          >
            {/* Always render the video element, hide with CSS if video is disabled */}
            <video
              ref={mediaRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
            />
            {/* Show initials if video is disabled */}
            {!isVideoEnabled && (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-5 lg:mb-6">
                    <span className="text-lg md:text-2xl lg:text-3xl font-semibold text-white">
                      {getUserInitials(userName)}
                    </span>
                  </div>
                  <p className="text-gray-300 text-base md:text-xl lg:text-2xl font-medium">
                    {userName}
                  </p>
                </div>
              </div>
            )}

            {/* Permission Dialog Overlay */}
            {showPermissionDialog && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 md:p-8 z-20">
                <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-8 max-w-xs md:max-w-md text-center">
                  <h3 className="text-white text-base md:text-2xl font-semibold mb-3 md:mb-6">
                    Do you want people to see and hear you in the meeting?
                  </h3>
                  {permissionError && (
                    <div className="text-red-400 text-sm mb-3">{permissionError}</div>
                  )}
                  <Button
                    onClick={handleAllowPermissions}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-full font-medium text-sm md:text-lg"
                  >
                    Allow microphone and camera
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 md:space-x-4">
              <button
                onClick={toggleAudio}
                className=" py-3 px-3 relative bg-red-500 rounded-full"
                aria-label="Toggle microphone"
              >
                {isAudioEnabled ? (
                  <i className="fa-solid fa-microphone text-xl px-1 text-white"></i>
                ) : (
                  <i className="fa-solid fa-microphone-slash text-xl text-white"></i>
                )}
                {!isAudioEnabled && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
              </button>
              <button
                onClick={toggleVideo}
                className="py-3 px-3 relative bg-red-500 rounded-full"
                aria-label="Toggle camera"
              >
                {isVideoEnabled ? (
                  <i className="fa-solid fa-video text-xl px-1 text-white"></i>
                ) : (
                  <i className="fa-solid fa-video-slash text-xl text-white"></i>
                )}
                {!isVideoEnabled && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                )}
              </button>
              <button
                className={`py-3 px-3 relative ${
                  isScreenSharing ? "bg-blue-500" : "bg-red-500"
                } rounded-full`}
                aria-label="Screen share"
                onClick={handleScreenShare}
              >
                <i className="fa-solid fa-desktop text-xl text-white"></i>
              </button>
            </div>
          </div>

          {/* Permission Status */}
          <div className="flex items-center justify-center space-x-4 md:space-x-8 mt-3 md:mt-4 text-xs md:text-sm text-gray-100">
            <div className="flex items-center space-x-1 md:space-x-2">
              <div
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                  isAudioEnabled ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span>Mic {isAudioEnabled ? "allowed" : "blocked"}</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <div
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${
                  isVideoEnabled ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span>Camera {isVideoEnabled ? "allowed" : "blocked"}</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
              <span>Speaker</span>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Right Side - Meeting Controls */}
      <motion.div
        className="w-full lg:w-[40%] xl:w-[28rem] bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-lg text-white mt-6 lg:mt-0 lg:py-4"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className="px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg md:text-2xl font-semibold">Ready to join?</h1>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Clock className="h-4 w-4 mr-1" />Ready
            </Badge>
          </div>
          <p className="text-xs md:text-md">
            {participants.length > 1
              ? `${participants.length - 1} other${
                  participants.length - 1 > 1 ? "s" : ""
                } in the meeting`
              : "No one else is here"}
          </p>
        </div>
        {/* User Name Section */}
        <div className="py-3 px-4 md:py-4 md:px-8 border-b border-gray-200">
          <label className="text-xs md:text-sm font-medium mb-2 md:mb-3 block">
            Your name
          </label>
          <div className="flex items-center space-x-2 md:space-x-3">
            {isEditingName ? (
              <form onSubmit={handleNameSubmit} className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 h-9 md:h-12 text-base md:text-lg border border-gray-300 rounded-lg px-3 md:px-4 py-1 md:py-2 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all duration-200"
                  autoFocus
                />
                <Button
                  type="submit"
                  className="h-9 md:h-12 px-4 md:px-6 text-sm md:text-base"
                >
                  Save
                </Button>
              </form>
            ) : (
              <>
                <div className="flex-1 h-9 md:h-12 px-3 md:px-4 py-1 md:py-3 border rounded-lg md:rounded-xl bg-white/10 flex items-center">
                  <span className="text-base md:text-lg">{userName}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingName(true)}
                  className="h-9 w-9 md:h-12 md:w-12 p-0"
                >
                  <Edit3 className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
        {/* Join Actions */}
        <div className="py-3 px-4 md:py-4 md:px-8">
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full h-10 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full text-base md:text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3"
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
                <span>Joining...</span>
              </div>
            ) : (
              "Join now"
            )}
          </Button>
        </div>
        {/* Share Link Option Only */}
        <div className="py-3 px-4 md:py-4 md:px-8 border-t border-gray-200">
          <Button
            className="w-full flex items-center gap-2 md:gap-3 h-9 md:h-10 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-purple-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-sm md:text-base"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            <span className="font-medium">
              {copySuccess ? "Copied!" : "Copy meeting link"}
            </span>
          </Button>
          <div className="mt-2 text-xs text-gray-400 break-all text-center">
            {meetingLink}
          </div>
        </div>
      </motion.div>

      {/* Mute/Unmute Notification */}
      {muteNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white px-6 py-2 rounded-xl shadow-lg text-lg font-semibold animate-slideInRightToLeft">
          {muteNotification}
        </div>
      )}

      {/* Modern Animated Alert */}
      {alert && (
        <div
          className={`fixed top-8 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-base font-semibold animate-slideInRightToLeft
            ${alert.type === 'error' ? 'bg-red-600 text-white' : alert.type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}
          style={{
            minWidth: '220px',
            maxWidth: '90vw',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s',
          }}
        >
          {alert.message}
        </div>
      )}
    </div>
  );
}

/* Add this to your global CSS (e.g., globals.css):
@keyframes slideInRightToLeft {
  0% {
    transform: translateX(120%);
    opacity: 0;
  }
  60% {
    transform: translateX(-10%);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slideInRightToLeft {
  animation: slideInRightToLeft 0.6s cubic-bezier(0.4,0,0.2,1);
}
*/
