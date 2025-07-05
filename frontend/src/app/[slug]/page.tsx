"use client";

import React, { useRef, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  MessageCircle,
  Users,
  PhoneOff,
  Settings,
  Send,
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import MeetingRoom from "@/components/MeetingRoom";
import VideoPreviewSection from "@/components/VideoPreviewSection";
import JoinMeetingCard from "@/components/JoinMeetingCard";
import { PeerVideo, Participant, ChatMessage, SignalData } from "@/types/meeting";

declare global {
  interface Window {
    localStream: MediaStream | null;
  }
}

export default function VideoMeeting() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" && !!localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, [])

  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const socketRef = useRef<null | ReturnType<typeof io>>(null);
  const socketIdRef = useRef<string | null>(null);
  const localvideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<PeerVideo[]>([]);
  const [audio, setAudio] = useState<MediaStream | undefined>();
  const [screen, setScreen] = useState<MediaStream | undefined>();
  const [showModel, setShowModel] = useState<boolean | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [newMessages, setNewMessages] = useState<number>(3);
  const [askForUsername, setAskForUsername] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [videos, setVideos] = useState<PeerVideo[]>([]);
  // dsf
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("Guest User");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [muteNotification, setMuteNotification] = useState<string>("");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  // Modern animated alert for screen sharing errors
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'info' | 'success' } | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const peerConfigConnections = {
    "iceServers": [
      { "urls": "stun:stun.l.google.com:19302" }
    ]
  }

  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const connections: { [key: string]: RTCPeerConnection } = {};

  const getDummyStream = () => new MediaStream([black(), silence()]);
  const stopAllTracks = (stream: MediaStream | null) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
  };

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });
      setLocalStream(stream);
      if (localvideoRef.current) {
        localvideoRef.current.srcObject = stream;
      }
    } catch (err) {
      // handle error
      setPermissionError("Permission denied. Please allow camera and microphone access in your browser settings to join the meeting.");
    }
  };


  const handleRemoteSDP = async (connection: RTCPeerConnection, signal: SignalData, fromId: string) => {
    try {
      await connection.setRemoteDescription(new RTCSessionDescription(signal.sdp!));
      if (signal.sdp?.type === 'offer') {
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        socketRef.current?.emit(
          'signal',
          fromId,
          JSON.stringify({ sdp: connection.localDescription })
        );
      }
    } catch (error) {
      console.error('Failed to handle remote SDP:', error);
    }
  };

  const handleRemoteICE = async (connection: RTCPeerConnection, signal: SignalData) => {
    try {
      await connection.addIceCandidate(new RTCIceCandidate(signal.ice!));
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
    }
  };

  const getMessageFromServer = (
    fromId: string,
    message: string
  ): void => {
    try {
      const signal: SignalData = JSON.parse(message);

      if (fromId !== socketIdRef.current) {
        const connection = connections[fromId];

        if (!connection) {
          console.warn(`No RTCPeerConnection found for: ${fromId}`);
          return;
        }

        if (signal.sdp) {
          handleRemoteSDP(connection, signal, fromId);
        }

        if (signal.ice) {
          handleRemoteICE(connection, signal);
        }
      }
    } catch (err) {
      console.error("Error parsing message or handling signal:", err);
    }
  };

  const addMessage = (
    data: string,
    sender: string,
    socketIdSender: string
  ): void => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message: data,
      timestamp: new Date(),
      isOwn: socketIdSender === socketIdRef.current,
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages: number) => prevNewMessages + 1);
    }
  };

  const silence = (): MediaStreamTrack => {
    const ctx = new AudioContext();
    const dst = ctx.createMediaStreamDestination();
    const oscillator = ctx.createOscillator();
    oscillator.connect(dst);
    oscillator.start();
    ctx.resume();
    const track = dst.stream.getAudioTracks()[0];
    track.enabled = false;
    return track;
  };
  
  const black = ({ width = 640, height = 480 } = {}): MediaStreamTrack => {
    const canvas = Object.assign(document.createElement("canvas"), { width, height });
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillRect(0, 0, width, height);
    }
    const stream = canvas.captureStream();
    const track = stream.getVideoTracks()[0];
    track.enabled = false;
    return track;
  };

  const connectToSocketServer = () => {
    socketRef.current = io(server_url, { secure: true });

    if (socketRef.current) {
      socketRef.current?.on("signal", getMessageFromServer);
      socketRef.current.on("connect", () => {
        socketRef.current?.emit("join-call", meetingLink);
        socketIdRef.current = socketRef.current?.id ?? null;
        socketRef.current?.on("chat-message", addMessage);
        socketRef.current?.on('disconnect', () => {
          console.warn('Disconnected from server');
          // Optionally show UI message or try to reconnect
        });
        socketRef.current?.on('reconnect', () => {
          console.info('Reconnected to server, rejoining meeting...');
          socketRef.current?.emit("join-call", meetingLink);
          // Optionally recreate peer connections if needed
          setAlert({ message: "Reconnected to meeting", type: "success" });
          setTimeout(() => setAlert(null), 3000);
        });
        socketRef.current?.on("user-left", (id) => {
          if (connections[id]) {
            connections[id].close();
            delete connections[id];
          }
          setVideos((videos) => videos.filter((video) => video.socketId != id));
          setParticipants((participants) => participants.filter((p) => p.socketId !== id));
          setAlert({ message: `User disconnected`, type: "info" });
        });

        socketRef.current?.on("user-joined", (id, clients) => {
          clients.forEach((peerSocketId: string) => {
            connections[peerSocketId] = new RTCPeerConnection(peerConfigConnections);
            connections[peerSocketId].onicecandidate = (event) => {
              if (event.candidate) {
                socketRef.current?.emit("signal", peerSocketId, JSON.stringify({ ice: event.candidate }));
              }
            };
            connections[peerSocketId].ontrack = (event: RTCTrackEvent) => {
              let videoExists = videoRef.current.find((video) => video?.socketId == peerSocketId);
              if (videoExists) {
                setVideos((videos) => {
                  const updatedVideos = videos.map((video) =>
                    video.socketId === peerSocketId
                      ? { ...video, stream: event.streams[0] }
                      : video
                  );
                  videoRef.current = updatedVideos;
                  return updatedVideos;
                });
              } else {
                const newVideo: PeerVideo = {
                  socketId: peerSocketId,
                  stream: event.streams[0],
                  autoPlay: true,
                  playsinline: true,
                  username: `User ${peerSocketId.slice(0, 4)}`,
                  isVideoEnabled: true,
                  isAudioEnabled: true,
                };
                setVideos((videos) => {
                  const updatedVideos = [...videos, newVideo];
                  videoRef.current = updatedVideos;
                  return updatedVideos;
                });
                
                // Add to participants
                setParticipants((participants) => [
                  ...participants,
                  {
                    socketId: peerSocketId,
                    username: `User ${peerSocketId.slice(0, 4)}`,
                    isVideoEnabled: true,
                    isAudioEnabled: true,
                  },
                ]);
              }
            };
            if (localStream) {
              localStream.getTracks().forEach((track) => {
                connections[peerSocketId].addTrack(track, localStream);
              });
              // Bandwidth optimization (optional)
              const sender = connections[peerSocketId].getSenders().find(s => s.track?.kind === 'video');
              if (sender?.setParameters) {
                const params = sender.getParameters();
                params.encodings = [{ maxBitrate: 500000 }];
                sender.setParameters(params);
              }
            } else {
              const dummy = getDummyStream();
              setLocalStream(dummy);
              dummy.getTracks().forEach((track) => {
                connections[peerSocketId].addTrack(track, dummy);
              });
            }
          });
          // Always create offer for each peer except self
          if (id === socketRef.current?.id) {
            for (let id2 in connections) {
              if (id2 === socketRef.current?.id) continue;
              if (localStream) {
                localStream.getTracks().forEach((track) => {
                  connections[id2].addTrack(track, localStream);
                });
              }
              connections[id2]
                .createOffer()
                .then((description) => connections[id2].setLocalDescription(description))
                .then(() => {
                  socketRef.current?.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.error("Offer error:", e));
            }
          }
        });
        
        // Add self to participants
        setParticipants([
          {
            socketId: socketRef.current?.id || '',
            username: userName,
            isVideoEnabled: isVideoEnabled,
            isAudioEnabled: isAudioEnabled,
          },
        ]);
      });
    }
  }

  useEffect(() => {
    setMeetingLink(window?.location?.href || "");
    return () => { socketRef.current?.disconnect(); };
  }, [slug, userName]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      connectToSocketServer(); 
      setAskForUsername(false);
      console.log("Joining meeting as:", userName);
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

 const handleAllowPermissions = async () => {
  setPermissionError(null);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    if (localvideoRef.current) {
      localvideoRef.current.srcObject = stream;
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
      setLocalStream(displayStream);
      if (localvideoRef.current) {
        localvideoRef.current.srcObject = displayStream;
      }
      setIsScreenSharing(true);
      displayStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        // Auto-restore camera/mic by triggering the useEffect
        setIsVideoEnabled(true);
        setIsAudioEnabled(true);
      };
    } catch (err) {
      setAlert({ message: "Screen sharing was cancelled or denied.", type: "error" });
      setTimeout(() => setAlert(null), 2500);
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled((prev) => {
      const newState = !prev;
      if (localvideoRef.current?.srcObject) {
        const stream = localvideoRef.current.srcObject as MediaStream;
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) videoTrack.enabled = newState;
      }
      // Update own participant status
      setParticipants((participants) =>
        participants.map((p) =>
          p.socketId === socketIdRef.current
            ? { ...p, isVideoEnabled: newState }
            : p
        )
      );
      return newState;
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => {
      const newState = !prev;
      if (localvideoRef.current?.srcObject) {
        const stream = localvideoRef.current.srcObject as MediaStream;
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = newState;
      }
      setMuteNotification(newState ? "Unmuted" : "Muted");
      setTimeout(() => setMuteNotification(""), 1200);
      // Update own participant status
      setParticipants((participants) =>
        participants.map((p) =>
          p.socketId === socketIdRef.current
            ? { ...p, isAudioEnabled: newState }
            : p
        )
      );
      return newState;
    });
  };

  const handleSendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("chat-message", message, userName, socketIdRef.current);
      // Add own message
      addMessage(message, userName, socketIdRef.current || '');
    }
  };

  const handleLeaveCall = () => {
    // Close all peer connections
    Object.values(connections).forEach((connection) => {
      connection.close();
    });
    
    // Stop local stream
    stopAllTracks(localStream);
    
    // Disconnect from socket
    socketRef.current?.disconnect();
    
    // Redirect or show leave confirmation
    setAskForUsername(true);
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

  // Load username from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem("username");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Save username to localStorage when it changes
  useEffect(() => {
    if (userName && userName !== "Guest User") {
      localStorage.setItem("username", userName);
    }
  }, [userName]);

  // Show meeting room if user has joined
  if (!askForUsername) {
    return (
      <MeetingRoom
        localStream={localStream}
        videos={videos}
        participants={participants}
        messages={messages}
        onSendMessage={handleSendMessage}
        onToggleVideo={toggleVideo}
        onToggleAudio={toggleAudio}
        onScreenShare={handleScreenShare}
        onLeaveCall={handleLeaveCall}
        isLocalVideoOn={isVideoEnabled}
        isLocalAudioOn={isAudioEnabled}
        isScreenSharing={isScreenSharing}
        userName={userName}
        meetingLink={meetingLink}
      />
    );
  }

  return (
    <div>
      <div className="mt-5 md:mt-0 flex flex-col lg:flex-row overflow-hidden justify-center items-center min-h-screen px-4 md:px-8  gap-2  lg:gap-10">
        {/* Left Side - Video Preview */}
        <VideoPreviewSection
          localVideoRef={localvideoRef}
          isVideoEnabled={isVideoEnabled}
          isAudioEnabled={isAudioEnabled}
          isScreenSharing={isScreenSharing}
          userName={userName}
          showPermissionDialog={showPermissionDialog}
          permissionError={permissionError}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onScreenShare={handleScreenShare}
          onAllowPermissions={handleAllowPermissions}
        />
        
        {/* Right Side - Meeting Controls */}
        <JoinMeetingCard
          participants={participants}
          userName={userName}
          isEditingName={isEditingName}
          isConnecting={isConnecting}
          copySuccess={copySuccess}
          meetingLink={meetingLink}
          onUserNameChange={setUserName}
          onToggleEditName={() => setIsEditingName(true)}
          onNameSubmit={handleNameSubmit}
          onConnect={handleConnect}
          onCopyLink={handleCopyLink}
        />

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
    </div>
  );
}