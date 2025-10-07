import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

const AccountSettings = () => {
  const currentUser = auth().currentUser;

  const handleChangeNumber = () => {
    Alert.alert(
      'Change Phone Number',
      'This feature will be implemented to allow users to change their phone number.',
      [{ text: 'OK' }],
    );
  };

  const handleChangeEmail = () => {
    Alert.alert(
      'Change Email',
      'This feature will be implemented to allow users to change their email address.',
      [{ text: 'OK' }],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await currentUser?.delete();
              Alert.alert('Account Deleted', 'Your account has been deleted.');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert(
                'Error',
                'Failed to delete account. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const accountOptions = [
    {
      id: 1,
      title: 'Change Number',
      subtitle: currentUser?.phoneNumber || 'Add phone number',
      icon: 'call-outline',
      onPress: handleChangeNumber,
    },
    {
      id: 2,
      title: 'Change Email',
      subtitle: currentUser?.email || 'Add email address',
      icon: 'mail-outline',
      onPress: handleChangeEmail,
    },
    {
      id: 3,
      title: 'Two-Step Verification',
      subtitle: 'Add an extra layer of security',
      icon: 'shield-checkmark-outline',
      onPress: () => Alert.alert('Coming Soon', '2FA will be implemented soon'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          {accountOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <Ionicons name={option.icon} size={24} color="#007AFF" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={[styles.optionItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, styles.dangerText]}>
                Delete Account
              </Text>
              <Text style={styles.optionSubtitle}>
                Permanently delete your account and all data
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 1,
    borderRadius: 12,
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  dangerText: {
    color: '#FF3B30',
  },
});

export default AccountSettings;
