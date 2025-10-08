import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import storage from '@react-native-firebase/storage';
import { createSampleStatuses } from '@/src/utils/testStatusData';

const ProfileSettings = () => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const currentUser = auth().currentUser;

  console.log('Current User:', currentUser);

  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    loadUserData();
    const users = async function () {
      return await firestore().collection('users').get();
    };

    const allUseres = users();

    allUseres.then(querySnapshot => {
      console.log('users', querySnapshot);
    });
  }, []);

  // Import at the top of ProfileSettings.tsx

  // Add this function inside your ProfileSettings component
  const testCreateStatus = async () => {
    try {
      await createSampleStatuses();
      Alert.alert('Success', 'Status collections created in Firestore!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create status collections');
      console.log('Error creating status collections:', error);
    }
  };

  // Add this button in your render method (after the debug section)

  const loadUserData = async () => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setProfileImage(currentUser.photoURL);

      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();

        console.log('User Document:', userDoc.data());

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBio(userData?.bio || '');
          if (userData?.photoURL && !currentUser.photoURL) {
            setProfileImage(userData.photoURL);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  };

  const saveProfile = async () => {
    if (!currentUser) return;

    try {
      // Update display name in Firebase Auth
      await currentUser.updateProfile({
        displayName: displayName,
        ...(profileImage && { photoURL: profileImage }),
      });

      // Update user data in Firestore
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .set(
          {
            displayName,
            bio,
            ...(profileImage && { photoURL: profileImage }),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const selectProfileImage = () => {
    // Debug: Check initial conditions
    console.log('=== STARTING IMAGE SELECTION ===');
    console.log('Current user exists:', !!currentUser);
    console.log('Current user UID:', currentUser?.uid);
    console.log('Storage app initialized:', !!storage().app);
    console.log('Storage bucket:', storage().app.options.storageBucket);

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: false,
      },
      async response => {
        console.log('=== IMAGE LIBRARY RESPONSE ===');
        console.log('Response:', JSON.stringify(response, null, 2));

        if (response.didCancel) {
          console.log('User cancelled image selection');
          return;
        }

        if (response.errorCode) {
          console.log('Image library error:', response.errorMessage);
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to select image',
          );
          return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) {
          console.log('No asset URI found in response');
          Alert.alert('Error', 'No image was selected');
          return;
        }

        console.log('=== SELECTED IMAGE DETAILS ===');
        console.log('Asset URI:', asset.uri);
        console.log('Asset size:', asset.fileSize);
        console.log('Asset type:', asset.type);
        console.log('Asset width:', asset.width);
        console.log('Asset height:', asset.height);

        setIsUploading(true);
        setUploadProgress(0);

        try {
          // Verify user authentication before upload
          if (!currentUser) {
            throw new Error('User not authenticated');
          }

          // Check if user is still authenticated
          await auth().currentUser?.getIdToken(true);
          console.log('✅ User authentication verified');

          const fileName = `profile_${currentUser.uid}_${Date.now()}.jpg`;

          console.log('=== FIREBASE STORAGE SETUP ===');
          console.log(
            'Storage bucket name:',
            storage().app.options.storageBucket,
          );
          console.log('File name:', fileName);

          // Create storage reference
          const reference = storage().ref(`profileImages/${fileName}`);
          console.log('Storage reference path:', reference.fullPath);
          console.log('Storage reference name:', reference.name);

          // Handle different URI formats for iOS/Android
          let fileUri = asset.uri;
          if (Platform.OS === 'ios' && fileUri.startsWith('ph://')) {
            console.log('iOS photo library URI detected, using as-is');
          } else if (Platform.OS === 'ios' && !fileUri.startsWith('file://')) {
            fileUri = `file://${fileUri}`;
            console.log('Modified iOS file URI:', fileUri);
          }

          console.log('=== STARTING UPLOAD ===');
          console.log('Final upload URI:', fileUri);

          // Start the upload
          const uploadTask = reference.putFile(fileUri, {
            contentType: asset.type || 'image/jpeg',
          });

          // Monitor upload progress
          uploadTask.on(
            'state_changed',
            snapshot => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              );
              console.log(`Upload progress: ${progress}%`);
              console.log(
                `Bytes: ${snapshot.bytesTransferred}/${snapshot.totalBytes}`,
              );
              setUploadProgress(progress);
            },
            error => {
              console.log('=== UPLOAD ERROR ===');
              console.error('Upload error code:', error.code);
              console.error('Upload error message:', error.message);
              console.error('Upload error details:', error);

              setIsUploading(false);
              setUploadProgress(0);

              // Show specific error messages
              let errorMessage = 'Failed to upload image. Please try again.';
              if (error.code === 'storage/unauthorized') {
                errorMessage =
                  'Upload permission denied. Please check your account settings.';
              } else if (error.code === 'storage/canceled') {
                errorMessage = 'Upload was cancelled.';
              } else if (error.code === 'storage/unknown') {
                errorMessage = 'An unknown error occurred during upload.';
              }

              Alert.alert('Upload Error', errorMessage);
            },
            async () => {
              // Upload completed successfully
              console.log('=== UPLOAD COMPLETED ===');

              try {
                const downloadURL = await reference.getDownloadURL();
                console.log('✅ Download URL obtained:', downloadURL);

                setProfileImage(downloadURL);
                setIsUploading(false);
                setUploadProgress(0);

                // Auto-save if not in editing mode
                if (!isEditing) {
                  console.log('Auto-saving profile image...');

                  await currentUser.updateProfile({ photoURL: downloadURL });
                  console.log('✅ Auth profile updated');

                  await firestore()
                    .collection('users')
                    .doc(currentUser.uid)
                    .set({ photoURL: downloadURL }, { merge: true });
                  console.log('✅ Firestore document updated');

                  Alert.alert('Success', 'Profile photo updated successfully');
                } else {
                  console.log('Image uploaded, waiting for manual save...');
                }
              } catch (error) {
                console.log('=== ERROR GETTING DOWNLOAD URL ===');
                console.error('Download URL error:', error);
                setIsUploading(false);
                setUploadProgress(0);
                Alert.alert('Error', 'Failed to get image URL');
              }
            },
          );
        } catch (error) {
          console.log('=== UPLOAD INITIALIZATION ERROR ===');
          console.error('Initialization error:', error);
          setIsUploading(false);
          setUploadProgress(0);
          Alert.alert(
            'Upload Error',
            `Failed to start upload: ${error.message}`,
          );
        }
      },
    );
  };

  const checkFirebaseConfig = () => {
    console.log('🔧 Firebase Config Debug:');
    console.log('App name:', firestore().app.name);
    console.log('Project ID:', firestore().app.options.projectId);
    console.log('Database URL:', firestore().app.options.databaseURL);
    console.log('Storage bucket:', storage().app.options.storageBucket);
    console.log('Auth domain:', firestore().app.options.authDomain);

    Alert.alert(
      'Firebase Config',
      `Project: ${firestore().app.options.projectId}\nApp: ${
        firestore().app.name
      }`,
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottom + 100 }}
    >
      <TouchableOpacity
        onPress={testCreateStatus}
        style={[styles.button, styles.editButton]}
      >
        <Text style={styles.editButtonText}>🧪 Create Test Status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={checkFirebaseConfig}
        style={[styles.button, styles.editButton]}
      >
        <Text style={styles.editButtonText}>⚙️ Check Config</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={selectProfileImage} disabled={isUploading}>
            <View style={styles.photoContainer}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profilePhoto}
                  onError={error => {
                    console.log(
                      'Image loading error:',
                      error.nativeEvent.error,
                    );
                  }}
                />
              ) : (
                <View style={styles.profilePhotoPlaceholder}>
                  <Text style={styles.profilePhotoText}>
                    {displayName.charAt(0) || 'U'}
                  </Text>
                </View>
              )}

              <View style={styles.cameraIcon}>
                {isUploading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                )}
              </View>

              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.uploadProgressText}>
                    {uploadProgress}%
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>
            {isUploading
              ? `Uploading... ${uploadProgress}%`
              : 'Tap to change photo'}
          </Text>
        </View>

        {/* Profile Info Section */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, isEditing && styles.inputEditing]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your name"
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[
                styles.input,
                styles.bioInput,
                isEditing && styles.inputEditing,
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Add a bio..."
              multiline
              numberOfLines={3}
              editable={isEditing}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={currentUser?.phoneNumber || ''}
              placeholder="Phone number"
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={currentUser?.email || ''}
              placeholder="Email address"
              editable={false}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          {isEditing ? (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  loadUserData();
                }}
                disabled={isUploading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={saveProfile}
                disabled={isUploading}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
              disabled={isUploading}
            >
              <Ionicons name="create-outline" size={20} color="#007AFF" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Debug Info (remove in production) */}
        {__DEV__ && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>User ID: {currentUser?.uid}</Text>
            <Text style={styles.debugText}>
              Storage Bucket: {storage().app.options.storageBucket}
            </Text>
            <Text style={styles.debugText}>
              Profile Image: {profileImage ? 'Set' : 'Not set'}
            </Text>
            <Text style={styles.debugText}>
              Upload Status: {isUploading ? 'Uploading' : 'Ready'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '600',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadProgressText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  changePhotoText: {
    fontSize: 15,
    color: '#007AFF',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    fontSize: 17,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    color: '#000000',
  },
  inputEditing: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonSection: {
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF3B30',
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 17,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  debugSection: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
});

export default ProfileSettings;
