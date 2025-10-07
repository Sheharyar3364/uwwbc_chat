import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { StatusManager } from '@/src/utils/statusUtils';

export default function UpdatesScreen() {
  const [myStatuses, setMyStatuses] = useState([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [statusError, setStatusError] = useState(null);

  const currentUser = auth().currentUser;

  const loadMyStatuses = async () => {
    if (!currentUser) return;

    setLoadingStatuses(true);
    setStatusError(null);

    try {
      console.log('📱 Auto-loading my statuses...');
      const statuses = await StatusManager.getUserStatuses();

      // console.log('✅ Loaded statuses:', statuses);

      // // console.log('✅ Loaded statuses:', statuses.length);
      statuses.forEach(status => {
        console.log(`📄 Status ${+1}:`, {
          id: status.statusId,
          type: status.type,
          text: status.content.text,
          createdAt: status.createdAt,
        });
      });

      // setMyStatuses(statuses);
    } catch (error) {
      console.error('❌ Error loading my statuses:', error);
      // setStatusError(error.message);
    } finally {
      // setLoadingStatuses(false);
    }
  };

  useEffect(() => {
    loadMyStatuses();
  }, []);
  return (
    <View>
      <Text>Updates</Text>
    </View>
  );
}
