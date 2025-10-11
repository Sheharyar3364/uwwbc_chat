import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UpdatesScreen from '../screens/Updates';
import ViewOwnStatus from '../screens/Updates/ViewOwnStatus';

const Stack = createNativeStackNavigator();

// Header Left Component (Three dots menu)
const HeaderLeft = ({ navigation }: any) => {
  const handleMenuPress = () => {
    console.log('Menu pressed');
    // Add menu functionality here
  };

  return (
    <TouchableOpacity
      onPress={handleMenuPress}
      style={styles.headerLeftButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
    </TouchableOpacity>
  );
};

// Header Right Component (Camera + Plus buttons)
const HeaderRight = ({ navigation }: any) => {
  const handleCameraPress = () => {
    console.log('Camera pressed');
    // Navigate to camera or open camera
    // navigation.navigate('Camera');
  };

  const handleAddPress = () => {
    console.log('Add pressed');
    // Navigate to create status
    // navigation.navigate('CreateStatus');
  };

  return (
    <View style={styles.headerRightContainer}>
      {/* Camera icon */}
      <TouchableOpacity
        onPress={handleCameraPress}
        style={styles.headerButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="camera-outline" size={24} color="#000" />
      </TouchableOpacity>

      {/* Plus/Add button */}
      <TouchableOpacity
        onPress={handleAddPress}
        style={[styles.headerButton, styles.addButton]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default function UpdatesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="UpdatesMain"
        component={UpdatesScreen}
        options={({ navigation }) => ({
          title: 'Updates',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
          },
          headerSearchBarOptions: {
            placeholder: 'Search',
            hideWhenScrolling: false,
          },
          // Three dots on the LEFT
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          // Camera + Plus on the RIGHT
          headerRight: () => <HeaderRight navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ViewOwnStatus"
        component={ViewOwnStatus}
        options={{
          title: 'My Status',
          headerBackTitle: 'Updates',
        }}
      />
    </Stack.Navigator>
  );
}

// Styles for header buttons
const styles = StyleSheet.create({
  // Left side (three dots)
  headerLeftButton: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },

  // Right side container
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },

  // Right side buttons
  headerButton: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },

  // Green plus button
  addButton: {
    backgroundColor: '#25D366', // WhatsApp green
    borderRadius: 16,
  },
});
