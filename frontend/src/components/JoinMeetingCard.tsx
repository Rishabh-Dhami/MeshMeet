"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Edit3, Copy } from "lucide-react";

interface JoinMeetingCardProps {
  participants: any[];
  userName: string;
  isEditingName: boolean;
  isConnecting: boolean;
  copySuccess: boolean;
  meetingLink: string;
  onUserNameChange: (name: string) => void;
  onToggleEditName: () => void;
  onNameSubmit: (e: React.FormEvent) => void;
  onConnect: () => void;
  onCopyLink: () => void;
}

const JoinMeetingCard: React.FC<JoinMeetingCardProps> = ({
  participants,
  userName,
  isEditingName,
  isConnecting,
  copySuccess,
  meetingLink,
  onUserNameChange,
  onToggleEditName,
  onNameSubmit,
  onConnect,
  onCopyLink,
}) => {
  return (
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border-green-200">
            <Clock className="h-4 w-4 mr-1" />Ready
          </span>
        </div>
        <p className="text-xs md:text-md">
          {participants.length > 1
            ? `${participants.length - 1} other${participants.length - 1 > 1 ? "s" : ""
            } in the meeting`
            : "No one else is here"}
        </p>
      </div>
      
      {/* User Name Section */}
      <div className="py-3 px-4 md:py-4 md:px-8 border-b border-gray-200">
        <label className="text-xs md:text-sm font-medium mb-2 md:mb-3 block" htmlFor="username-input">
          Your name
        </label>
        <div className="flex items-center space-x-2 md:space-x-3">
          {isEditingName ? (
            <form onSubmit={onNameSubmit} className="flex-1 flex space-x-2">
              <input
                id="username-input"
                type="text"
                value={userName}
                onChange={(e) => onUserNameChange(e.target.value)}
                className="flex-1 h-9 md:h-12 text-base md:text-lg border border-gray-300 rounded-lg px-3 md:px-4 py-1 md:py-2 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all duration-200"
                autoFocus
                aria-label="Enter your name"
              />
              <Button
                type="submit"
                className="h-9 md:h-12 px-4 md:px-6 text-sm md:text-base"
                aria-label="Save username"
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
                onClick={onToggleEditName}
                className="h-9 w-9 md:h-12 md:w-12 p-0"
                aria-label="Edit username"
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
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full h-10 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full text-base md:text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3"
          aria-label={isConnecting ? "Joining meeting..." : "Join meeting"}
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
          onClick={onCopyLink}
          aria-label={copySuccess ? "Meeting link copied" : "Copy meeting link"}
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
  );
};

export default JoinMeetingCard; 