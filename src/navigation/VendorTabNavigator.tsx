import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BookingsTabIcon, ProfileTabIcon } from './tabBarIcons';
import { VendorDashboardScreen } from '../screens/vendor/VendorDashboardScreen';
import { VendorProfileScreen } from '../screens/vendor/VendorProfileScreen';
import { VendorTabParamList } from './types';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<VendorTabParamList>();

export function VendorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={VendorDashboardScreen}
        options={{
          title: 'Bookings',
          tabBarIcon: BookingsTabIcon,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={VendorProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}
