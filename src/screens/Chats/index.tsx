import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/src/constants/Colors';
import { typography } from '@/src/constants/Typography';

// Dummy data - replace with real data later
const chatData = [
  {
    id: '1',
    name: 'John Customer',
    lastMessage: 'Is this product available?',
    time: '2:30 PM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    lastMessage: 'Thank you for the order!',
    time: '1:15 PM',
    unread: 0,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    lastMessage: 'Can you deliver today?',
    time: '12:45 PM',
    unread: 1,
  },
];

export default function ChatsScreen() {
  const { top } = useSafeAreaInsets();

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>

      <FlatList
        data={chatData}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />
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
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    ...typography.h3,
    color: Colors.white,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    ...typography.h3,
  },
  chatTime: {
    ...typography.caption,
    color: Colors.gray,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...typography.body2,
    color: Colors.gray,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
