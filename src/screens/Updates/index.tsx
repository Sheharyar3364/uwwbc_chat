import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import Status from '@/src/components/Status';

export default function UpdatesScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 14 }}
    >
      <Status />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
