import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import { StatusManager } from '@/src/utils/statusUtils';
import { StatusDocument } from '@/src/types/status.types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { typography } from '../constants/Typography';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/global';

export default function Status() {
  const [myStatuses, setMyStatuses] = useState<StatusDocument[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const currentUser = auth().currentUser;

  const loadMyStatuses = async () => {
    if (!currentUser) return;

    setLoadingStatuses(true);
    setStatusError(null);

    try {
      console.log('📱 Auto-loading my statuses...');
      const statuses = await StatusManager.getUserStatuses();

      setMyStatuses(statuses);
    } catch (error: unknown) {
      console.error('❌ Error loading my statuses:', error);
      if (error instanceof Error) {
        setStatusError(error.message);
      } else {
        setStatusError(String(error));
      }
    } finally {
      setLoadingStatuses(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('🔁 Screen focused — reloading statuses...');
      loadMyStatuses();
    }, []),
  );

  function handleIndividualStatusPress(status: StatusDocument) {
    console.log('status', status);
  }

  function handleOwnStatusPress() {
    navigation.navigate('ViewOwnStatus', {
      statuses: myStatuses,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={{ ...typography.h2 }}>Status</Text>
      <View style={styles.carouselContainer}>
        {myStatuses?.length > 0 && (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: Colors.gray }]}
            onPress={() => handleOwnStatusPress()}
          >
            {/* Profile Image Container with Plus Icon */}
            <View style={styles.profileContainer}>
              {/* Main Profile Circle */}
              <View style={styles.profileCircle}>
                {currentUser?.photoURL ? (
                  <Image
                    source={{ uri: currentUser.photoURL }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Text style={styles.profileText}>
                      {currentUser?.displayName?.charAt(0)?.toUpperCase() ||
                        'U'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Plus Icon - Bottom Right */}
              <View style={styles.addIconContainer}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </View>
            </View>

            <Text
              style={[
                styles.text,
                { ...typography.bodyBold, color: Colors.white },
              ]}
            >
              Add Status
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    marginTop: 10,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    width: 110,
    height: 150,
    paddingVertical: 12,
  },
  text: {
    textAlign: 'center',
  },

  // Profile container with relative positioning
  profileContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },

  // Main profile circle
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile image (if user has photo)
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },

  // Profile placeholder (if no image)
  profilePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },

  // Plus icon container - positioned at bottom-right
  addIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#25D366', // WhatsApp green
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF', // White border around plus icon
  },
});
