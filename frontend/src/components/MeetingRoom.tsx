"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  Settings,
  MoreVertical,
  Smile,
  Paperclip,
  Phone,
  CheckCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MeetingRoomProps, PeerVideo, Message } from "@/types/meeting";

const MeetingRoom = ({
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
}: MeetingRoomProps) => {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
  const [isTyping, setIsTyping] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [meetingDuration, setMeetingDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setMeetingDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (localVideoRef.current) {
      if (isLocalVideoOn) {
        localVideoRef.current.play().catch(() => {});
      } else {
        localVideoRef.current.pause();
      }
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!showChat && messages.length > 0) {
      setUnreadMessages(prev => prev + 1);
    } else {
      setUnreadMessages(0);
    }
  }, [messages, showChat]);

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();

  const getGridLayout = () => {
    const total = videos.length + 1;
    if (total <= 2) return "grid-cols-1 md:grid-cols-2";
    if (total <= 4) return "grid-cols-2";
    if (total <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      onSendMessage(chatMessage.trim());
      setChatMessage('');
      setIsTyping(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const formatMessageTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden ">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      <div className="flex h-screen pt-20 overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 p-6 overflow-hidden">
            <div className={`grid ${getGridLayout()} gap-4 h-full`}>
              {/* Local Video */}
              <motion.div 
                className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl ring-1 ring-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${isLocalVideoOn ? "" : "hidden"}`}
                />
                {!isLocalVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {getUserInitials(userName)}
                        </span>
                      </div>
                      <p className="text-white font-medium">{userName}</p>
                      <p className="text-gray-400 text-sm mt-1">You</p>
                    </div>
                  </div>
                )}
                
                {/* Video Controls Overlay */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLocalAudioOn ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {isLocalAudioOn ? (
                      <Mic className="h-4 w-4 text-green-400" />
                    ) : (
                      <MicOff className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>
                
                {/* Name Tag */}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                  <span className="text-sm font-medium text-white">{userName} (You)</span>
                </div>
              </motion.div>

              {/* Remote Videos */}
              {videos.map((video, index) => (
                <motion.div
                  key={video.socketId}
                  className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl ring-1 ring-white/10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <video
                    ref={(el) => {
                      if (el) remoteVideoRefs.current[video.socketId] = el;
                    }}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover ${video.isVideoEnabled ? "" : "hidden"}`}
                  />
                  {!video.isVideoEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <span className="text-2xl font-bold text-white">
                            {getUserInitials(video.username || `User ${index + 1}`)}
                          </span>
                        </div>
                        <p className="text-white font-medium">
                          {video.username || `User ${index + 1}`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${video.isAudioEnabled ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {video.isAudioEnabled ? (
                        <Mic className="h-4 w-4 text-green-400" />
                      ) : (
                        <MicOff className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Name Tag */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                    <span className="text-sm font-medium text-white">
                      {video.username || `User ${index + 1}`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Control Bar */}
          <div className="h-20 bg-black/40 backdrop-blur-xl border-t border-white/10 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(meetingLink)}
                className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <div className="text-sm text-gray-400">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {/* Main Controls */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={onToggleAudio}
                className={`w-12 h-12 rounded-full transition-all duration-200 ${
                  isLocalAudioOn 
                    ? "bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm" 
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isLocalAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={onToggleVideo}
                className={`w-12 h-12 rounded-full transition-all duration-200 ${
                  isLocalVideoOn 
                    ? "bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm" 
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isLocalVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={onScreenShare}
                className={`w-12 h-12 rounded-full transition-all duration-200 ${
                  isScreenSharing 
                    ? "bg-blue-500 hover:bg-blue-600" 
                    : "bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm"
                }`}
              >
                <Monitor className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={onLeaveCall} 
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Secondary Controls */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowChat(!showChat)}
                className="w-12 h-12 rounded-full bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm transition-all duration-200 relative"
              >
                <MessageCircle className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Button>
              
              <Button
                onClick={() => setShowParticipants(!showParticipants)}
                className="w-12 h-12 rounded-full bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm transition-all duration-200"
              >
                <Users className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              className="w-96 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl"
              initial={{ x: 384 }}
              animate={{ x: 0 }}
              exit={{ x: 384 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Chat Header */}
              <div className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Chat</h3>
                    <p className="text-xs text-gray-400">
                      {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Messages Container */}
                <div 
                  ref={chatContainerRef} 
                  className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                  style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255,255,255,0.2) transparent'
                  }}
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <MessageCircle className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-gray-300 font-medium">No messages yet</p>
                      <p className="text-gray-500 text-sm mt-2">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className={`max-w-xs ${message.isOwn ? 'order-2' : 'order-1'}`}>
                          {!message.isOwn && (
                            <div className="flex items-center space-x-2 mb-1 ml-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {getUserInitials(message.sender)}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400 font-medium">
                                {message.sender}
                              </span>
                            </div>
                          )}
                          
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
                              message.isOwn
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md ml-4'
                                : 'bg-gray-800/80 text-gray-200 rounded-bl-md mr-4 border border-white/10'
                            }`}
                          >
                            <div className="text-sm leading-relaxed break-words">
                              {message.message}
                            </div>
                          </div>
                          
                          <div className={`text-xs text-gray-500 mt-1 ${message.isOwn ? 'text-right mr-2' : 'text-left ml-2'}`}>
                            {formatMessageTime(message.timestamp)}
                            {message.isOwn && (
                              <CheckCircle className="inline h-3 w-3 ml-1 text-green-400" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-white/10 bg-gray-800/50">
                  <div className="flex flex-col space-y-3">
                    <div className="flex space-x-3">
                      <div className="flex-1 relative">
                        <input
                          ref={chatInputRef}
                          type="text"
                          value={chatMessage}
                          onChange={handleInputChange}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="Type your message..."
                          maxLength={500}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm backdrop-blur-sm"
                        />
                        {isTyping && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={handleSendMessage}
                        disabled={!chatMessage.trim()}
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Press Enter to send</span>
                      <span className={`${chatMessage.length > 450 ? 'text-red-400' : ''}`}>
                        {chatMessage.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participants Panel */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              className="w-80 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                <div>
                  <h3 className="text-lg font-semibold text-white">Participants</h3>
                  <p className="text-xs text-gray-400">
                    {participants.length} participant{participants.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="text-gray-400 duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {participants.map((participant, index) => (
                  <div 
                    key={participant.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 border border-white/10"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {getUserInitials(participant.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{participant.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${participant.isVideoEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-gray-400">
                          {participant.isVideoEnabled ? 'Video on' : 'Video off'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MeetingRoom;