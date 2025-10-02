import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/src/constants/Colors';
import { typography } from '@/src/constants/Typography';

export default function BusinessScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Business</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders Today</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹5,240</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    ...typography.h1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    ...typography.h2,
    color: Colors.primary,
  },
  statLabel: {
    ...typography.caption,
    marginTop: 5,
  },
  actionsContainer: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    ...typography.h3,
    color: Colors.white,
  },
});
