import React from 'react';
import { TabBarImage } from '../../shared/components/TabBarImage';
import { Images } from '../../shared/assets/images';

/** Shared PNG tab icons — used by both user and vendor bottom tabs. */

export function AssistantTabIcon({ color, size }: { color: string; size: number }) {
  return <TabBarImage source={Images.chatsCircle} color={color} size={size} />;
}

export function NearbyTabIcon({ color, size }: { color: string; size: number }) {
  return <TabBarImage source={Images.guestHome} color={color} size={size} />;
}

export function BookingsTabIcon({ color, size }: { color: string; size: number }) {
  return <TabBarImage source={Images.booking} color={color} size={size} />;
}

export function ProfileTabIcon({ color, size }: { color: string; size: number }) {
  return <TabBarImage source={Images.loginProfile} color={color} size={size} />;
}
