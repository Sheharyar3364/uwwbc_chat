import Home from '../screens/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Registeration from '../screens/Auth/Registeration';
import Otp from '../screens/Auth/Otp';

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Registeration"
          component={Registeration}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Otp"
          component={Otp}
          options={{ headerTitle: 'Verify Your Phone Number' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
