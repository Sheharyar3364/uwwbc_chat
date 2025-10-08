import { View, Text } from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import { StatusManager } from '@/src/utils/statusUtils';
import { StatusDocument } from '@/src/types/status.types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { typography } from '../constants/Typography';

export default function Status() {
  const [myStatuses, setMyStatuses] = useState<StatusDocument[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

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

  return (
    <View>
      <Text style={{ ...typography.h2 }}>Status</Text>
      {myStatuses.map(status => (
        <View key={status.statusId} style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{status.userName}</Text>
          <Text>Type: {status.type}</Text>
          {status.content.text ? (
            <Text>Text: {status.content.text}</Text>
          ) : null}
          {status.content.mediaUrl ? (
            <Text>Media URL: {status.content.mediaUrl}</Text>
          ) : null}
          <Text>
            Created At:{' '}
            {status.createdAt
              ? status.createdAt.toDate().toLocaleString()
              : 'Loading...'}
          </Text>
          <Text>
            Expires At:{' '}
            {status.expiresAt
              ? status.expiresAt.toDate().toLocaleString()
              : 'Loading...'}
          </Text>
        </View>
      ))}
    </View>
  );
}
