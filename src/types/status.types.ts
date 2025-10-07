import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type StatusType = 'text' | 'image' | 'video';
export type StatusPrivacy = 'all' | 'contacts' | 'except' | 'only';

export interface StatusContent {
  mediaUrl?: string;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface StatusDocument {
  statusId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  type: StatusType;
  content: StatusContent;
  privacy: StatusPrivacy;
  allowedUsers: string[];
  blockedUsers: string[];
  views: { [userId: string]: FirebaseFirestoreTypes.Timestamp };
  viewCount: number;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  expiresAt: Date;
}

export interface StatusViewer {
  viewerId: string;
  viewerName: string;
  viewerPhotoURL?: string;
  statusId: string;
  viewedAt: FirebaseFirestoreTypes.Timestamp;
}

export interface CreateStatusData {
  type: StatusType;
  mediaUrl?: string;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  privacy?: StatusPrivacy;
  allowedUsers?: string[];
  blockedUsers?: string[];
}
