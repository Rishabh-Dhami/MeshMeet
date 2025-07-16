export interface Message {
  id: string;
  sender: string;
  message: string;
  timestamp: number;
  isOwn: boolean;
  type?: 'text' | 'system';
}

export interface ChatMessage extends Message {}

export interface SignalData {
  sdp?: RTCSessionDescription;
  ice?: RTCIceCandidate;
}

export interface PeerVideo {
  socketId: string;
  stream: MediaStream;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  username?: string;
}

export interface Participant {
  id: string;
  name: string;
  socketId?: string;
  username?: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  joinedAt: number;
}

export interface MeetingRoomProps {
  localStream: MediaStream | null;
  videos: PeerVideo[];
  participants: Participant[];
  messages: Message[];
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