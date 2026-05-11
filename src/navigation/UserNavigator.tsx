import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BookingCreateScreen } from '../screens/user/BookingCreateScreen';
import { UserTabNavigator } from './UserTabNavigator';
import { UserStackParamList } from './types';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<UserStackParamList>();

export function UserNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="UserTabs"
        component={UserTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingCreate"
        component={BookingCreateScreen}
        options={{ title: 'Confirm booking' }}
      />
    </Stack.Navigator>
  );
}
