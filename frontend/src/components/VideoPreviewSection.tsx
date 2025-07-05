"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPreviewSectionProps {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  userName: string;
  showPermissionDialog: boolean;
  permissionError: string | null;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onAllowPermissions: () => void;
}

const VideoPreviewSection: React.FC<VideoPreviewSectionProps> = ({
  localVideoRef,
  isVideoEnabled,
  isAudioEnabled,
  isScreenSharing,
  userName,
  showPermissionDialog,
  permissionError,
  onToggleAudio,
  onToggleVideo,
  onScreenShare,
  onAllowPermissions,
}) => {
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.div
      className="w-full lg:w-[64%] flex items-center justify-center mt-6 md:mt-15"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative w-full lg:max-w-3xl">
        {/* Video Container */}
        <div className="w-full relative aspect-video bg-gray-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl transition-all duration-300 h-[320px] md:h-[400px] lg:h-[440px]">
          {/* Video always mounted */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Overlay initials (NO opacity change on video) */}
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-5 lg:mb-6">
                <span className="text-lg md:text-2xl lg:text-3xl font-semibold text-white">
                  {getUserInitials(userName)}
                </span>
              </div>
              <p className="text-gray-300 text-base md:text-xl lg:text-2xl font-medium">
                {userName}
              </p>
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
                  autoFocus
                  onClick={onAllowPermissions}
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
              onClick={onToggleAudio}
              className="py-3 px-3 bg-red-500 rounded-full"
              aria-label={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {isAudioEnabled ? (
                <Mic className="h-5 w-5 text-white" />
              ) : (
                <MicOff className="h-5 w-5 text-white" />
              )}
            </button>
            <button
              onClick={onToggleVideo}
              className="py-3 px-3 bg-red-500 rounded-full"
              aria-label={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {isVideoEnabled ? (
                <Video className="h-5 w-5 text-white" />
              ) : (
                <VideoOff className="h-5 w-5 text-white" />
              )}
            </button>
            <button
              className={`py-3 px-3 rounded-full ${
                isScreenSharing ? "bg-blue-500" : "bg-red-500"
              }`}
              aria-label={isScreenSharing ? "Stop screen sharing" : "Start screen sharing"}
              onClick={onScreenShare}
            >
              <Monitor className="h-5 w-5 text-white" />
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
  );
};

export default VideoPreviewSection;
