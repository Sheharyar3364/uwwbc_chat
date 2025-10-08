import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {
  StatusDocument,
  CreateStatusData,
  StatusViewer,
} from '../types/status.types';

export class StatusManager {
  // 1. CREATE A STATUS - FIXED VERSION
  static async createStatus(statusData: CreateStatusData): Promise<string> {
    const currentUser = auth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const statusId = firestore().collection('statuses').doc().id;

      // Build the document object, only including fields that are not undefined
      const statusDoc: any = {
        statusId: statusId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Unknown User',
        type: statusData.type,
        content: {
          text: statusData.text || '',
          backgroundColor: statusData.backgroundColor || '#000000',
          textColor: statusData.textColor || '#FFFFFF',
        },
        privacy: statusData.privacy || 'contacts',
        allowedUsers: statusData.allowedUsers || [],
        blockedUsers: statusData.blockedUsers || [],
        views: {},
        viewCount: 0,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add optional fields if they exist
      if (currentUser.photoURL) {
        statusDoc.userPhotoURL = currentUser.photoURL;
      }

      if (statusData.mediaUrl) {
        statusDoc.content.mediaUrl = statusData.mediaUrl;
      }

      await firestore().collection('statuses').doc(statusId).set(statusDoc);

      console.log('✅ Status created:', statusId);
      return statusId;
    } catch (error) {
      console.error('❌ Error creating status:', error);
      throw error;
    }
  }

  // 2. VIEW A STATUS - FIXED VERSION
  static async viewStatus(
    statusId: string,
    statusOwnerId: string,
  ): Promise<void> {
    const currentUser = auth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    try {
      // Update views in main status document
      await firestore()
        .collection('statuses')
        .doc(statusId)
        .update({
          [`views.${currentUser.uid}`]: firestore.FieldValue.serverTimestamp(),
          viewCount: firestore.FieldValue.increment(1),
        });

      // Build viewer data
      const viewerData: any = {
        viewerId: currentUser.uid,
        viewerName: currentUser.displayName || 'Unknown User',
        statusId: statusId,
        viewedAt: firestore.FieldValue.serverTimestamp(),
      };

      // Only add photo URL if it exists
      if (currentUser.photoURL) {
        viewerData.viewerPhotoURL = currentUser.photoURL;
      }

      await firestore()
        .collection('users')
        .doc(statusOwnerId)
        .collection('statusViewers')
        .doc(currentUser.uid)
        .set(viewerData, { merge: true });

      console.log('✅ Status viewed successfully');
    } catch (error) {
      console.error('❌ Error viewing status:', error);
      throw error;
    }
  }

  // 3. GET USER'S OWN STATUSES - NO INDEX REQUIRED
  static async getUserStatuses(userId?: string): Promise<StatusDocument[]> {
    const currentUser = auth().currentUser;
    const targetUserId = userId || currentUser?.uid;

    if (!targetUserId) throw new Error('User ID required');

    try {
      // Simple query - only filter by userId, no complex ordering
      const snapshot = await firestore()
        .collection('statuses')
        .where('userId', '==', targetUserId)
        .get();

      // Filter and sort on the client side
      const now = new Date();
      const statuses = snapshot.docs
        .map(doc => ({ ...doc.data() } as StatusDocument))
        .filter(status => {
          // Filter out expired statuses
          const expiresAt = status.expiresAt;
          if (expiresAt instanceof Date) {
            return expiresAt > now;
          }
          if (expiresAt && expiresAt.toDate) {
            return expiresAt.toDate() > now;
          }
          return true; // Keep if no expiry date
        })
        .sort((a, b) => {
          // Sort by createdAt descending (newest first)
          const aTime = a.createdAt?.toDate?.() || new Date();
          const bTime = b.createdAt?.toDate?.() || new Date();
          return bTime.getTime() - aTime.getTime();
        });

      return statuses;
    } catch (error) {
      console.error('❌ Error getting user statuses:', error);
      throw error;
    }
  }

  // 4. GET CONTACTS' STATUSES
  static async getContactsStatuses(): Promise<StatusDocument[]> {
    const currentUser = auth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    try {
      // First get user's contacts
      const contactsSnapshot = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('contacts')
        .get();

      const contactIds = contactsSnapshot.docs.map(doc => doc.id);

      if (contactIds.length === 0) {
        return [];
      }

      // Get statuses from contacts (Firestore 'in' query limit is 10)
      const statusesSnapshot = await firestore()
        .collection('statuses')
        .where('userId', 'in', contactIds.slice(0, 10))
        .where('expiresAt', '>', new Date())
        .orderBy('createdAt', 'desc')
        .get();

      return statusesSnapshot.docs.map(
        doc =>
          ({
            ...doc.data(),
          } as StatusDocument),
      );
    } catch (error) {
      console.error('❌ Error getting contacts statuses:', error);
      throw error;
    }
  }

  // 5. UPLOAD STATUS MEDIA
  static async uploadStatusMedia(
    uri: string,
    type: 'image' | 'video',
  ): Promise<string> {
    const currentUser = auth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const fileName = `status_${currentUser.uid}_${Date.now()}.${
        type === 'image' ? 'jpg' : 'mp4'
      }`;
      const reference = storage().ref(`statusMedia/${fileName}`);

      await reference.putFile(uri);
      const downloadURL = await reference.getDownloadURL();

      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading status media:', error);
      throw error;
    }
  }

  // 6. DELETE STATUS
  static async deleteStatus(statusId: string): Promise<void> {
    const currentUser = auth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    try {
      await firestore().collection('statuses').doc(statusId).delete();

      console.log('✅ Status deleted:', statusId);
    } catch (error) {
      console.error('❌ Error deleting status:', error);
      throw error;
    }
  }
}
