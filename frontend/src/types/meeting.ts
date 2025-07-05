export interface PeerVideo {
  socketId: string;
  stream: MediaStream;
  autoPlay: boolean;
  playsinline: boolean;
  username?: string;
  isVideoEnabled?: boolean;
  isAudioEnabled?: boolean;
}

export interface Participant {
  socketId: string;
  username: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
}

export interface MeetingRoomProps {
  localStream: MediaStream | null;
  videos: PeerVideo[];
  participants: Participant[];
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onScreenShare: () => void;
  onLeaveCall: () => void;
  isLocalVideoOn: boolean;
  isLocalAudioOn: boolean;
  isScreenSharing: boolean;
  userName: string;
  meetingLink: string;
}

export type SignalData = {
  sdp?: RTCSessionDescriptionInit;
  ice?: RTCIceCandidateInit;
}; 