import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StatusDocument } from '@/src/types/status.types';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { defaultStyles } from '@/src/constants/Styles';
import auth from '@react-native-firebase/auth';
import Colors from '@/src/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ViewOwnStatusRouteProp = RouteProp<
  {
    ViewOwnStatus: {
      statuses: StatusDocument[];
    };
  },
  'ViewOwnStatus'
>;

export default function ViewOwnStatus() {
  const route = useRoute<ViewOwnStatusRouteProp>();
  const { statuses } = route.params;

  const insets = useSafeAreaInsets();
  const currentUser = auth().currentUser;

  function handleIndividualStatusPress(status: StatusDocument) {
    console.log('status', status);
  }

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.statusesContainer,
          {
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <FlatList
          data={statuses}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.statusId}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleIndividualStatusPress(item)}
              >
                <View style={styles.statusContainer}>
                  {/* Circular Avatar */}
                  <View style={styles.statusContentContainer}>
                    <Text style={styles.avatarText}>
                      {item.content.text
                        ? item.content.text
                            .split(' ')
                            .slice(0, 2) // take first 2 words
                            .join('\n') // put each on a new line
                            .toUpperCase()
                        : 'U'}
                    </Text>
                  </View>

                  {/* Status info */}
                  <View style={styles.innerItem}>
                    <Text style={styles.statusText}>
                      {item.content.text?.trim() || '(No text)'}
                    </Text>
                    <View style={styles.metaContainer}>
                      <Text style={styles.meta}>👁 {item.viewCount}</Text>
                      <Text style={styles.meta}>
                        🕒{' '}
                        {item?.createdAt?.seconds
                          ? new Date(
                              item.createdAt.seconds * 1000,
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={defaultStyles.separator}></View>
            </>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#fafafa',
  },
  statusesContainer: {
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    marginBottom: 100,
  },
  statusContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusContentContainer: {
    height: 70,
    width: 70,
    borderRadius: 35, // half of width/height for perfect circle
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 12, // adjust to fit 2 words
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16, // spacing between words
  },
  innerItem: {
    flex: 1,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  meta: {
    fontSize: 12,
    color: '#666',
  },
});
