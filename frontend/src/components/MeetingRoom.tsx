"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  MessageCircle,
  Users,
  Copy,
  Send,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MeetingRoomProps, PeerVideo } from "@/types/meeting";

const MeetingRoom: React.FC<MeetingRoomProps> = ({
  localStream,
  videos,
  participants,
  messages,
  onSendMessage,
  onToggleVideo,
  onToggleAudio,
  onScreenShare,
  onLeaveCall,
  isLocalVideoOn,
  isLocalAudioOn,
  isScreenSharing,
  userName,
  meetingLink,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (localVideoRef.current) {
      isLocalVideoOn ? localVideoRef.current.play().catch(() => {}) : localVideoRef.current.pause();
    }
  }, [isLocalVideoOn]);

  useEffect(() => {
    videos.forEach((video: PeerVideo) => {
      const videoElement = remoteVideoRefs.current[video.socketId];
      if (videoElement && video.stream) {
        videoElement.srcObject = video.stream;
      }
    });
  }, [videos]);

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();

  const getGridLayout = () => {
    const totalVideos = videos.length + 1;
    if (totalVideos <= 2) return "grid-cols-1 md:grid-cols-2";
    if (totalVideos <= 4) return "grid-cols-2";
    if (totalVideos <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      onSendMessage(chatMessage);
      setChatMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex h-screen pt-20">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-hidden">
            <div className={`grid ${getGridLayout()} gap-4 h-full`}>
              {/* Local Video */}
              <motion.div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${isLocalVideoOn ? "" : "hidden"}`}
                />
                {!isLocalVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl font-semibold text-white">
                          {getUserInitials(userName)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm font-medium">{userName}</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Remote Videos */}
              {videos.map((video: PeerVideo, index: number) => (
                <motion.div key={video.socketId} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={(el) => {
                      if (el) remoteVideoRefs.current[video.socketId] = el;
                    }}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${video.isVideoEnabled ? "" : "hidden"}`}
                  />
                  {!video.isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-semibold text-white">
                            {getUserInitials(video.username || `User ${index + 1}`)}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm font-medium">
                          {video.username || `User ${index + 1}`}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="h-20 bg-gray-800 border-t border-gray-700 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{currentTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={onToggleAudio} className={`p-3 rounded-full ${isLocalAudioOn ? "bg-gray-700" : "bg-red-500"}`}>
                {isLocalAudioOn ? <Mic /> : <MicOff />}
              </Button>
              <Button onClick={onToggleVideo} className={`p-3 rounded-full ${isLocalVideoOn ? "bg-gray-700" : "bg-red-500"}`}>
                {isLocalVideoOn ? <Video /> : <VideoOff />}
              </Button>
              <Button onClick={onScreenShare} className={`p-3 rounded-full ${isScreenSharing ? "bg-green-500" : "bg-gray-700"}`}>
                <Monitor />
              </Button>
              <Button onClick={onLeaveCall} className="p-3 rounded-full bg-red-500">
                <PhoneOff />
              </Button>
              <Button onClick={() => setShowChat((v) => !v)} className="p-3 rounded-full bg-gray-700">
                <MessageCircle />
              </Button>
              <Button onClick={() => setShowParticipants((v) => !v)} className="p-3 rounded-full bg-gray-700">
                <Users />
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(meetingLink)} className="text-gray-400 hover:text-white">
              <Copy className="h-4 w-4 mr-2" /> Copy Link
            </Button>
          </div>
        </div>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col" initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}>
              <div className="h-16 px-4 flex items-center justify-between border-b border-gray-700">
                <h3 className="text-lg font-semibold">Chat</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                  <X />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs px-4 py-3 rounded-xl shadow ${
                          msg.isOwn ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white" : "bg-gray-700 text-gray-100"
                        }`}
                      >
                        {!msg.isOwn && (
                          <p className="text-xs font-medium text-gray-400 mb-1">{msg.sender}</p>
                        )}
                        <p className="text-sm leading-snug">{msg.message}</p>
                        <p className="text-xs text-gray-400 mt-1 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <Button
                    type="submit"
                    disabled={!chatMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participants Sidebar */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col" initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}>
              <div className="h-16 px-4 flex items-center justify-between border-b border-gray-700">
                <h3 className="text-lg font-semibold">Participants ({participants.length})</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">
                  <X />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MeetingRoom;
