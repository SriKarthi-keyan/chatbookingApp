import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoleSelectionScreen } from '../../features/auth/RoleSelectionScreen';
import { UserLoginScreen } from '../../features/auth/UserLoginScreen';
import { UserRegisterScreen } from '../../features/auth/UserRegisterScreen';
import { VendorLoginScreen } from '../../features/auth/VendorLoginScreen';
import { VendorRegisterScreen } from '../../features/auth/VendorRegisterScreen';
import { colors } from '../../shared/theme/colors';
import { RootStackParamList } from './types';
import { UserNavigator } from './UserNavigator';
import { VendorTabNavigator } from './VendorTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="RoleSelection"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen
        name="UserRegister"
        component={UserRegisterScreen}
        options={{ headerShown: true, title: 'Create account' }}
      />
      <Stack.Screen
        name="UserLogin"
        component={UserLoginScreen}
        options={{ headerShown: true, title: 'Sign in' }}
      />
      <Stack.Screen
        name="VendorRegister"
        component={VendorRegisterScreen}
        options={{ headerShown: true, title: 'Vendor signup' }}
      />
      <Stack.Screen
        name="VendorLogin"
        component={VendorLoginScreen}
        options={{ headerShown: true, title: 'Vendor sign in' }}
      />
      <Stack.Screen name="UserApp" component={UserNavigator} />
      <Stack.Screen name="VendorApp" component={VendorTabNavigator} />
    </Stack.Navigator>
  );
}
